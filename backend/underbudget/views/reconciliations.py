""" REST APIs for reconciliations """
from flask import Flask

from underbudget.models.reconciliation import ReconciliationModel


def register(app: Flask):
    """ Registers all API rules """
    app.add_url_rule(
        "/api/accounts/<int:account_id>/reconciliations",
        view_func=create_reconciliation,
        methods=["POST"],
    )
    app.add_url_rule(
        "/api/accounts/<int:account_id>/reconciliations",
        view_func=get_reconciliations,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/accounts/<int:account_id>/reconciliations/last",
        view_func=get_last_reconciliation,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/reconciliations/<int:reconciliation_id>",
        view_func=get_reconciliation,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/reconciliations/<int:reconciliation_id>/transactions",
        view_func=get_reconciliation_transactions,
        methods=["GET"],
    )
    app.add_url_rule(
        "/api/reconciliations/<int:reconciliation_id>",
        view_func=delete_reconciliation,
        methods=["DELETE"],
    )


def create_reconciliation(account_id: int):
    """ Creates a new reconciliation """


def get_reconciliations(account_id: int):
    """ Retrieves all reconciliations for the account """


def get_last_reconciliation(account_id: int):
    """ Retrieves last reconciliation for the account """


def get_reconciliation(reconciliation_id: int):
    """ Retrieves the reconciliation """


def get_reconciliation_transactions(reconciliation_id: int):
    """ Retrieves transactions in the reconciliation """


def delete_reconciliation(reconciliation_id: int):
    """ Deletes the reconciliation """
