""" Budget database models """
from typing import List

from underbudget.database import db
from underbudget.models.base import AuditModel, CrudModel
from underbudget.models.ledger import LedgerModel


class BudgetModel(db.Model, AuditModel, CrudModel):
    """ Budget model """

    __tablename__ = "budget"

    id = db.Column(db.Integer, primary_key=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey("ledger.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    periods = db.Column(db.Integer, nullable=False)

    @classmethod
    def find_by_ledger_id(cls, ledger_id: int) -> List["BudgetModel"]:
        """ Queries for budgets under the given ledger ID """
        return cls.query.filter_by(ledger_id=ledger_id).all()


LedgerModel.budgets = db.relationship("BudgetModel", cascade="delete")


class ActiveBudgetModel(db.Model, AuditModel, CrudModel):
    """ Active budget model """

    __tablename__ = "active_budget"

    id = db.Column(db.Integer, primary_key=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey("ledger.id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    year = db.Column(db.Integer, nullable=False)


LedgerModel.active_budgets = db.relationship("ActiveBudgetModel", cascade="delete")


class BudgetExpectedIncome(db.Model, AuditModel, CrudModel):
    """ Budget expected income model """

    __tablename__ = "budget_expected_income"

    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Integer, nullable=False)


class BudgetPeriodicExpense(db.Model, AuditModel, CrudModel):
    """ Budget periodic expense model """

    __tablename__ = "budget_periodic_expense"

    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    envelope_id = db.Column(db.Integer, db.ForeignKey("envelope.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Integer, nullable=False)


class BudgetAnnualExpense(db.Model, AuditModel, CrudModel):
    """ Budget annual expense model """

    __tablename__ = "budget_annual_expense"

    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    envelope_id = db.Column(db.Integer, db.ForeignKey("envelope.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Integer, nullable=False)


class BudgetAnnualExpenseDetail(db.Model):
    """ Budget annual expense detail model """

    __tablename__ = "budget_annual_expense_detail"

    id = db.Column(db.Integer, primary_key=True)
    annual_budget_id = db.Column(
        db.Integer, db.ForeignKey("budget_annual_expense.id"), nullable=False
    )
    name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    period = db.Column(db.Integer, nullable=False)
