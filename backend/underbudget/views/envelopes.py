""" Envelopes REST view """
from datetime import datetime
from typing import Any, Dict, Optional
from flask import Flask
from flask.views import MethodView

from underbudget.common.decorators import use_args
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.envelope as schema
from underbudget.schemas.common import IdSchema


envelope_schema = schema.EnvelopeSchema()
category_schema = schema.EnvelopeCategorySchema()


class EnvelopeCategoriesView(MethodView):
    """ Envelope category REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("envelope-categories")
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/envelope-categories",
            defaults={"category_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/envelope-categories",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/envelope-categories/<int:category_id>",
            defaults={"ledger_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/envelope-categories/<int:category_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(ledger_id: Optional[int], category_id: Optional[int]):
        """ Gets a specific category or all categories in the specified ledger """
        if category_id:
            return category_schema.dump(
                EnvelopeCategoryModel.query.get_or_404(category_id)
            )
        if ledger_id:
            return {
                "categories": category_schema.dump(
                    EnvelopeCategoryModel.find_by_ledger_id(ledger_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(category_schema)
    def post(args: Dict[str, Any], ledger_id: int):
        """ Creates a new category """
        LedgerModel.query.get_or_404(ledger_id)
        now = datetime.now()

        new_category = EnvelopeCategoryModel(
            ledger_id=ledger_id,
            name=args["name"],
            created=now,
            last_updated=now,
        )
        new_category.save()
        return {"id": int(new_category.id)}, 201

    @staticmethod
    @use_args(category_schema)
    def put(args: Dict[str, Any], category_id: int):
        """ Modifies a specific category """
        category = EnvelopeCategoryModel.query.get_or_404(category_id)
        category.name = args["name"]
        category.last_updated = datetime.now()
        category.save()
        return {}, 200

    @staticmethod
    def delete(category_id: int):
        """ Deletes a specific category """
        category = EnvelopeCategoryModel.query.get_or_404(category_id)
        category.delete()
        return {}, 204


class EnvelopesView(MethodView):
    """ Envelope REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("envelopes")
        app.add_url_rule(
            "/api/envelope-categories/<int:category_id>/envelopes",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/envelopes/<int:envelope_id>",
            view_func=view,
            methods=["GET", "PUT", "DELETE"],
        )
        app.add_url_rule(
            "/api/envelopes/<int:envelope_id>/category",
            view_func=EnvelopeParentCategoryView.as_view("envelope-parent"),
            methods=["PUT"],
        )

    @staticmethod
    def get(envelope_id: int):
        """ Gets a specific envelope """
        return envelope_schema.dump(EnvelopeModel.query.get_or_404(envelope_id))

    @staticmethod
    @use_args(envelope_schema)
    def post(args: Dict[str, Any], category_id: int):
        """ Creates a new envelope in the specified category """
        EnvelopeCategoryModel.query.get_or_404(category_id)
        now = datetime.now()

        new_envelope = EnvelopeModel(
            category_id=category_id,
            name=args["name"],
            archived=args["archived"],
            external_id=args["external_id"],
            created=now,
            last_updated=now,
        )
        new_envelope.save()
        return {"id": int(new_envelope.id)}, 201

    @staticmethod
    @use_args(envelope_schema)
    def put(args: Dict[str, Any], envelope_id: int):
        """ Modifies a specific envelope """
        envelope = EnvelopeModel.query.get_or_404(envelope_id)
        envelope.name = args["name"]
        envelope.archived = args["archived"]
        envelope.external_id = args["external_id"]
        envelope.last_updated = datetime.now()
        envelope.save()
        return {}, 200

    @staticmethod
    def delete(envelope_id: int):
        """ Deletes a specific envelope """
        envelope = EnvelopeModel.query.get_or_404(envelope_id)
        envelope.delete()
        return {}, 204


class EnvelopeParentCategoryView(MethodView):
    """ Envelope parent category REST resource view """

    @staticmethod
    @use_args(IdSchema)
    def put(args: Dict[str, Any], envelope_id: int):
        """ Moves an envelope to another category """
        envelope = EnvelopeModel.query.get_or_404(envelope_id)
        category = EnvelopeCategoryModel.query.get_or_404(args["id"])
        envelope.category_id = category.id
        envelope.save()
        return {}, 200
