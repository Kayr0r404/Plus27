"""Auth endpoint handlers: login, token refresh, and logout.

Handles user authentication by validating credentials and issuing
HttpOnly JWT cookies (access + refresh) along with a CSRF token.
"""

from datetime import timedelta
from typing import Annotated
import secrets

from fastapi import Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from shared.confiq import settings
from shared.auth import (
    create_access_token,
    create_refresh_token,
    verify_password,
    verify_access_token,
    verify_refresh_token,
    CurrentUser,
)
from shared.repositories.factory import get_user_repository
from ....schemas.schemas import LoginSchema


def logout():
    response = JSONResponse(content={"message": "logged out successfully"})
    for key in ("access_token", "refresh_token", "csrf_token"):
        response.delete_cookie(key=key, path="/", secure=True, samesite="lax")
    return response


async def get_me(
    current_user: Annotated[object, Depends(CurrentUser)] = None,
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    return {
        "id": str(current_user.id),
        "email": str(current_user.email),
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "username": current_user.username,
        "avatar_url": current_user.avatar_url,
        "sex": current_user.sex,
    }


async def login_for_access_token(
    form_data: LoginSchema,
):

    user_repository = get_user_repository()
    existing_user = await user_repository.get_by_email(form_data.email.lower())

    if not existing_user or not verify_password(
        form_data.password, existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials"
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(existing_user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token({"sub": str(existing_user.id)})
    csrf_token = secrets.token_hex(32)

    response = JSONResponse(content={"message": "logged in successfully"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=900,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=60 * 60 * 24 * 30,
        path="/",
    )
    response.set_cookie(
        key="csrf_token",
        value=csrf_token,
        httponly=False,
        secure=True,
        samesite="lax",
        max_age=900,
        path="/",
    )

    return response


async def refresh_token(request: Request):
    print(request)
