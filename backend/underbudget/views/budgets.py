""" Budgets REST view """
from datetime import datetime
from typing import Any, Dict, Optional
from flask import Flask
from flask.views import MethodView
from werkzeug.exceptions import BadRequest

from underbudget.common.decorators import use_args
from underbudget.database import db
from underbudget.models.budget import (
    ActiveBudgetModel,
    BudgetAnnualExpenseModel,
    BudgetAnnualExpenseDetailModel,
    BudgetModel,
    BudgetPeriodicExpenseModel,
    BudgetPeriodicIncomeModel,
)
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.budget as schema


budget_schema = schema.BudgetSchema()
active_budget_schema = schema.ActiveBudgetSchema()
periodic_income_schema = schema.PeriodicIncomeSchema()
periodic_expense_schema = schema.PeriodicExpenseSchema()
annual_expense_schema = schema.AnnualExpenseSchema()


def register(app: Flask):
    """ Registers all views """
    BudgetsView.register(app)
    ActiveBudgetsView.register(app)
    PeriodicIncomesView.register(app)
    PeriodicExpensesView.register(app)
    AnnualExpensesView.register(app)


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

        if budget.periods != args["periods"]:
            for annual_expense in budget.annual_expenses:
                if len(annual_expense.details) > 0:
                    raise BadRequest("Cannot change number of periods in budget")

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


class ActiveBudgetsView(MethodView):
    """ Active budget REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("active_budgets")
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/active-budgets",
            defaults={"active_budget_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/active-budgets",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/active-budgets/<int:active_budget_id>",
            defaults={"ledger_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/active-budgets/<int:active_budget_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(ledger_id: Optional[int], active_budget_id: Optional[int]):
        """ Gets a specific active budget or all active budgets in the specified ledger """
        if active_budget_id:
            return active_budget_schema.dump(
                ActiveBudgetModel.find_by_id(active_budget_id)
            )
        if ledger_id:
            return {
                "activeBudgets": active_budget_schema.dump(
                    ActiveBudgetModel.find_by_ledger_id(ledger_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(active_budget_schema)
    def post(args: Dict[str, Any], ledger_id: int):
        """ Creates a new active budget """
        LedgerModel.query.get_or_404(ledger_id)
        budget = BudgetModel.query.get_or_404(args["budget_id"])

        if ledger_id != budget.ledger_id:
            raise BadRequest("Budget is from different ledger")

        existing = ActiveBudgetModel.find_by_year(
            ledger_id=ledger_id, year=args["year"]
        )
        if existing:
            raise BadRequest(f"Active budget already specified for year {args['year']}")

        now = datetime.now()

        new_active_budget = ActiveBudgetModel(
            ledger_id=ledger_id,
            budget_id=args["budget_id"],
            year=args["year"],
            created=now,
            last_updated=now,
        )
        new_active_budget.save()
        return {"id": int(new_active_budget.id)}, 201

    @staticmethod
    @use_args(schema.ActiveBudgetSchema(exclude=["year"]))
    def put(args: Dict[str, Any], active_budget_id: int):
        """ Modifies a specific active budget """
        active_budget = ActiveBudgetModel.query.get_or_404(active_budget_id)
        BudgetModel.query.get_or_404(args["budget_id"])
        active_budget.budget_id = args["budget_id"]
        active_budget.last_updated = datetime.now()
        active_budget.save()
        return {}, 200

    @staticmethod
    def delete(active_budget_id: int):
        """ Deletes a specific active budget """
        active_budget = ActiveBudgetModel.query.get_or_404(active_budget_id)
        active_budget.delete()
        return {}, 204


class PeriodicIncomesView(MethodView):
    """ Periodic income REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("periodic_incomes")
        app.add_url_rule(
            "/api/budgets/<int:budget_id>/periodic-incomes",
            defaults={"income_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budgets/<int:budget_id>/periodic-incomes",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/budget-periodic-incomes/<int:income_id>",
            defaults={"budget_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budget-periodic-incomes/<int:income_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(budget_id: Optional[int], income_id: Optional[int]):
        """ Gets a specific periodic income or all incomes in the specified budget """
        if income_id:
            return periodic_income_schema.dump(
                BudgetPeriodicIncomeModel.query.get_or_404(income_id)
            )
        if budget_id:
            return {
                "incomes": periodic_income_schema.dump(
                    BudgetPeriodicIncomeModel.find_by_budget_id(budget_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(periodic_income_schema)
    def post(args: Dict[str, Any], budget_id: int):
        """ Creates a new periodic income """
        BudgetModel.query.get_or_404(budget_id)
        now = datetime.now()

        new_income = BudgetPeriodicIncomeModel(
            budget_id=budget_id,
            name=args["name"],
            amount=args["amount"],
            created=now,
            last_updated=now,
        )
        new_income.save()
        return {"id": int(new_income.id)}, 201

    @staticmethod
    @use_args(periodic_income_schema)
    def put(args: Dict[str, Any], income_id: int):
        """ Modifies a specific periodic income """
        income = BudgetPeriodicIncomeModel.query.get_or_404(income_id)
        income.name = args["name"]
        income.amount = args["amount"]
        income.last_updated = datetime.now()
        income.save()
        return {}, 200

    @staticmethod
    def delete(income_id: int):
        """ Deletes a specific periodic income """
        income = BudgetPeriodicIncomeModel.query.get_or_404(income_id)
        income.delete()
        return {}, 204


class PeriodicExpensesView(MethodView):
    """ Periodic expense REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("periodic_expenses")
        app.add_url_rule(
            "/api/budgets/<int:budget_id>/periodic-expenses",
            defaults={"expense_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budgets/<int:budget_id>/periodic-expenses",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/budget-periodic-expenses/<int:expense_id>",
            defaults={"budget_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budget-periodic-expenses/<int:expense_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(budget_id: Optional[int], expense_id: Optional[int]):
        """ Gets a specific periodic expense or all expenses in the specified budget """
        if expense_id:
            return periodic_expense_schema.dump(
                BudgetPeriodicExpenseModel.query.get_or_404(expense_id)
            )
        if budget_id:
            return {
                "expenses": periodic_expense_schema.dump(
                    BudgetPeriodicExpenseModel.find_by_budget_id(budget_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(periodic_expense_schema)
    def post(args: Dict[str, Any], budget_id: int):
        """ Creates a new periodic expense """
        now = datetime.now()

        budget = BudgetModel.query.get_or_404(budget_id)
        envelope = EnvelopeModel.query.get_or_404(args["envelope_id"])
        category = EnvelopeCategoryModel.query.get_or_404(envelope.category_id)

        if category.ledger_id != budget.ledger_id:
            raise BadRequest("Envelope is from different ledger")

        new_expense = BudgetPeriodicExpenseModel(
            budget_id=budget_id,
            envelope_id=envelope.id,
            name=args["name"],
            amount=args["amount"],
            created=now,
            last_updated=now,
        )
        new_expense.save()
        return {"id": int(new_expense.id)}, 201

    @staticmethod
    @use_args(periodic_expense_schema)
    def put(args: Dict[str, Any], expense_id: int):
        """ Modifies a specific periodic expense """
        expense = BudgetPeriodicExpenseModel.query.get_or_404(expense_id)

        budget = BudgetModel.query.get_or_404(expense.budget_id)
        envelope = EnvelopeModel.query.get_or_404(args["envelope_id"])
        category = EnvelopeCategoryModel.query.get_or_404(envelope.category_id)

        if category.ledger_id != budget.ledger_id:
            raise BadRequest("Envelope is from different ledger")

        expense.envelope_id = envelope.id
        expense.name = args["name"]
        expense.amount = args["amount"]
        expense.last_updated = datetime.now()
        expense.save()
        return {}, 200

    @staticmethod
    def delete(expense_id: int):
        """ Deletes a specific periodic expense """
        expense = BudgetPeriodicExpenseModel.query.get_or_404(expense_id)
        expense.delete()
        return {}, 204


class AnnualExpensesView(MethodView):
    """ Annual expense REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("annual_expenses")
        app.add_url_rule(
            "/api/budgets/<int:budget_id>/annual-expenses",
            defaults={"expense_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budgets/<int:budget_id>/annual-expenses",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/budget-annual-expenses/<int:expense_id>",
            defaults={"budget_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/budget-annual-expenses/<int:expense_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(budget_id: Optional[int], expense_id: Optional[int]):
        """ Gets a specific annual expense or all expenses in the specified budget """
        if expense_id:
            return annual_expense_schema.dump(
                BudgetAnnualExpenseModel.query.get_or_404(expense_id)
            )
        if budget_id:
            return {
                "expenses": annual_expense_schema.dump(
                    BudgetAnnualExpenseModel.find_by_budget_id(budget_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(annual_expense_schema)
    def post(args: Dict[str, Any], budget_id: int):
        """ Creates a new annual expense """
        now = datetime.now()

        budget = BudgetModel.query.get_or_404(budget_id)
        envelope = EnvelopeModel.query.get_or_404(args["envelope_id"])
        category = EnvelopeCategoryModel.query.get_or_404(envelope.category_id)

        if category.ledger_id != budget.ledger_id:
            raise BadRequest("Envelope is from different ledger")

        if args["details"]:
            if len(args["details"]) != budget.periods:
                raise BadRequest("Wrong number of period details")

            amount = 0
            for detail in args["details"]:
                amount += detail["amount"]
        else:
            amount = args["amount"]

        if amount == 0:
            raise BadRequest("Amount cannot be zero")

        new_expense = BudgetAnnualExpenseModel(
            budget_id=budget_id,
            envelope_id=envelope.id,
            name=args["name"],
            amount=amount,
            created=now,
            last_updated=now,
        )

        for period, detail in enumerate(args["details"]):
            new_detail = BudgetAnnualExpenseDetailModel(
                name=detail["name"],
                amount=detail["amount"],
                period=period,
            )
            db.session.add(new_detail)
            new_expense.details.append(new_detail)

        new_expense.save()
        return {"id": int(new_expense.id)}, 201

    @staticmethod
    @use_args(annual_expense_schema)
    def put(args: Dict[str, Any], expense_id: int):
        """ Modifies a specific periodic expense """
        expense = BudgetAnnualExpenseModel.query.get_or_404(expense_id)

        budget = BudgetModel.query.get_or_404(expense.budget_id)
        envelope = EnvelopeModel.query.get_or_404(args["envelope_id"])
        category = EnvelopeCategoryModel.query.get_or_404(envelope.category_id)

        if category.ledger_id != budget.ledger_id:
            raise BadRequest("Envelope is from different ledger")

        if args["details"]:
            num_new_details = len(args["details"])
            if num_new_details != budget.periods:
                raise BadRequest("Wrong number of period details")

            num_old_details = len(expense.details)
            if num_old_details != num_new_details:
                raise BadRequest("Wrong number of period details")

            amount = 0
            for period, detail in enumerate(args["details"]):
                amount += detail["amount"]
                expense.details[period].name = detail["name"]
                expense.details[period].amount = detail["amount"]
        else:
            amount = args["amount"]

        if amount == 0:
            raise BadRequest("Amount cannot be zero")

        expense.envelope_id = envelope.id
        expense.name = args["name"]
        expense.amount = amount

        expense.last_updated = datetime.now()
        expense.save()
        return {}, 200

    @staticmethod
    def delete(expense_id: int):
        """ Deletes a specific annual expense """
        expense = BudgetAnnualExpenseModel.query.get_or_404(expense_id)
        expense.delete()
        return {}, 204
