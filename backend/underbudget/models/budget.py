""" Budget database models """
from typing import List, Optional
from werkzeug.exceptions import Conflict, NotFound

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

    def delete(self):
        """ Deletes the budget if it is not an active budget for any year """
        if ActiveBudgetModel.query.filter_by(budget_id=self.id).count():
            raise Conflict("Budget is an active budget")
        super().delete()


LedgerModel.budgets = db.relationship("BudgetModel", cascade="delete", lazy="select")


class ActiveBudgetModel(db.Model, AuditModel, CrudModel):
    """ Active budget model """

    __tablename__ = "active_budget"

    id = db.Column(db.Integer, primary_key=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey("ledger.id"), nullable=False)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    year = db.Column(db.Integer, nullable=False)

    @classmethod
    def find_by_id(cls, active_budget_id: int) -> "ActiveBudgetModel":
        """ Queries for an active budget with the given ID """
        active_budget = (
            cls.query.filter_by(id=active_budget_id)
            .join(BudgetModel)
            .add_columns(
                cls.id,
                cls.budget_id,
                cls.year,
                cls.created,
                cls.last_updated,
                BudgetModel.name,
            )
            .first()
        )
        if not active_budget:
            raise NotFound()
        return active_budget

    @classmethod
    def find_by_ledger_id(cls, ledger_id: int) -> List["ActiveBudgetModel"]:
        """ Queries for active budgets under the given ledger ID """
        return (
            cls.query.filter_by(ledger_id=ledger_id)
            .join(BudgetModel)
            .add_columns(
                cls.id,
                cls.budget_id,
                cls.year,
                cls.created,
                cls.last_updated,
                BudgetModel.name,
            )
            .order_by(cls.year.desc())
            .all()
        )

    @classmethod
    def find_by_year(cls, ledger_id: int, year: int) -> Optional["ActiveBudgetModel"]:
        """ Queries for an active budget for the given year """
        return cls.query.filter_by(ledger_id=ledger_id).filter_by(year=year).first()


LedgerModel.active_budgets = db.relationship(
    "ActiveBudgetModel", cascade="delete", lazy="select"
)
BudgetModel.active_budgets = db.relationship(
    "ActiveBudgetModel", cascade="delete", lazy="select"
)


class BudgetPeriodicIncomeModel(db.Model, AuditModel, CrudModel):
    """ Budget periodic income model """

    __tablename__ = "budget_periodic_income"

    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    @classmethod
    def find_by_budget_id(cls, budget_id: int) -> List["BudgetPeriodicIncomeModel"]:
        """ Queries for periodic incomes under the given budget ID """
        return cls.query.filter_by(budget_id=budget_id).all()


BudgetModel.periodic_incomes = db.relationship(
    "BudgetPeriodicIncomeModel", cascade="delete", lazy="select"
)


class BudgetPeriodicExpenseModel(db.Model, AuditModel, CrudModel):
    """ Budget periodic expense model """

    __tablename__ = "budget_periodic_expense"

    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budget.id"), nullable=False)
    envelope_id = db.Column(db.Integer, db.ForeignKey("envelope.id"), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Integer, nullable=False)

    @classmethod
    def find_by_budget_id(cls, budget_id: int) -> List["BudgetPeriodicExpenseModel"]:
        """ Queries for periodic expenses under the given budget ID """
        return cls.query.filter_by(budget_id=budget_id).all()


BudgetModel.periodic_expenses = db.relationship(
    "BudgetPeriodicExpenseModel", cascade="delete", lazy="select"
)


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
