"""MongoDB user repository implementation via Beanie ODM.

Provides CRUD operations for users stored in MongoDB, mapping
between Beanie User documents and PrivateUserRecord/PublicUserRecord DTOs.
"""

from typing import Any, List

import pymongo
from beanie import PydanticObjectId
from pydantic import EmailStr

from shared.models.no_sql_models import User
from .schemas.user_repository import PrivateUserRecord, PublicUserRecord
from shared.auth import hash_password


class MongoUserRepository:

    @staticmethod
    def _to_public_record(user: User) -> PublicUserRecord:
        return PublicUserRecord(
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            avatar_url=user.avatar_url,
            username=user.username,
            sex=user.sex,
        )

    @staticmethod
    def _to_private_record(user: User) -> PrivateUserRecord:
        return PrivateUserRecord(
            id=str(user.id),
            email=user.email,
            hashed_password=user.hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            avatar_url=user.avatar_url,
            username=user.username,
            sex=user.sex,
        )

    async def get_by_email(self, email: EmailStr) -> PrivateUserRecord | None:
        user = await User.find_one(User.email == email.lower())
        return self._to_private_record(user) if user else None

    async def get_by_id(self, user_id: str) -> PublicUserRecord | None:
        try:
            object_id = PydanticObjectId(user_id)
        except (TypeError, ValueError):
            return None

        user = await User.get(object_id)
        return self._to_public_record(user) if user else None

    async def update_user(self, user_id: str, data: dict[str, Any]):
        try:
            object_id = PydanticObjectId(user_id)
        except (TypeError, ValueError):
            return None

        user = await User.get(object_id)
        if not user:
            return None

        allowed_fields = {
            "first_name",
            "last_name",
            "email",
            "username",
            "avatar_url",
            "sex",
        }
        for field, value in data.items():
            if field in allowed_fields and value is not None:
                setattr(user, field, value)

        await user.save()
        return self._to_private_record(user)

    async def delete_user(self, user_id: str):
        try:
            object_id = PydanticObjectId(user_id)
        except (TypeError, ValueError):
            return False

        user = await User.get(object_id)
        if not user:
            return False

        result = await user.delete()
        return result.deleted_count > 0 if result else True

    async def create_user(self, user: dict[str, Any]):
        sex = user.get("sex")
        user = User(
            first_name=user["first_name"].capitalize(),
            last_name=user["last_name"].capitalize(),
            email=user["email"].lower(),
            sex=sex.capitalize() if isinstance(sex, str) else None,
            username=user["username"].lower(),
            hashed_password=hash_password(user["password"]),
        )

        await user.insert()
        return self._to_private_record(user)

    async def get_all(self, skip: int = 0, limit: int = 20):
        return (
            User.find_all()
            .sort([("created_at", pymongo.DESCENDING)])
            .skip(skip)
            .limit(limit)
        )

    async def get_users(self) -> List[PublicUserRecord]:
        users = await User.find_all().sort("created_at", pymongo.DESCENDING).to_list()
        return [self._to_public_record(u) for u in users]
