import re
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
        Parses raw text of quiz questions into a structured list of ParsedQuestion objects.
        Supports multi-line inputs and precise line-number tracking.
        """
        lines = text.splitlines()
        questions: List[ParsedQuestion] = []
        current_question: Optional[ParsedQuestion] = None
        
        # State tracking: 'idle', 'question', 'options', 'answer', 'topic', 'difficulty', 'marks', 'explanation'
        state = 'idle'
        
        for idx, line_raw in enumerate(lines):
            line_num = idx + 1
            line_stripped = line_raw.strip()
            
            # Detect section transitions
            if line_stripped.lower().startswith("question:"):
                if current_question:
                    questions.append(current_question)
                current_question = ParsedQuestion(line_num)
                # Capture inline text if present on same line
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
            
            # If line is content, process based on state
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
                # Preserve format layout of explanation
                if current_question.explanation:
                    current_question.explanation += "\n" + line_raw
                else:
                    current_question.explanation = line_raw
                    
        if current_question:
            questions.append(current_question)
            
        # Post-parse cleanup and formatting
        for q in questions:
            q.question = q.question.strip()
            q.topic = q.topic.strip()
            q.difficulty = q.difficulty.strip()
            q.explanation = q.explanation.strip()
            
            # Clean marks representation
            q.marks_raw = q.marks_raw.strip()
            if q.marks_raw:
                try:
                    q.marks = int(q.marks_raw)
                except ValueError:
                    q.marks = None
                    
            # Parse letters to list of indices
            q.answer_raw = q.answer_raw.strip()
            if q.answer_raw:
                # Matches uppercase letter options, e.g. 'A', 'C'
                letters = re.findall(r'[A-Z]', q.answer_raw.upper())
                q.answer = [ord(char) - ord('A') for char in letters]
                
        return questions
