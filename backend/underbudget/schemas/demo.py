""" Demo API schemas """
from marshmallow import Schema, fields, validate


class DemoSchema(Schema):
    """ Demo parameters schema """

    name = fields.String(required=True, validate=validate.Length(min=1))
    currency = fields.Integer(
        strict=True, required=True, validate=validate.Range(min=1)
    )
    months = fields.Integer(required=True, validate=validate.Range(min=3))
    seed = fields.Integer(missing=None)
