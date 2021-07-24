""" REST views to generate budgets """
from datetime import datetime
from typing import Any, Dict
from flask import Flask
from werkzeug.exceptions import BadRequest

from underbudget.common.decorators import use_args
from underbudget.database import db
from underbudget.models.budget import (
    BudgetAnnualExpenseModel,
    BudgetAnnualExpenseDetailModel,
    BudgetModel,
    BudgetPeriodicExpenseModel,
    BudgetPeriodicIncomeModel,
)
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.budget as schema

copy_schema = schema.CopyBudgetSchema()


def register(app: Flask):
    """ Registers all views """
    app.add_url_rule(
        "/api/ledgers/<int:ledger_id>/budgets/copy",
        view_func=create_budget_copy,
        methods=["POST"],
    )


@use_args(copy_schema)
def create_budget_copy(args: Dict[str, Any], ledger_id: int):
    """ Creates a budget as a copy of another budget """

    LedgerModel.query.get_or_404(ledger_id)
    orig_budget = BudgetModel.query.get_or_404(args["orig_id"])
    if ledger_id != orig_budget.ledger_id:
        raise BadRequest("Budget is from different ledger")

    now = datetime.now()
    new_budget = BudgetModel(
        ledger_id=ledger_id,
        name=f"Copy of {orig_budget.name}",
        periods=orig_budget.periods,
        created=now,
        last_updated=now,
    )
    db.session.add(new_budget)

    for orig_income in orig_budget.periodic_incomes:
        new_income = BudgetPeriodicIncomeModel(
            budget_id=new_budget.id,
            name=orig_income.name,
            amount=orig_income.amount,
            created=now,
            last_updated=now,
        )
        db.session.add(new_income)

    for orig_expense in orig_budget.periodic_expenses:
        new_expense = BudgetPeriodicExpenseModel(
            budget_id=new_budget.id,
            envelope_id=orig_expense.envelope_id,
            name=orig_expense.name,
            amount=orig_expense.amount,
            created=now,
            last_updated=now,
        )
        db.session.add(new_expense)

    for orig_expense in orig_budget.annual_expenses:
        new_expense = BudgetAnnualExpenseModel(
            budget_id=new_budget.id,
            envelope_id=orig_expense.envelope_id,
            name=orig_expense.name,
            amount=orig_expense.amount,
            created=now,
            last_updated=now,
        )
        for orig_detail in orig_expense.details:
            new_detail = BudgetAnnualExpenseDetailModel(
                name=orig_detail.name,
                amount=orig_detail.amount,
                period=orig_detail.period,
            )
            db.session.add(new_detail)
            new_expense.details.append(new_detail)
        db.session.add(new_expense)

    db.session.commit()
    return {"id": int(new_budget.id)}, 201
