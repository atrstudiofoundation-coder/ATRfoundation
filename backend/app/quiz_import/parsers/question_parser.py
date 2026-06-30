import re
import json
from typing import List, Optional, Any

class ParsedQuestion:
    def __init__(self, line_number: int):
        self.line_number: int = line_number
        self.question: str = ""
        self.options: List[str] = []
        self.raw_options: List[str] = []
        self.answer_raw: str = ""
        self.answer: List[int] = []
        self.topic: str = ""
        self.difficulty: str = ""
        self.marks_raw: str = ""
        self.marks: Optional[int] = None
        self.explanation: str = ""
        
        # Line numbers of fields for precision error reporting
        self.options_line: int = line_number
        self.answer_line: int = line_number
        self.topic_line: int = line_number
        self.difficulty_line: int = line_number
        self.marks_line: int = line_number
        self.explanation_line: int = line_number

    def to_dict(self) -> dict:
        return {
            "question": self.question,
            "options": self.options,
            "answer": self.answer,
            "question_type": "multiple_choice" if len(self.answer) > 1 else "single_choice",
            "topic": self.topic,
            "difficulty": self.difficulty,
            "marks": self.marks,
            "explanation": self.explanation,
            "display_order": 0,  # Updated during bulk import
            "line_number": self.line_number
        }


class QuestionParser:
    def parse(self, text: str) -> List[ParsedQuestion]:
        """
        Parses raw text or JSON of quiz questions into a structured list of ParsedQuestion objects.
        """
        stripped_text = text.strip()
        # 1. Attempt JSON Parsing first
        if stripped_text.startswith("{") or stripped_text.startswith("["):
            try:
                data = json.loads(stripped_text)
                items = []
                if isinstance(data, list):
                    items = data
                elif isinstance(data, dict):
                    if "questions" in data and isinstance(data["questions"], list):
                        items = data["questions"]
                    else:
                        items = [data]
                
                parsed_list: List[ParsedQuestion] = []
                for idx, item in enumerate(items):
                    if not isinstance(item, dict):
                        continue
                    pq = ParsedQuestion(idx + 1)
                    pq.question = str(item.get("question") or item.get("text") or "").strip()
                    pq.options = [str(opt).strip() for opt in item.get("options", []) if str(opt).strip()]
                    pq.raw_options = list(pq.options)
                    
                    ans = item.get("answer") if "answer" in item else item.get("answers")
                    if ans is not None:
                        pq.answer_raw = str(ans)
                        if isinstance(ans, list):
                            processed_ans = []
                            for a in ans:
                                if isinstance(a, int):
                                    processed_ans.append(a)
                                elif isinstance(a, str) and a.strip().isdigit():
                                    processed_ans.append(int(a.strip()))
                                elif isinstance(a, str) and len(a.strip()) == 1 and a.strip().isalpha():
                                    processed_ans.append(ord(a.strip().upper()) - ord('A'))
                            pq.answer = processed_ans
                        elif isinstance(ans, int):
                            pq.answer = [ans]
                        elif isinstance(ans, str):
                            if ans.strip().isdigit():
                                pq.answer = [int(ans.strip())]
                            else:
                                letters = re.findall(r'[A-Z]', ans.upper())
                                pq.answer = [ord(char) - ord('A') for char in letters]
                    
                    if "topic" in item and item["topic"]:
                        pq.topic = str(item["topic"]).strip()
                    if "difficulty" in item and item["difficulty"]:
                        pq.difficulty = str(item["difficulty"]).strip()
                    if "marks" in item and item["marks"] is not None:
                        try:
                            pq.marks = int(item["marks"])
                            pq.marks_raw = str(pq.marks)
                        except (ValueError, TypeError):
                            pass
                    if "explanation" in item and item["explanation"]:
                        pq.explanation = str(item["explanation"]).strip()

                    parsed_list.append(pq)
                
                if parsed_list:
                    return parsed_list
            except Exception:
                pass  # Fall back to text parsing

        # 2. Plain Text Regex Parsing
        lines = text.splitlines()
        questions: List[ParsedQuestion] = []
        current_question: Optional[ParsedQuestion] = None
        
        state = 'idle'
        
        for idx, line_raw in enumerate(lines):
            line_num = idx + 1
            line_stripped = line_raw.strip()
            
            if line_stripped.lower().startswith("question:"):
                if current_question:
                    questions.append(current_question)
                current_question = ParsedQuestion(line_num)
                inline_content = line_raw[line_raw.lower().find("question:") + 9:].strip()
                if inline_content:
                    current_question.question = inline_content
                state = 'question'
                continue
            
            elif line_stripped.lower().startswith("options:"):
                state = 'options'
                if current_question:
                    current_question.options_line = line_num
                inline_content = line_raw[line_raw.lower().find("options:") + 8:].strip()
                if inline_content and current_question:
                    current_question.raw_options.append(inline_content)
                    clean_opt = re.sub(r'^[A-Z][\.\)\-]?\s*', '', inline_content)
                    current_question.options.append(clean_opt)
                continue
                
            elif line_stripped.lower().startswith("answer:"):
                state = 'answer'
                if current_question:
                    current_question.answer_line = line_num
                inline_content = line_raw[line_raw.lower().find("answer:") + 7:].strip()
                if inline_content and current_question:
                    current_question.answer_raw = inline_content
                continue
                
            elif line_stripped.lower().startswith("topic:"):
                state = 'topic'
                if current_question:
                    current_question.topic_line = line_num
                inline_content = line_raw[line_raw.lower().find("topic:") + 6:].strip()
                if inline_content and current_question:
                    current_question.topic = inline_content
                continue
                
            elif line_stripped.lower().startswith("difficulty:"):
                state = 'difficulty'
                if current_question:
                    current_question.difficulty_line = line_num
                inline_content = line_raw[line_raw.lower().find("difficulty:") + 11:].strip()
                if inline_content and current_question:
                    current_question.difficulty = inline_content
                continue
                
            elif line_stripped.lower().startswith("marks:"):
                state = 'marks'
                if current_question:
                    current_question.marks_line = line_num
                inline_content = line_raw[line_raw.lower().find("marks:") + 6:].strip()
                if inline_content and current_question:
                    current_question.marks_raw = inline_content
                continue
                
            elif line_stripped.lower().startswith("explanation:"):
                state = 'explanation'
                if current_question:
                    current_question.explanation_line = line_num
                inline_content = line_raw[line_raw.lower().find("explanation:") + 12:].strip()
                if inline_content and current_question:
                    current_question.explanation = inline_content
                continue
            
            if not current_question:
                continue
                
            if state == 'question':
                if current_question.question:
                    current_question.question += "\n" + line_raw
                else:
                    current_question.question = line_raw
                    
            elif state == 'options':
                if line_stripped:
                    current_question.raw_options.append(line_stripped)
                    clean_opt = re.sub(r'^[A-Z][\.\)\-]?\s*', '', line_stripped)
                    current_question.options.append(clean_opt)
                    
            elif state == 'answer':
                if line_stripped:
                    if current_question.answer_raw:
                        current_question.answer_raw += " " + line_stripped
                    else:
                        current_question.answer_raw = line_stripped
                        
            elif state == 'topic':
                if line_stripped:
                    if current_question.topic:
                        current_question.topic += " " + line_stripped
                    else:
                        current_question.topic = line_stripped
                        
            elif state == 'difficulty':
                if line_stripped:
                    if current_question.difficulty:
                        current_question.difficulty += " " + line_stripped
                    else:
                        current_question.difficulty = line_stripped
                        
            elif state == 'marks':
                if line_stripped:
                    if current_question.marks_raw:
                        current_question.marks_raw += line_stripped
                    else:
                        current_question.marks_raw = line_stripped
                        
            elif state == 'explanation':
                if current_question.explanation:
                    current_question.explanation += "\n" + line_raw
                else:
                    current_question.explanation = line_raw
                    
        if current_question:
            questions.append(current_question)
            
        for q in questions:
            q.question = q.question.strip()
            q.topic = q.topic.strip()
            q.difficulty = q.difficulty.strip()
            q.explanation = q.explanation.strip()
            
            q.marks_raw = q.marks_raw.strip()
            if q.marks_raw:
                try:
                    q.marks = int(q.marks_raw)
                except ValueError:
                    q.marks = None
                    
            q.answer_raw = q.answer_raw.strip()
            if q.answer_raw and not q.answer:
                letters = re.findall(r'[A-Z]', q.answer_raw.upper())
                if letters:
                    q.answer = [ord(char) - ord('A') for char in letters]
                elif q.answer_raw.isdigit():
                    q.answer = [int(q.answer_raw)]
                
        return questions
