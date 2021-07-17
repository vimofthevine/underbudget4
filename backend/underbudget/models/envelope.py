""" Envelope database models """
from typing import List
from werkzeug.exceptions import Conflict

from underbudget.database import db
from underbudget.models.base import AuditModel, CrudModel
from underbudget.models.ledger import LedgerModel


class EnvelopeCategoryModel(db.Model, AuditModel, CrudModel):
    """ Envelope category model """

    __tablename__ = "envelope_category"

    id = db.Column(db.Integer, primary_key=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey("ledger.id"), nullable=False)
    envelopes = db.relationship("EnvelopeModel", cascade="delete")

    name = db.Column(db.String(128), nullable=False)

    @classmethod
    def find_by_ledger_id(cls, ledger_id: int) -> List["EnvelopeCategoryModel"]:
        """ Queries for envelope categories under the given ledger ID """
        return cls.query.filter_by(ledger_id=ledger_id).all()

    def delete(self):
        """ Deletes the category if it does not contain any child envelopes """
        if len(self.envelopes) > 0:
            raise Conflict("Category contains envelopes")
        super().delete()


LedgerModel.envelope_categories = db.relationship(
    "EnvelopeCategoryModel", cascade="delete"
)


class EnvelopeModel(db.Model, AuditModel, CrudModel):
    """ Envelope model """

    __tablename__ = "envelope"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(
        db.Integer, db.ForeignKey("envelope_category.id"), nullable=False
    )
    transactions = db.relationship("EnvelopeTransactionModel", lazy="select")
    periodic_expenses = db.relationship("BudgetPeriodicExpenseModel", lazy="select")
    annual_expenses = db.relationship("BudgetAnnualExpenseModel", lazy="select")

    name = db.Column(db.String(128), nullable=False)
    archived = db.Column(db.Boolean, nullable=False)
    external_id = db.Column(db.String(256), nullable=False)

    def delete(self):
        """ Deletes the envelope if it does not have any associated transactions """
        if len(self.transactions) > 0:
            raise Conflict("Envelope is referenced by transactions")
        if len(self.periodic_expenses) > 0:
            raise Conflict("Envelope is referenced by budgeted periodic expenses")
        if len(self.annual_expenses) > 0:
            raise Conflict("Envelope is referenced by budgeted annual expenses")
        super().delete()
