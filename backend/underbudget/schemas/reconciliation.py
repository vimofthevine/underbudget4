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


class ReconciliationPageSchema(Schema):
    """ Paginated reconciliations schema """

    items = fields.List(
        fields.Nested(BaseReconciliationSchema), data_key="reconciliations"
    )
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()
