import os
from pathlib import Path

from dotenv import load_dotenv
from honcho import Honcho

WORKSPACE_ID = "MAGI"

# Load backend/.env (next to this file) without overriding real shell env vars.
load_dotenv(Path(__file__).resolve().parent / ".env")


def get_honcho() -> Honcho:
    """Create a Honcho client without exposing its API key to the Expo bundle."""
    api_key = os.environ.get("HONCHO_API_KEY")
    if not api_key:
        raise RuntimeError("HONCHO_API_KEY is not set")

    return Honcho(
        workspace_id=os.environ.get("HONCHO_WORKSPACE_ID", WORKSPACE_ID),
        api_key=api_key,
        environment="production",
    )
