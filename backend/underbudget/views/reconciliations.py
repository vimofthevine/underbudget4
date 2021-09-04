""" REST APIs for reconciliations """
from datetime import datetime
from typing import Any, Dict
from flask import Blueprint, Flask
from werkzeug.exceptions import BadRequest

from underbudget.common.decorators import use_args, with_pagination
from underbudget.database import db
from underbudget.models.account import AccountModel
from underbudget.models.reconciliation import ReconciliationModel
from underbudget.models.transaction import AccountTransactionModel
import underbudget.schemas.reconciliation as schema
from underbudget.schemas.transaction import AccountTransactionSearchSchema


blueprint = Blueprint("reconciliations", __name__)


def register(app: Flask):
    """ Registers the blueprint """
    app.register_blueprint(blueprint)


@blueprint.route("/api/accounts/<int:account_id>/reconciliations", methods=["POST"])
@use_args(schema.CreateReconciliationSchema())
def create_reconciliation(args: Dict[str, Any], account_id: int):
    """ Creates a new reconciliation """
    AccountModel.query.get_or_404(account_id)
    now = datetime.now()

    if not args["ending_date"] > args["beginning_date"]:
        raise BadRequest("Ending date must occur after beginning date")

    reconciliation = ReconciliationModel(
        account_id=account_id,
        beginning_balance=args["beginning_balance"],
        beginning_date=args["beginning_date"],
        ending_balance=args["ending_balance"],
        ending_date=args["ending_date"],
        created=now,
        last_updated=now,
    )
    db.session.add(reconciliation)
    db.session.flush()

    try:
        AccountTransactionModel.update_reconciliation_id(
            args["transaction_ids"], reconciliation.id
        )
    except Exception as err:
        db.session.rollback()
        raise err

    reconciliation.save()
    return {"id": int(reconciliation.id)}, 201


@blueprint.route("/api/accounts/<int:account_id>/reconciliations", methods=["GET"])
@with_pagination
def get_reconciliations(account_id: int, page: int, size: int):
    """ Retrieves all reconciliations for the account """
    return schema.ReconciliationPageSchema().dump(
        ReconciliationModel.find_by_account_id(account_id, page, size)
    )


@blueprint.route("/api/accounts/<int:account_id>/reconciliations/last", methods=["GET"])
def get_last_reconciliation(account_id: int):
    """ Retrieves last reconciliation for the account """
    return schema.BaseReconciliationSchema().dump(
        ReconciliationModel.find_last_by_account_id(account_id)
    )


@blueprint.route(
    "/api/accounts/<int:account_id>/unreconciled-transactions", methods=["GET"]
)
@with_pagination
def get_unreconciled_transactions(account_id: int, page: int, size: int):
    """ Retrieves transactions in the reconciliation """
    return AccountTransactionSearchSchema().dump(
        AccountTransactionModel.search(
            page=page,
            size=size,
            account_id={"values": [account_id]},
            reconciliation_id={"isNull": True},
        )
    )


@blueprint.route("/api/reconciliations/<int:reconciliation_id>", methods=["GET"])
def get_reconciliation(reconciliation_id: int):
    """ Retrieves the reconciliation """
    return schema.BaseReconciliationSchema().dump(
        ReconciliationModel.query.get_or_404(reconciliation_id)
    )


@blueprint.route(
    "/api/reconciliations/<int:reconciliation_id>/transactions", methods=["GET"]
)
@with_pagination
def get_reconciliation_transactions(reconciliation_id: int, page: int, size: int):
    """ Retrieves transactions in the reconciliation """
    return AccountTransactionSearchSchema().dump(
        AccountTransactionModel.search(
            page=page,
            size=size,
            reconciliation_id={"values": [reconciliation_id]},
        )
    )


@blueprint.route("/api/reconciliations/<int:reconciliation_id>", methods=["DELETE"])
def delete_reconciliation(reconciliation_id: int):
    """ Deletes the reconciliation """
    reconciliation = ReconciliationModel.query.get_or_404(reconciliation_id)
    AccountTransactionModel.remove_reconciliation_id(reconciliation_id)
    reconciliation.delete()
    return {}, 204
