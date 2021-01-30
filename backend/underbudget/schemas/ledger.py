""" Ledger schema """
from marshmallow import Schema, fields, validate


class LedgerSchema(Schema):
    """ Ledger schema """

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    currency = fields.Integer(
        strict=True, required=True, validate=validate.Range(min=1)
    )
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class LedgersPageSchema(Schema):
    """ Paginated ledgers schema """

    items = fields.List(fields.Nested(LedgerSchema), data_key="ledgers")
    page = fields.Integer()
    per_page = fields.Integer(data_key="size")
    total = fields.Integer()
