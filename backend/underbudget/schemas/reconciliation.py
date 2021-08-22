""" Reconciliation schemas """
from marshmallow import Schema, fields


class BaseReconciliationSchema(Schema):
    """ Reconciliation schema """

    id = fields.Integer(dump_only=True)
    beginning_balance = fields.Integer(data_key="beginningBalance", required=True)
    beginning_date = fields.Date(data_key="beginningDate", required=True)
    ending_balance = fields.Integer(data_key="endingBalance", required=True)
    ending_date = fields.Date(data_key="endingDate", required=True)
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class CreateReconciliationSchema(BaseReconciliationSchema):
    """ Reconciliation creation schema """

    transaction_ids = fields.List(fields.Integer(), data_key="transactionIds")


class ReconciledTransactionSchema(Schema):
    """ Reconciled transaction schema """

    # AccountTransaction fields
    id = fields.Integer()
    amount = fields.Integer()
    memo = fields.String()
    transaction_id = fields.Integer(data_key="transactionId")
    # Transaction fields
    transaction_type = fields.String(data_key="type")
    recorded_date = fields.Date(data_key="recordedDate")
    payee = fields.String()


class ReconciledTransactionsSchema(Schema):
    """ Paginated reconciled transaction schema """

    items = fields.List(
        fields.Nested(ReconciledTransactionSchema), data_key="transactions"
    )
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()
