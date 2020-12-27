"""Flask application factory"""
from typing import Tuple, Dict
from flask import Flask
from sqlalchemy.exc import SQLAlchemyError


def create_app() -> Flask:
    """Creates the Flask application instance"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile("config.py", silent=True)

    # pylint: disable=import-outside-toplevel
    from underbudget.database import db

    db.init_app(app)

    # pylint: disable=unused-variable
    @app.route("/")
    def index() -> str:
        return "Hello World, I work with docker"

    with app.app_context():
        db.create_all()
        db.session.commit()

    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(err: SQLAlchemyError) -> Tuple[Dict[str, str], int]:
        print(err)
        return {"msg": "Internal error"}, 500

    return app
