""" Envelope schema """
from marshmallow import Schema, fields, validate


class EnvelopeSchema(Schema):
    """ Envelope schema """

    id = fields.Integer(dump_only=True)
    category_id = fields.Integer(data_key="categoryId")
    name = fields.String(required=True, validate=validate.Length(min=1))
    archived = fields.Boolean(missing=False)
    external_id = fields.String(data_key="externalId", missing="")
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class EnvelopeCategorySchema(Schema):
    """ Envelope category schema """

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    envelopes = fields.List(
        fields.Nested(EnvelopeSchema, only=["id", "name", "archived"]), dump_only=True
    )
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)
