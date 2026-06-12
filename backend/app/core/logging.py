import logging
import sys
from typing import Any

import structlog

from app.core.config import settings


def configure_logging() -> None:
    """Configure structured logging."""
    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.ExtraAdder(),
    ]

    if settings.LOG_FORMAT == "json":
        structlog.configure(
            processors=shared_processors
            + [
                structlog.processors.dict_tracebacks,
                structlog.processors.JSONRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(
                getattr(logging, settings.LOG_LEVEL.upper())
            ),
            context_class=dict,
            logger_factory=structlog.PrintLoggerFactory(),
            cache_logger_on_first_use=True,
        )
    else:
        structlog.configure(
            processors=shared_processors
            + [
                structlog.dev.ConsoleColors(),
                structlog.dev.ConsoleRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(
                getattr(logging, settings.LOG_LEVEL.upper())
            ),
            context_class=dict,
            logger_factory=structlog.PrintLoggerFactory(),
            cache_logger_on_first_use=True,
        )

    # Configure stdlib logging to use structlog
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.LOG_LEVEL.upper()),
    )
