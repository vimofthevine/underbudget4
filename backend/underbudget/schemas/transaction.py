""" Transaction schema """
from marshmallow import Schema, fields, validate

from underbudget.models.transaction import TransactionType


class AccountTransactionSchema(Schema):
    """ Account transaction schema """

    id = fields.Integer(dump_only=True)
    account_id = fields.Integer(data_key="accountId", required=True)
    amount = fields.Integer(required=True)
    memo = fields.String(missing="")
    cleared = fields.Boolean(missing=False)
    reconciliation_id = fields.Integer(data_key="reconciliationId", dump_only=True)


class ModifyAccountTransactionSchema(AccountTransactionSchema):
    """ Account transaction modification schema """

    id = fields.Integer(required=True)


class EnvelopeTransactionSchema(Schema):
    """ Envelope transaction schema """

    id = fields.Integer(dump_only=True)
    envelope_id = fields.Integer(data_key="envelopeId", required=True)
    amount = fields.Integer(required=True)
    memo = fields.String(missing="")


class ModifyEnvelopeTransactionSchema(EnvelopeTransactionSchema):
    """ Envelope transaction modification schema """

    id = fields.Integer(required=True)


class TransactionSchema(Schema):
    """ Transaction schema """

    id = fields.Integer(dump_only=True)
    transaction_type = fields.Function(
        lambda obj: obj.transaction_type.name,
        deserialize=TransactionType.parse,
        data_key="type",
    )
    recorded_date = fields.Date(data_key="recordedDate", required=True)
    payee = fields.String(required=True, validate=validate.Length(min=1))
    account_transactions = fields.List(
        fields.Nested(AccountTransactionSchema),
        data_key="accountTransactions",
        missing=[],
    )
    envelope_transactions = fields.List(
        fields.Nested(EnvelopeTransactionSchema),
        data_key="envelopeTransactions",
        missing=[],
    )
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class AccountTransactionPatchSchema(Schema):
    """ Schema for add/mod/delete of account transactions """

    add = fields.List(fields.Nested(AccountTransactionSchema), missing=[])
    modify = fields.List(fields.Nested(ModifyAccountTransactionSchema), missing=[])
    delete = fields.List(fields.Integer, missing=[])


class EnvelopeTransactionPatchSchema(Schema):
    """ Schema for add/mod/delete of envelope transactions """

    add = fields.List(fields.Nested(EnvelopeTransactionSchema), missing=[])
    modify = fields.List(fields.Nested(ModifyEnvelopeTransactionSchema), missing=[])
    delete = fields.List(fields.Integer, missing=[])


class TransactionPatchSchema(TransactionSchema):
    """ Transaction modification (via patch) schema """

    account_transactions = fields.Nested(
        AccountTransactionPatchSchema, data_key="accountTransactions", missing={}
    )
    envelope_transactions = fields.Nested(
        EnvelopeTransactionPatchSchema, data_key="envelopeTransactions", missing={}
    )


class AccountTransactionHistoryEntrySchema(Schema):
    """ Single account transaction in history (read-only) schema """

    # AccountTransaction fields
    id = fields.Integer()
    amount = fields.Integer()
    balance = fields.Integer()
    memo = fields.String(missing="")
    cleared = fields.Boolean(missing=False)
    account_id = fields.Integer(data_key="accountId")
    reconciliation_id = fields.Integer(data_key="reconciliationId")
    transaction_id = fields.Integer(data_key="transactionId")
    # Transaction fields
    transaction_type = fields.String(data_key="type")
    recorded_date = fields.Date(data_key="recordedDate")
    payee = fields.String()


class AccountTransactionHistorySchema(Schema):
    """ Paginated account transaction history (read-only) schema """

    items = fields.List(
        fields.Nested(AccountTransactionHistoryEntrySchema), data_key="transactions"
    )
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()


class AccountTransactionSearchSchema(Schema):
    """ Paginated account transaction search result (read-only) schema """

    items = fields.List(
        fields.Nested(AccountTransactionHistoryEntrySchema(exclude=["balance"])),
        data_key="transactions",
    )
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()


class EnvelopeTransactionHistoryEntrySchema(Schema):
    """ Single envelope transaction in history (read-only) schema """

    # EnvelopeTransaction fields
    id = fields.Integer()
    amount = fields.Integer()
    balance = fields.Integer()
    memo = fields.String(missing="")
    envelope_id = fields.Integer(data_key="envelopeId")
    transaction_id = fields.Integer(data_key="transactionId")
    # Transaction fields
    transaction_type = fields.String(data_key="type")
    recorded_date = fields.Date(data_key="recordedDate")
    payee = fields.String()


class EnvelopeTransactionHistorySchema(Schema):
    """ Paginated envelope transaction history (read-only) schema """

    items = fields.List(
        fields.Nested(EnvelopeTransactionHistoryEntrySchema), data_key="transactions"
    )
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()


class EnvelopeTransactionSearchSchema(Schema):
    """ Paginated envelope transaction search result (read-only) schema """

    items = fields.List(
        fields.Nested(EnvelopeTransactionHistoryEntrySchema(exclude=["balance"])),
        data_key="transactions",
    )
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()
