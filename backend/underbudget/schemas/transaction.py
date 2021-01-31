""" Transaction schema """
from marshmallow import Schema, fields, validate

from underbudget.models.transaction import TransactionType


class AccountTransactionSchema(Schema):
    """ Account transaction schema """

    account_id = fields.Integer(data_key="accountId", required=True)
    amount = fields.Integer(required=True)
    memo = fields.String(missing="")
    cleared = fields.Boolean(missing=False)


class EnvelopeTransactionSchema(Schema):
    """ Envelope transaction schema """

    envelope_id = fields.Integer(data_key="envelopeId", required=True)
    amount = fields.Integer(required=True)
    memo = fields.String(missing="")


class TransactionSchema(Schema):
    """ Transaction schema """

    id = fields.Integer(dump_only=True)
    transaction_type = fields.String(
        data_key="type",
        validate=validate.OneOf(
            [name for name, _ in TransactionType.__members__.items()]
        )
    )
    recorded_date = fields.Date(data_key="recordedDate", required=True)
    payee = fields.String(required=True, validate=validate.Length(min=1))
    account_transactions = fields.List(fields.Nested(AccountTransactionSchema), data_key="accountTransactions", missing=[])
    envelope_transactions = fields.List(fields.Nested(EnvelopeTransactionSchema), data_key="envelopeTransactions", missing=[])

