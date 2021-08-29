""" Transaction REST views """
from flask import Blueprint, Flask, request
from marshmallow import utils

import underbudget.common.filter_params as filter_params
from underbudget.common.decorators import with_pagination
from underbudget.models.transaction import (
    AccountTransactionModel,
    EnvelopeTransactionModel,
    TransactionType,
)
from underbudget.schemas.transaction import (
    AccountTransactionHistorySchema,
    EnvelopeTransactionHistorySchema,
)


blueprint = Blueprint("transaction_queries", __name__)


def register(app: Flask):
    """ Registers the blueprint """
    app.register_blueprint(blueprint)


@blueprint.route("/api/account-transactions/search", methods=["GET"])
@with_pagination
def search_account_transactions(page: int, size: int):
    """ Searches for account transactions """
    return AccountTransactionHistorySchema().dump(
        AccountTransactionModel.search(
            page=page,
            size=size,
            account_id=filter_params.split_in(request.args.get("accountId"), int),
            amount=filter_params.split_comp(request.args.get("amount"), int),
            cleared=filter_params.split_bool(request.args.get("cleared")),
            memo=filter_params.split_str(request.args.get("memo")),
            payee=filter_params.split_str(request.args.get("payee")),
            reconciliation_id=filter_params.split_in(
                request.args.get("reconciliationId"), int
            ),
            recorded_date=filter_params.split_comp(
                request.args.get("recordedDate"), utils.from_iso_date
            ),
            transaction_type=filter_params.split_in(
                request.args.get("type"), TransactionType.parse
            ),
        )
    )


@blueprint.route("/api/envelope-transactions/search", methods=["GET"])
@with_pagination
def search_envelope_transactions(page: int, size: int):
    """ Searches for envelope transactions """
    return EnvelopeTransactionHistorySchema().dump(
        EnvelopeTransactionModel.search(
            page=page,
            size=size,
            amount=filter_params.split_comp(request.args.get("amount"), int),
            envelope_id=filter_params.split_in(request.args.get("envelopeId"), int),
            memo=filter_params.split_str(request.args.get("memo")),
            payee=filter_params.split_str(request.args.get("payee")),
            recorded_date=filter_params.split_comp(
                request.args.get("recordedDate"), utils.from_iso_date
            ),
            transaction_type=filter_params.split_in(
                request.args.get("type"), TransactionType.parse
            ),
        )
    )
