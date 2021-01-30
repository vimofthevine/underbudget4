"""Flask application factory"""
from typing import Tuple, Dict
from flask import Flask
from flask_restful import Api
from sqlalchemy.exc import SQLAlchemyError

from underbudget import config


def create_app(app_config=config.BaseConfig) -> Flask:
    """Creates the Flask application instance"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config)
    app.config.from_pyfile("config.py", silent=True)

    api = Api(app)

    # pylint: disable=import-outside-toplevel
    from underbudget.database import db

    db.init_app(app)

    from underbudget.resources.transactions import TransactionListResource
    from underbudget.views.accounts import AccountCategoriesView, AccountsView
    from underbudget.views.envelopes import EnvelopeCategoriesView, EnvelopesView
    from underbudget.views.ledgers import LedgersView

    LedgersView.register(app)
    AccountCategoriesView.register(app)
    AccountsView.register(app)
    EnvelopeCategoriesView.register(app)
    EnvelopesView.register(app)

    # Transactions
    api.add_resource(
        TransactionListResource, "/api/ledgers/<int:ledger_id>/transactions"
    )

    with app.app_context():
        db.create_all()
        db.session.commit()

    # pylint: disable=unused-variable
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(err: SQLAlchemyError) -> Tuple[Dict[str, str], int]:
        print(err)
        return {"msg": "Internal error"}, 500

    return app
