""" Generic common schemas """
from marshmallow import Schema, fields


class IdSchema(Schema):
    """ Simple ID schema """

    id = fields.Integer()
