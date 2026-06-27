import re
import uuid
from datetime import datetime

def is_valid_uuid(val: str) -> bool:
    """
    Checks if a string is a valid UUID4.
    """
    try:
        uuid.UUID(str(val))
        return True
    except ValueError:
        return False

def format_datetime_utc(dt: datetime) -> str:
    """
    Formats a datetime object into a standardized ISO 8601 UTC string.
    """
    if dt is None:
        return ""
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

def sanitize_filename(filename: str) -> str:
    """
    Sanitizes filenames to prevent directory traversal and remove problematic characters.
    """
    # Remove directory separators
    filename = filename.replace("/", "").replace("\\", "")
    # Remove non-alphanumeric/dot/hyphen/underscore characters
    filename = re.sub(r"[^\w\.\-\s]", "", filename)
    # Strip leading/trailing whitespaces and reduce multiple spaces
    filename = re.sub(r"\s+", " ", filename).strip()
    return filename or "sanitized_file"
