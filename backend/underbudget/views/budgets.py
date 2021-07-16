""" Budgets REST view """
from datetime import datetime
from typing import Any, Dict, Optional
from flask import Flask
from flask.views import MethodView
from werkzeug.exceptions import BadRequest, NotFound

from underbudget.common.decorators import use_args
from underbudget.database import db
from underbudget.models.budget import (
    ActiveBudgetModel,
    BudgetAnnualExpense,
    BudgetAnnualExpenseDetail,
    BudgetExpectedIncome,
    BudgetModel,
    BudgetPeriodicExpense,
)
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.budget as schema


budget_schema = schema.BudgetSchema()


class BudgetsView(MethodView):
    """ Budget REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("budgets")
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/budgets",
            defaults={"budget_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/budgets",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/budgets/<int:budget_id>",
            defaults={"ledger_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budgets/<int:budget_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(ledger_id: Optional[int], budget_id: Optional[int]):
        """ Gets a specific budget or all budgets in the specified ledger """
        if budget_id:
            return budget_schema.dump(BudgetModel.query.get_or_404(budget_id))
        if ledger_id:
            return {
                "budgets": budget_schema.dump(
                    BudgetModel.find_by_ledger_id(ledger_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(budget_schema)
    def post(args: Dict[str, Any], ledger_id: int):
        """ Creates a new budget """
        LedgerModel.query.get_or_404(ledger_id)
        now = datetime.now()

        new_budget = BudgetModel(
            ledger_id=ledger_id,
            name=args["name"],
            periods=args["periods"],
            created=now,
            last_updated=now,
        )
        new_budget.save()
        return {"id": int(new_budget.id)}, 201

    @staticmethod
    @use_args(budget_schema)
    def put(args: Dict[str, Any], budget_id: int):
        """ Modifies a specific budget """
        budget = BudgetModel.query.get_or_404(budget_id)
        budget.name = args["name"]
        budget.periods = args["periods"]
        budget.last_updated = datetime.now()
        budget.save()
        return {}, 200

    @staticmethod
    def delete(budget_id: int):
        """ Deletes a specific budget """
        budget = BudgetModel.query.get_or_404(budget_id)
        budget.delete()
        return {}, 204
