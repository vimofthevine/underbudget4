""" Ledger REST view """
from datetime import datetime
from typing import Any, Dict, Optional
from flask import Flask
from flask.views import MethodView

from underbudget.common.decorators import use_args, with_pagination
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.ledger as schema


ledger_schema = schema.LedgerSchema()
pages_schema = schema.LedgersPageSchema()


class LedgersView(MethodView):
    """ Ledger REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("ledgers")
        app.add_url_rule(
            "/api/ledgers",
            defaults={"ledger_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule("/api/ledgers", view_func=view, methods=["POST"])
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>",
            view_func=view,
            methods=["GET", "PUT", "DELETE"],
        )

    @staticmethod
    @with_pagination
    def get(ledger_id: Optional[int], page: int, size: int):
        """ Gets a specific ledger or a subset of all ledgers, by page """
        if ledger_id:
            return ledger_schema.dump(LedgerModel.query.get_or_404(ledger_id))
        return pages_schema.dump(LedgerModel.query.paginate(page, size))

    @staticmethod
    @use_args(ledger_schema)
    def post(args: Dict[str, Any]):
        """ Creates a new ledger """
        now = datetime.now()

        new_ledger = LedgerModel(
            name=args["name"],
            currency=args["currency"],
            created=now,
            last_updated=now,
        )
        new_ledger.save()
        return {"id": int(new_ledger.id)}, 201

    @staticmethod
    @use_args(ledger_schema)
    def put(args: Dict[str, Any], ledger_id: int):
        """ Modifies a specific ledger """
        ledger = LedgerModel.query.get_or_404(ledger_id)
        ledger.name = args["name"]
        ledger.currency = args["currency"]
        ledger.last_updated = datetime.now()
        ledger.save()
        return {}, 200

    @staticmethod
    def delete(ledger_id: int):
        """ Deletes a specific ledger """
        ledger = LedgerModel.query.get_or_404(ledger_id)
        ledger.delete()
        return {}, 204
