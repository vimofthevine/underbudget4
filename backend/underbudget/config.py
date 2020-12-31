""" Flask application configuration """
import os


db_name = os.environ.get("POSTGRES_DB", "postgres")
db_user = os.environ.get("POSTGRES_USER", "postgres")
db_password = os.environ.get("POSTGRES_PASSWORD", "postgres")

# pylint: disable=too-few-public-methods


class BaseConfig:
    """ Base/production configuration """

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URI", f"postgresql://{db_user}:{db_password}@db:5432/{db_name}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(BaseConfig):
    """ Development configuration """

    DEBUG = True


class TestConfig(DevConfig):
    """ Testing configuration """

    TESTING = True
