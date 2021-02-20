""" Flask application configuration """
import os


user = os.environ.get("POSTGRES_USER", "postgres")
password = os.environ.get("POSTGRES_PASSWORD", "postgres")
host = os.environ.get("POSTGRES_HOST", "db")
port = os.environ.get("POSTGRES_PORT", "5432")
name = os.environ.get("POSTGRES_DB", "postgres")

# pylint: disable=too-few-public-methods


class BaseConfig:
    """ Base/production configuration """

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URI", f"postgresql://{user}:{password}@{host}:{port}/{name}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevConfig(BaseConfig):
    """ Development configuration """

    DEBUG = True


class TestConfig(DevConfig):
    """ Testing configuration """

    TESTING = True
