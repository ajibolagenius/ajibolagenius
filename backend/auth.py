"""
Admin auth: env-based credentials, JWT issue/verify, dependency to protect admin routes.
Set ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET in .env.
"""
import os
from datetime import datetime, timedelta
from typing import Optional

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
JWT_SECRET = os.environ.get("JWT_SECRET")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").strip().lower()
# Bcrypt hash of admin password. Generate with:
#   python -c "import bcrypt; print(bcrypt.hashpw(b'YOUR_PASSWORD', bcrypt.gensalt()).decode())"
ADMIN_PASSWORD_HASH = os.environ.get("ADMIN_PASSWORD_HASH")

if not JWT_SECRET:
    raise RuntimeError(
        "JWT_SECRET is not set. Add to backend/.env (e.g. openssl rand -hex 32)."
    )

PASSWORD_HASH_BYTES: Optional[bytes] = (
    ADMIN_PASSWORD_HASH.encode("utf-8") if isinstance(ADMIN_PASSWORD_HASH, str) else None
)
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24

security = HTTPBearer(auto_error=False)


def verify_admin(email: str, password: str) -> bool:
    if not ADMIN_EMAIL or not PASSWORD_HASH_BYTES:
        return False
    if email.strip().lower() != ADMIN_EMAIL:
        return False
    return bcrypt.checkpw(password.encode("utf-8"), PASSWORD_HASH_BYTES)


def create_access_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except Exception:
        return None


async def get_current_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = decode_token(credentials.credentials)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return email
