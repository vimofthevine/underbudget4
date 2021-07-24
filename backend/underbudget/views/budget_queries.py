""" Active budgets REST views """
from flask import Flask
from werkzeug.exceptions import NotFound

from underbudget.models.budget import (
    ActiveBudgetModel,
    BudgetAnnualExpenseModel,
    BudgetModel,
    BudgetPeriodicExpenseModel,
)


def register(app: Flask):
    """ Registers all views """
    app.add_url_rule(
        "/api/ledgers/<int:ledger_id>/budgeted-expenses/<int:year>/<int:period>",
        view_func=budgeted_expenses_by_period,
        methods=["GET"],
    )


def budgeted_expenses_by_period(ledger_id: int, year: int, period: int):
    """ Retrieve all budgeted expenses for the specified period """
    active_budget = ActiveBudgetModel.find_by_year(ledger_id, year)
    if not active_budget:
        raise NotFound("No active budget found")

    budget = BudgetModel.query.get_or_404(active_budget.budget_id)
    if period < 0 or period >= budget.periods:
        raise NotFound("Invalid period")

    expenses_by_envelope = {}

    periodic_expenses = BudgetPeriodicExpenseModel.find_by_budget_id(active_budget.id)
    for expense in periodic_expenses:
        if expense.envelope_id in expenses_by_envelope:
            expenses_by_envelope[expense.envelope_id] += expense.amount
        else:
            expenses_by_envelope[expense.envelope_id] = expense.amount

    annual_expenses = BudgetAnnualExpenseModel.find_by_budget_id(active_budget.id)
    for expense in annual_expenses:
        if len(expense.details) > period:
            amount = expense.details[period].amount
        else:
            amount = round(expense.amount / budget.periods)
        if expense.envelope_id in expenses_by_envelope:
            expenses_by_envelope[expense.envelope_id] += amount
        else:
            expenses_by_envelope[expense.envelope_id] = amount

    return {"expensesByEnvelopeId": expenses_by_envelope}
