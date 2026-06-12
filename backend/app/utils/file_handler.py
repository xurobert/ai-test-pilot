"""File upload handler."""
import os
import shutil
from pathlib import Path
from typing import Optional

from fastapi import UploadFile


UPLOAD_DIR = Path("/tmp/ai-test-platform/uploads")


async def save_upload_file(file: UploadFile, subfolder: Optional[str] = None) -> str:
    """Save uploaded file to disk and return the file path."""
    if subfolder:
        target_dir = UPLOAD_DIR / subfolder
    else:
        target_dir = UPLOAD_DIR
    target_dir.mkdir(parents=True, exist_ok=True)

    file_path = target_dir / (file.filename or "unnamed")
    counter = 1
    while file_path.exists():
        stem = Path(file.filename or "unnamed").stem
        suffix = Path(file.filename or "unnamed").suffix
        file_path = target_dir / f"{stem}_{counter}{suffix}"
        counter += 1

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


def get_file_extension(filename: str) -> str:
    """Get file extension in lowercase."""
    return Path(filename).suffix.lower()


def is_allowed_file(filename: str, allowed_extensions: Optional[list[str]] = None) -> bool:
    """Check if file extension is allowed."""
    if allowed_extensions is None:
        allowed_extensions = [".pdf", ".docx", ".doc", ".md", ".txt"]
    return get_file_extension(filename) in allowed_extensions
