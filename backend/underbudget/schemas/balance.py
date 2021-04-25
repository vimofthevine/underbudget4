""" Balance schema """
from marshmallow import Schema, fields


class BalanceQuerySchema(Schema):
    """ Balance query schema """

    date = fields.Date(required=False)
