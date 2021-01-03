""" Envelope REST resources """
from datetime import datetime
from flask_restful import Resource, fields, marshal_with, reqparse

from underbudget.common.types import not_empty
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel

envelope_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "archived": fields.Boolean,
    "externalId": fields.String(attribute="external_id"),
    "created": fields.DateTime(dt_format="iso8601"),
    "lastUpdated": fields.DateTime(attribute="last_updated", dt_format="iso8601"),
}

envelope_summary_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "archived": fields.Boolean,
}

envelope_category_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "envelopes": fields.List(fields.Nested(envelope_summary_fields)),
    "created": fields.DateTime(dt_format="iso8601"),
    "lastUpdated": fields.DateTime(attribute="last_updated", dt_format="iso8601"),
}

envelope_parser = reqparse.RequestParser()
envelope_parser.add_argument(
    "name", type=not_empty, help="Name is required", required=True, nullable=False
)
envelope_parser.add_argument(
    "archived", type=bool, default=False, required=False, nullable=False
)
envelope_parser.add_argument(
    "externalId", type=str, default="", required=False, nullable=False
)

envelope_category_parser = reqparse.RequestParser()
envelope_category_parser.add_argument(
    "name", type=not_empty, help="Name is required", required=True, nullable=False
)


class EnvelopeCategoryListResource(Resource):
    """ Envelope category list resource """

    @staticmethod
    @marshal_with(envelope_category_fields, envelope="categories")
    def get(ledger_id):
        """ Gets envelope categories for the specified ledger """
        return EnvelopeCategoryModel.find_by_ledger_id(ledger_id)

    @staticmethod
    def post(ledger_id):
        """ Creates a new envelope category in the specified ledger """
        if not LedgerModel.find_by_id(ledger_id):
            return None, 404

        data = envelope_category_parser.parse_args()
        now = datetime.now()

        new_category = EnvelopeCategoryModel(
            ledger_id=ledger_id,
            name=data["name"],
            created=now,
            last_updated=now,
        )
        new_category.save()
        return {"id": int(new_category.id)}, 201


class EnvelopeCategoryResource(Resource):
    """ Envelope category resource """

    @staticmethod
    @marshal_with(envelope_category_fields)
    def get(category_id):
        """ Gets a specific envelope category """
        category = EnvelopeCategoryModel.find_by_id(category_id)
        return category if category else (None, 404)

    @staticmethod
    def put(category_id):
        """ Modifies a specific envelope category """
        data = envelope_category_parser.parse_args()

        category = EnvelopeCategoryModel.find_by_id(category_id)
        if category:
            category.name = data["name"]
            category.last_updated = datetime.now()
            category.save()
            return None, 200
        return None, 404

    @staticmethod
    def delete(category_id):
        """ Deletes a specific envelope category """
        category = EnvelopeCategoryModel.find_by_id(category_id)
        if category:
            category.delete()
            return None, 204
        return None, 404


class EnvelopeListResource(Resource):
    """ Envelope list resource """

    @staticmethod
    def post(category_id):
        """ Creates a new envelope in the specified category """
        if not EnvelopeCategoryModel.find_by_id(category_id):
            return None, 404

        data = envelope_parser.parse_args()
        now = datetime.now()

        new_envelope = EnvelopeModel(
            category_id=category_id,
            name=data["name"],
            archived=data["archived"],
            external_id=data["externalId"],
            created=now,
            last_updated=now,
        )
        new_envelope.save()
        return {"id": int(new_envelope.id)}, 201


class EnvelopeResource(Resource):
    """ Envelope resource """

    @staticmethod
    @marshal_with(envelope_fields)
    def get(envelope_id):
        """ Gets a specific envelope """
        envelope = EnvelopeModel.find_by_id(envelope_id)
        return envelope if envelope else (None, 404)

    @staticmethod
    def put(envelope_id):
        """ Modifies a specific envelope """
        data = envelope_parser.parse_args()

        envelope = EnvelopeModel.find_by_id(envelope_id)
        if envelope:
            envelope.name = data["name"]
            envelope.archived = data["archived"]
            envelope.external_id = data["externalId"]
            envelope.last_updated = datetime.now()
            envelope.save()
            return None, 200
        return None, 404

    @staticmethod
    def delete(envelope_id):
        """ Deletes a specific envelope """
        envelope = EnvelopeModel.find_by_id(envelope_id)
        if envelope:
            envelope.delete()
            return None, 204
        return None, 404
