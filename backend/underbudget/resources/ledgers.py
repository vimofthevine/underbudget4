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


class LedgerListResource(Resource):
    """ Ledger list resource """

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
        now = datetime.now()

        new_ledger = LedgerModel(
            name=data["name"],
            currency=data["currency"],
            created=now,
            last_updated=now,
        )
        new_ledger.save()
        return {"id": int(new_ledger.id)}, 201


class LedgerResource(Resource):
    """ Individual ledger resource """

    @staticmethod
    @marshal_with(ledger_fields)
    def get(ledger_id):
        """ Gets a specific ledger """
        ledger = LedgerModel.find_by_id(ledger_id)
        if ledger:
            return ledger
        return None, 404

    @staticmethod
    def put(ledger_id):
        """ Modifies a specific ledger """
        data = ledger_parser.parse_args()
        now = datetime.now()

        ledger = LedgerModel.find_by_id(ledger_id)
        if ledger:
            ledger.name = data["name"]
            ledger.currency = data["currency"]
            ledger.last_updated = now
            ledger.save()
            return None, 200
        return None, 404
