"""Flask application factory"""
from typing import Tuple, Dict
from flask import Flask
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.exceptions import BadRequest

from underbudget import config


# pylint: disable=too-many-locals
def create_app(app_config=config.BaseConfig) -> Flask:
    """Creates the Flask application instance"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(app_config)
    app.config.from_pyfile("config.py", silent=True)

    # pylint: disable=import-outside-toplevel
    from underbudget.database import db, migrate

    db.init_app(app)
    migrate.init_app(app, db)

    import underbudget.views.accounts as accounts
    import underbudget.views.balances as balances
    import underbudget.views.budgets as budgets
    import underbudget.views.budget_generators as budget_generators
    import underbudget.views.budget_queries as budget_queries
    import underbudget.views.demo as demo
    import underbudget.views.envelopes as envelopes
    import underbudget.views.health as health
    import underbudget.views.ledgers as ledgers
    import underbudget.views.reconciliations as reconciliations
    import underbudget.views.transactions as transactions

    health.HealthView.register(app)
    ledgers.LedgersView.register(app)
    accounts.AccountCategoriesView.register(app)
    accounts.AccountsView.register(app)
    envelopes.EnvelopeCategoriesView.register(app)
    envelopes.EnvelopesView.register(app)
    transactions.TransactionsView.register(app)
    transactions.AccountTransactionsView.register(app)
    transactions.EnvelopeTransactionsView.register(app)
    balances.AccountBalancesView.register(app)
    balances.EnvelopeBalancesView.register(app)
    budgets.register(app)
    budget_generators.register(app)
    budget_queries.register(app)
    reconciliations.register(app)
    demo.DemoView.register(app)

    # pylint: disable=unused-variable
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(err: SQLAlchemyError) -> Tuple[Dict[str, str], int]:
        print(err)
        return {"msg": "Internal error"}, 500

    @app.errorhandler(BadRequest)
    def handle_bad_request(err: BadRequest) -> Tuple[Dict[str, str], int]:
        return {"msg": err.description}, 400

    return app
