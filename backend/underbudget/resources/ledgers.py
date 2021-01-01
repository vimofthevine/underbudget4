""" Ledger REST resource """
from datetime import datetime
from flask_restful import Resource, fields, marshal_with, reqparse

from underbudget.common.decorators import with_pagination
from underbudget.common.types import min_int, not_empty
from underbudget.models.ledger import LedgerModel


ledger_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "currency": fields.Integer,
    "created": fields.DateTime(dt_format="iso8601"),
    "lastUpdated": fields.DateTime(attribute="last_updated", dt_format="iso8601"),
}

paginated_ledgers_fields = {
    "ledgers": fields.List(fields.Nested(ledger_fields), attribute="items"),
    "page": fields.Integer,
    "size": fields.Integer(attribute="per_page"),
    "total": fields.Integer,
}

ledger_parser = reqparse.RequestParser()
ledger_parser.add_argument(
    "name", type=not_empty, help="Name is required", required=True, nullable=False
)
ledger_parser.add_argument(
    "currency",
    type=min_int(1),
    help="Currency is required",
    required=True,
    nullable=False,
)


class LedgerResource(Resource):
    """ Ledger resource """

    @staticmethod
    @with_pagination
    @marshal_with(paginated_ledgers_fields)
    def get(page, size):
        """ Gets a subset of ledgers, by page """
        return LedgerModel.find_all(page, size)

    @staticmethod
    def post():
        """ Creates a new ledger """
        data = ledger_parser.parse_args()

        new_ledger = LedgerModel(
            name=data["name"],
            currency=data["currency"],
            created=datetime.now(),
            last_updated=datetime.now(),
        )
        new_ledger.save()
        return {"id": int(new_ledger.id)}, 201
