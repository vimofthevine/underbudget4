""" Transactions REST view """
from datetime import datetime
from typing import Any, Dict
from flask import Flask
from flask.views import MethodView
from werkzeug.exceptions import BadRequest, NotFound

from underbudget.common.decorators import use_args, with_pagination
from underbudget.database import db
from underbudget.models.account import AccountCategoryModel, AccountModel
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
from underbudget.models.transaction import (
    AccountTransactionModel,
    EnvelopeTransactionModel,
    TransactionModel,
)
import underbudget.schemas.transaction as schema


transaction_schema = schema.TransactionSchema()
patch_schema = schema.TransactionPatchSchema()
acct_trn_history_schema = schema.AccountTransactionHistorySchema()
env_trn_history_schema = schema.EnvelopeTransactionHistorySchema()


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
        app.add_url_rule(
            "/api/transactions/<int:transaction_id>",
            view_func=view,
            methods=["GET", "PATCH", "DELETE"],
        )

    @staticmethod
    def get(transaction_id: int):
        """ Gets a specific transaction """
        return transaction_schema.dump(
            TransactionModel.query.get_or_404(transaction_id)
        )

    @classmethod
    @use_args(transaction_schema)
    def post(cls, args: Dict[str, Any], ledger_id: int):
        """ Creates a new transaction in the specified ledger """
        LedgerModel.query.get_or_404(ledger_id)

        now = datetime.now()
        new_transaction = TransactionModel(
            ledger_id=ledger_id,
            transaction_type=args.get("transaction_type"),
            recorded_date=args["recorded_date"],
            payee=args["payee"],
            created=now,
            last_updated=now,
        )

        for acct_trn_args in args["account_transactions"]:
            cls.add_account_transaction(acct_trn_args, new_transaction)

        for env_trn_args in args["envelope_transactions"]:
            cls.add_envelope_transaction(env_trn_args, new_transaction)

        new_transaction.validate()
        new_transaction.save()
        return {"id": int(new_transaction.id)}, 201

    @classmethod
    @use_args(patch_schema)
    def patch(cls, args: Dict[str, Any], transaction_id: int):
        """ Modifies a specific transaction """
        transaction = TransactionModel.query.get_or_404(transaction_id)

        with db.session.no_autoflush:
            transaction.transaction_type = args.get("transaction_type")
            transaction.recorded_date = args["recorded_date"]
            transaction.payee = args["payee"]

            for added in args["account_transactions"].get("add", []):
                cls.add_account_transaction(added, transaction)

            for modified in args["account_transactions"].get("modify", []):
                cls.modify_account_transaction(modified, transaction)

            for deleted in args["account_transactions"].get("delete", []):
                cls.delete_account_transaction(deleted, transaction)

            for added in args["envelope_transactions"].get("add", {}):
                cls.add_envelope_transaction(added, transaction)

            for modified in args["envelope_transactions"].get("modify", []):
                cls.modify_envelope_transaction(modified, transaction)

            for deleted in args["envelope_transactions"].get("delete", []):
                cls.delete_envelope_transaction(deleted, transaction)

            transaction.validate()

        transaction.save()
        return {}, 200

    @staticmethod
    def delete(transaction_id: int):
        """ Deletes a specific transaction """
        transaction = TransactionModel.query.get_or_404(transaction_id)
        transaction.delete()
        return {}, 204

    @staticmethod
    def add_account_transaction(args: Dict[str, Any], transaction: TransactionModel):
        """ Adds a new account transaction to the given transaction """
        account = AccountModel.query.get_or_404(args["account_id"])
        category = AccountCategoryModel.query.get_or_404(account.category_id)

        if category.ledger_id != transaction.ledger_id:
            raise BadRequest("Account is from different ledger")

        transaction.account_transactions.append(
            AccountTransactionModel(
                account_id=args["account_id"],
                amount=args["amount"],
                memo=args["memo"],
                cleared=args["cleared"],
            )
        )

    @staticmethod
    def modify_account_transaction(args: Dict[str, Any], transaction: TransactionModel):
        """ Modifies an existing account transaction under the given transaction """
        for acct_trn in transaction.account_transactions:
            if acct_trn.id == args["id"]:
                if acct_trn.account_id != args["account_id"]:
                    # TODO reject mod when reconciled, not cleared # pylint: disable=fixme
                    # if acct_trn.cleared:
                    #     raise BadRequest("Cannot modify cleared account transaction")

                    account = AccountModel.query.get_or_404(args["account_id"])
                    category = AccountCategoryModel.query.get_or_404(
                        account.category_id
                    )

                    if category.ledger_id != transaction.ledger_id:
                        raise BadRequest("Account is from different ledger")

                    acct_trn.account_id = args["account_id"]

                if acct_trn.amount != args["amount"]:
                    # TODO reject mod when reconciled, not cleared # pylint: disable=fixme
                    # if acct_trn.cleared:
                    #     raise BadRequest("Cannot modify cleared account transaction")
                    acct_trn.amount = args["amount"]

                acct_trn.memo = args["memo"]
                acct_trn.cleared = args["cleared"]
                return
        raise NotFound("Account transaction not found")

    @staticmethod
    def delete_account_transaction(transaction_id: int, transaction: TransactionModel):
        """ Deletes an existing account transaction from the given transaction """
        for acct_trn in transaction.account_transactions:
            if acct_trn.id == transaction_id:
                transaction.account_transactions.remove(acct_trn)
                return
        raise NotFound("Account transaction not found")

    @staticmethod
    def add_envelope_transaction(args: Dict[str, Any], transaction: TransactionModel):
        """ Adds a new envelope transaction to the given transaction """
        envelope = EnvelopeModel.query.get_or_404(args["envelope_id"])
        category = EnvelopeCategoryModel.query.get_or_404(envelope.category_id)

        if category.ledger_id != transaction.ledger_id:
            raise BadRequest("Envelope is from different ledger")

        transaction.envelope_transactions.append(
            EnvelopeTransactionModel(
                envelope_id=args["envelope_id"],
                amount=args["amount"],
                memo=args["memo"],
            )
        )

    @staticmethod
    def modify_envelope_transaction(
        args: Dict[str, Any], transaction: TransactionModel
    ):
        """ Modifies an existing envelope transaction under the given transaction """
        for env_trn in transaction.envelope_transactions:
            if env_trn.id == args["id"]:
                if env_trn.envelope_id != args["envelope_id"]:
                    envelope = EnvelopeModel.query.get_or_404(args["envelope_id"])
                    category = EnvelopeCategoryModel.query.get_or_404(
                        envelope.category_id
                    )

                    if category.ledger_id != transaction.ledger_id:
                        raise BadRequest("Envelope is from different ledger")

                    env_trn.envelope_id = args["envelope_id"]

                env_trn.amount = args["amount"]
                env_trn.memo = args["memo"]
                return
        raise NotFound("Envelope transaction not found")

    @staticmethod
    def delete_envelope_transaction(transaction_id: int, transaction: TransactionModel):
        """ Deletes an existing envelope transaction from the given transaction """
        for env_trn in transaction.envelope_transactions:
            if env_trn.id == transaction_id:
                transaction.envelope_transactions.remove(env_trn)
                return
        raise NotFound("Account transaction not found")


class AccountTransactionsView(MethodView):
    """ Account transaction REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("account-transactions")
        app.add_url_rule(
            "/api/accounts/<int:account_id>/transactions",
            view_func=view,
            methods=["GET"],
        )

    @staticmethod
    @with_pagination
    def get(account_id: int, page: int, size: int):
        """ Gets transaction history for an account """
        AccountModel.query.get_or_404(account_id)
        return acct_trn_history_schema.dump(
            AccountTransactionModel.get_history(account_id, page, size)
        )


class EnvelopeTransactionsView(MethodView):
    """ Envelope transaction REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("envelope-transactions")
        app.add_url_rule(
            "/api/envelopes/<int:envelope_id>/transactions",
            view_func=view,
            methods=["GET"],
        )

    @staticmethod
    @with_pagination
    def get(envelope_id: int, page: int, size: int):
        """ Gets transaction history for an envelope """
        EnvelopeModel.query.get_or_404(envelope_id)
        return env_trn_history_schema.dump(
            EnvelopeTransactionModel.get_history(envelope_id, page, size)
        )
