""" Budget schemas """
from marshmallow import Schema, fields, validate


ALLOWED_PERIODS = [1, 2, 3, 4, 6, 12, 24, 26, 52]


class BudgetSchema(Schema):
    """ Budget schema """

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    periods = fields.Integer(required=True, validate=validate.OneOf(ALLOWED_PERIODS))
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class ActiveBudgetSchema(Schema):
    """ Active budget schema """

    id = fields.Integer(dump_only=True)
    budget_id = fields.Integer(data_key="budgetId", required=True)
    name = fields.String(dump_only=True)
    year = fields.Integer(required=True)
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class PeriodicIncomeSchema(Schema):
    """ Budget periodic income schema """

    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    amount = fields.Integer(required=True, validate=validate.Range(min=1))
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class PeriodicExpenseSchema(Schema):
    """ Budget periodic expense schema """

    id = fields.Integer(dump_only=True)
    envelope_id = fields.Integer(data_key="envelopeId", required=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    amount = fields.Integer(required=True, validate=validate.Range(min=1))
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)


class AnnualExpenseDetailSchema(Schema):
    """ Budget annual expense detail schema """

    id = fields.Integer()
    name = fields.String(required=True, validate=validate.Length(min=1))
    amount = fields.Integer(required=True, validate=validate.Range(min=1))


class AnnualExpenseSchema(Schema):
    """ Budget annual expense schema """

    id = fields.Integer(dump_only=True)
    envelope_id = fields.Integer(data_key="envelopeId", required=True)
    name = fields.String(required=True, validate=validate.Length(min=1))
    amount = fields.Integer(required=True, validate=validate.Range(min=1))
    details = fields.List(
        fields.Nested(AnnualExpenseDetailSchema),
        missing=[],
    )
    created = fields.DateTime(dump_only=True)
    last_updated = fields.DateTime(data_key="lastUpdated", dump_only=True)
