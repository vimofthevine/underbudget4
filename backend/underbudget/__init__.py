"""Flask application factory"""
from flask import Flask


def create_app() -> Flask:
    """Creates the Flask application instance"""
    app = Flask(__name__, instance_relative_config=True)

    # pylint: disable=unused-variable
    @app.route("/")
    def index() -> str:
        return "Hello World, I work with docker"

    return app
