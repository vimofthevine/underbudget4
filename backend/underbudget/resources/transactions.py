""" Transaction REST resources """
from datetime import datetime
from flask_restful import Resource, fields, inputs, marshal_with, reqparse

from underbudget.common.types import not_empty
from underbudget.models.account import AccountCategoryModel, AccountModel
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
from underbudget.models.transaction import (
    AccountTransactionModel,
    EnvelopeTransactionModel,
    TransactionModel,
    TransactionType,
)


transaction_parser = reqparse.RequestParser()
transaction_parser.add_argument(
    "type",
    type=str,
    help="Transaction type, if not auto-detected",
    required=False,
    choices=[name for name, _ in TransactionType.__members__.items()],
)
transaction_parser.add_argument(
    "recordedDate",
    type=inputs.datetime_from_iso8601,
    help="Recorded date is required",
    required=True,
    nullable=False,
)
transaction_parser.add_argument(
    "payee", type=not_empty, help="Payee is required", required=True, nullable=False
)
transaction_parser.add_argument(
    "accountTransactions",
    type=list,
    help="Account transactions",
    default=[],
    required=False,
)
transaction_parser.add_argument(
    "envelopeTransactions",
    type=list,
    help="Envelope transactions",
    default=[],
    required=False,
)

account_transaction_parser = reqparse.RequestParser()
account_transaction_parser.add_argument(
    "accountId", type=int, help="Account ID is required", required=True, nullable=False
)
account_transaction_parser.add_argument(
    "amount", type=int, help="Amount is required", required=True, nullable=False
)
account_transaction_parser.add_argument(
    "memo", type=str, default="", required=False, nullable=False
)

envelope_transaction_parser = reqparse.RequestParser()
envelope_transaction_parser.add_argument(
    "envelopeId",
    type=int,
    help="Envelope ID is required",
    required=True,
    nullable=False,
)
envelope_transaction_parser.add_argument(
    "amount", type=int, help="Amount is required", required=True, nullable=False
)
envelope_transaction_parser.add_argument(
    "memo", type=str, default="", required=False, nullable=False
)


class TransactionListResource(Resource):
    """ Transaction list resource """

    @staticmethod
    def post(ledger_id):
        """ Creates a new transaction in the specified ledger """
        if not LedgerModel.find_by_id(ledger_id):
            return None, 404

        now = datetime.now()
        transaction_data = transaction_parser.parse_args()
        new_transaction = TransactionModel(
            ledger_id=ledger_id,
            transaction_type=TransactionType[transaction_data["type"]] if transaction_data["type"] else None,
            recorded_date=transaction_data["recordedDate"],
            payee=transaction_data["payee"],
            created=now,
            last_updated=now,
        )

        print(transaction_data)

        for account_transaction in transaction_data["accountTransactions"]:
            acct_trn_data = account_transaction_parser.parse_args(
                req=account_transaction
            )

            account = AccountModel.find_by_id(acct_trn_data["accountId"])
            if not account:
                return {"message": "Account not found"}, 404

            category = AccountCategoryModel.find_by_id(account.category_id)
            if not category:
                return {"message": "Account category not found"}, 404

            if category.ledger_id != ledger_id:
                return {"message": "Account is from different ledger"}, 400

            new_transaction.account_transactions.append(AccountTransactionModel(
                account_id=acct_trn_data["accountId"],
                amount=acct_trn_data["amount"],
                memo=acct_trn_data["memo"],
            ))

        for envelope_transaction in transaction_data["envelopeTransactions"]:
            env_trn_data = envelope_transaction_parser.parse_args(
                req=envelope_transaction
            )

            envelope = EnvelopeModel.find_by_id(env_trn_data["envelopeId"])
            if not envelope:
                return {"message": "Envelope not found"}, 404

            category = EnvelopeCategoryModel.find_by_id(envelope.category_id)
            if not category:
                return {"message": "Envelope category not found"}, 404

            if category.ledger_id != ledger_id:
                return {"message": "Envelope is from different ledger"}, 400

            new_transaction.envelope_transactions.append(EnvelopeTransactionModel(
                envelope_id=env_trn_data["envelopeId"],
                amount=env_trn_data["amount"],
                memo=env_trn_data["memo"],
            ))

        (valid, error) = new_transaction.validate()
        if not valid:
            return {"message": error}, 400

        new_transaction.save()
        return {"id": int(new_transaction.id)}, 201
