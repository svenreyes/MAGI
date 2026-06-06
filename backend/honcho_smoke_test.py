from uuid import uuid4

from honcho.api_types import SessionPeerConfig

from .honcho_client import get_honcho


def main() -> None:
    honcho = get_honcho()
    user = honcho.peer("user_123")
    session = honcho.session(f"honcho-smoke-{uuid4()}")

    session.add_peers([(user, SessionPeerConfig(observe_me=True))])
    session.add_messages([user.message("I love hiking")])

    response = user.chat("What does this user like?", session=session.id)
    print(response)


if __name__ == "__main__":
    main()
