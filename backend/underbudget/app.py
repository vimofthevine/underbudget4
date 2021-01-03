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

    from underbudget.resources.accounts import (
        AccountCategoryListResource,
        AccountCategoryResource,
        AccountListResource,
        AccountResource,
    )
    from underbudget.resources.ledgers import LedgerListResource, LedgerResource

    api.add_resource(LedgerListResource, "/api/ledgers")
    api.add_resource(LedgerResource, "/api/ledgers/<int:ledger_id>")
    api.add_resource(
        AccountCategoryListResource, "/api/ledgers/<int:ledger_id>/account-categories"
    )
    api.add_resource(
        AccountCategoryResource, "/api/account-categories/<int:category_id>"
    )
    api.add_resource(
        AccountListResource, "/api/account-categories/<int:category_id>/accounts"
    )
    api.add_resource(AccountResource, "/api/accounts/<int:account_id>")

    with app.app_context():
        db.create_all()
        db.session.commit()

    # pylint: disable=unused-variable
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(err: SQLAlchemyError) -> Tuple[Dict[str, str], int]:
        print(err)
        return {"msg": "Internal error"}, 500

    return app
