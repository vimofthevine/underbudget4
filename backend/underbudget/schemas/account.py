""" Account schema """
from marshmallow import Schema, fields, validate


class AccountSchema(Schema):
    """ Account schema """

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    institution = fields.String(missing="")
    account_number = fields.String(data_key="accountNumber", missing="")
    archived = fields.Boolean(missing=False)
    external_id = fields.String(data_key="externalId", missing="")
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class AccountCategorySchema(Schema):
    """ Account category schema """

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    accounts = fields.List(
        fields.Nested(AccountSchema, only=["id", "name", "archived"]),
        dump_only=True
    )
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)
