from typing import List, Dict, Any
from app.quiz_import.parsers.question_parser import ParsedQuestion

class QuestionValidator:
    def validate(self, q: ParsedQuestion) -> List[Dict[str, Any]]:
        """
        Validates a single ParsedQuestion instance against company rules and formats.
        Returns a list of error dictionaries containing line number and message.
        """
        errors: List[Dict[str, Any]] = []
        
        # 1. Question exists and is not empty
        if not q.question:
            errors.append({
                "line": q.line_number,
                "message": "Question text is missing or empty."
            })
            
        # 2. Minimum 2 options
        if len(q.options) < 2:
            errors.append({
                "line": q.options_line,
                "message": f"Question must have at least 2 options (found {len(q.options)})."
            })
            
        # 3. Answer validation
        if not q.answer_raw and not q.answer:
            errors.append({
                "line": q.answer_line,
                "message": "Answer field is missing."
            })
        elif not q.answer:
            errors.append({
                "line": q.answer_line,
                "message": f"Invalid answer format: '{q.answer_raw}'."
            })
        else:
            # Ensure answer indices map to existing options
            for index in q.answer:
                if index < 0 or index >= len(q.options):
                    option_letter = chr(index + ord('A')) if 0 <= index < 26 else str(index)
                    errors.append({
                        "line": q.answer_line,
                        "message": f"Selected answer Option '{option_letter}' is out of range for the {len(q.options)} available options."
                    })
                    
        # 4. Topic validation
        if not q.topic:
            errors.append({
                "line": q.topic_line,
                "message": "Required field 'topic' is missing in question schema."
            })
            
        # 5. Difficulty validation
        if not q.difficulty:
            errors.append({
                "line": q.difficulty_line,
                "message": "Required field 'difficulty' is missing in question schema."
            })
            
        # 6. Marks validation
        if not q.marks_raw:
            errors.append({
                "line": q.marks_line,
                "message": "Required field 'marks' is missing in question schema."
            })
        elif q.marks is None:
            errors.append({
                "line": q.marks_line,
                "message": f"Field 'marks' must be an integer, got '{q.marks_raw}'."
            })

        # 7. Explanation validation
        if not q.explanation:
            errors.append({
                "line": q.explanation_line,
                "message": "Required field 'explanation' is missing in question schema."
            })
            
        return errors
