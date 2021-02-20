"""Flask application factory"""
from typing import Tuple, Dict
from flask import Flask
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import BadRequest

from underbudget import config


def create_app(app_config=config.BaseConfig) -> Flask:
    """Creates the Flask application instance"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config)
    app.config.from_pyfile("config.py", silent=True)

    # pylint: disable=import-outside-toplevel
    from underbudget.database import db, migrate

    db.init_app(app)
    migrate.init_app(app, db)

    from underbudget.views.accounts import AccountCategoriesView, AccountsView
    from underbudget.views.demo import DemoView
    from underbudget.views.envelopes import EnvelopeCategoriesView, EnvelopesView
    from underbudget.views.health import HealthView
    from underbudget.views.ledgers import LedgersView
    from underbudget.views.transactions import TransactionsView

    HealthView.register(app)
    LedgersView.register(app)
    AccountCategoriesView.register(app)
    AccountsView.register(app)
    EnvelopeCategoriesView.register(app)
    EnvelopesView.register(app)
    TransactionsView.register(app)
    DemoView.register(app)

    # pylint: disable=unused-variable
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(err: SQLAlchemyError) -> Tuple[Dict[str, str], int]:
        print(err)
        return {"msg": "Internal error"}, 500

    @app.errorhandler(BadRequest)
    def handle_bad_request(err: BadRequest) -> Tuple[Dict[str, str], int]:
        return {"msg": err.description}, 400

    return app
