""" Reconciliation database models """
from werkzeug.exceptions import NotFound

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

    @classmethod
    def find_by_account_id(cls, account_id: int, page: int = 1, size: int = 20):
        """ Queries for reonciliations under the given account ID """
        return (
            cls.query.filter_by(account_id=account_id)
            .order_by(cls.ending_date.desc())
            .paginate(page, size)
        )

    @classmethod
    def find_last_by_account_id(cls, account_id: int):
        """ Queries for the last reonciliation under the given account ID """
        reconciliation = (
            cls.query.filter_by(account_id=account_id)
            .order_by(cls.ending_date.desc())
            .limit(1)
            .one_or_none()
        )
        if not reconciliation:
            raise NotFound()
        return reconciliation


AccountModel.reconciliations = db.relationship(
    "ReconciliationModel", cascade="delete", lazy="select"
)
