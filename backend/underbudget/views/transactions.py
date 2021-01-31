""" Transactions REST view """
from datetime import datetime
from typing import Any, Dict, Optional
from flask import Flask
from flask.views import MethodView

from underbudget.common.decorators import use_args
from underbudget.models.account import AccountCategoryModel, AccountModel
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
from underbudget.models.transaction import (
    AccountTransactionModel,
    EnvelopeTransactionModel,
    TransactionModel,
    TransactionType,
)
import underbudget.schemas.transaction as schema

transaction_schema = schema.TransactionSchema()


class TransactionsView(MethodView):
    """ Transaction REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("transactions")
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/transactions",
            view_func=view,
            methods=["POST"],
        )

    @staticmethod
    @use_args(transaction_schema)
    def post(args: Dict[str, Any], ledger_id: int):
        """ Creates a new transaction in the specified ledger """
        LedgerModel.query.get_or_404(ledger_id)

        now = datetime.now()
        new_transaction = TransactionModel(
            ledger_id=ledger_id,
            transaction_type=TransactionType.parse(args.get("transaction_type")),
            recorded_date=args["recorded_date"],
            payee=args["payee"],
            created=now,
            last_updated=now,
        )

        for acct_trn_args in args["account_transactions"]:
            account = AccountModel.query.get_or_404(acct_trn_args["account_id"])
            category = AccountCategoryModel.query.get_or_404(account.category_id)

            if category.ledger_id != ledger_id:
                return {"message": "Account is from different ledger"}, 400

            new_transaction.account_transactions.append(
                AccountTransactionModel(
                    account_id=acct_trn_args["account_id"],
                    amount=acct_trn_args["amount"],
                    memo=acct_trn_args["memo"],
                    cleared=acct_trn_args["cleared"],
                )
            )

        for env_trn_args in args["envelope_transactions"]:
            envelope = EnvelopeModel.query.get_or_404(env_trn_args["envelope_id"])
            category = EnvelopeCategoryModel.query.get_or_404(envelope.category_id)

            if category.ledger_id != ledger_id:
                return {"message": "Envelope is from different ledger"}, 400

            new_transaction.envelope_transactions.append(
                EnvelopeTransactionModel(
                    envelope_id=env_trn_args["envelope_id"],
                    amount=env_trn_args["amount"],
                    memo=env_trn_args["memo"],
                )
            )

        (valid, error) = new_transaction.validate()
        if not valid:
            return {"message": error}, 400

        new_transaction.save()
        return {"id": int(new_transaction.id)}, 201
