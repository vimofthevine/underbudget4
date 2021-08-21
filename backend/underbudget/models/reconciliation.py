""" Reconciliation database models """
from underbudget.database import db
from underbudget.models.account import AccountModel
from underbudget.models.base import AuditModel, CrudModel


class ReconciliationModel(db.Model, AuditModel, CrudModel):
    """ Reconciliation model """

    __tablename__ = "reconciliation"

    id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    beginning_balance = db.Column(db.Integer, nullable=False)
    beginning_date = db.Column(db.Date, nullable=False)
    ending_balance = db.Column(db.Integer, nullable=False)
    ending_date = db.Column(db.Date, nullable=False)

    transactions = db.relationship("AccountTransactionModel", lazy="select")


AccountModel.reconciliations = db.relationship("ReconciliationModel", cascade="delete", lazy="select")
