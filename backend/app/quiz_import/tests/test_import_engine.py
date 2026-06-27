import pytest
from app.quiz_import.parsers.question_parser import QuestionParser
from app.quiz_import.validators.validator import QuestionValidator

def test_parser_extracts_all_fields():
    raw_text = """
Question:
Which software is primarily used for CAD drafting?

Options:
A. AutoCAD
B. Photoshop
C. Lumion
D. SketchUp

Answer:
A

Topic:
Software

Difficulty:
Easy

Marks:
2

Explanation:
AutoCAD is used for technical drafting.
"""
    parser = QuestionParser()
    questions = parser.parse(raw_text)
    
    assert len(questions) == 1
    q = questions[0]
    assert q.question == "Which software is primarily used for CAD drafting?"
    assert q.options == ["AutoCAD", "Photoshop", "Lumion", "SketchUp"]
    assert q.answer == [0]
    assert q.topic == "Software"
    assert q.difficulty == "Easy"
    assert q.marks == 2
    assert q.explanation == "AutoCAD is used for technical drafting."

def test_validator_detects_errors():
    raw_text = """
Question:
Which software is primarily used for CAD drafting?

Options:
A. AutoCAD

Answer:
Z

Topic:
Software

Difficulty:
Easy

Marks:
two

Explanation:
AutoCAD is used for technical drafting.
"""
    parser = QuestionParser()
    questions = parser.parse(raw_text)
    assert len(questions) == 1
    
    validator = QuestionValidator()
    errors = validator.validate(questions[0])
    
    # Expected errors:
    # 1. Options < 2 (only AutoCAD is provided)
    # 2. Answer 'Z' is out of range
    # 3. Marks 'two' is not integer
    messages = [e["message"] for e in errors]
    assert any("at least 2 options" in msg for msg in messages)
    assert any("Option 'Z' is out of range" in msg for msg in messages)
    assert any("Marks must be an integer" in msg for msg in messages)
