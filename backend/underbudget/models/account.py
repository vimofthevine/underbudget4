""" Account database models """
from typing import List
from werkzeug.exceptions import Conflict

from underbudget.database import db
from underbudget.models.base import AuditModel, CrudModel
from underbudget.models.ledger import LedgerModel


class AccountCategoryModel(db.Model, AuditModel, CrudModel):
    """ Account category model """

    __tablename__ = "account_category"

    id = db.Column(db.Integer, primary_key=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey("ledger.id"), nullable=False)
    accounts = db.relationship("AccountModel", cascade="delete")

    name = db.Column(db.String(128), nullable=False)

    @classmethod
    def find_by_ledger_id(cls, ledger_id: int) -> List["AccountCategoryModel"]:
        """ Queries for account categories under the given ledger ID """
        return cls.query.filter_by(ledger_id=ledger_id).all()

    def delete(self):
        """ Deletes the category if it does not contain any child accounts """
        if len(self.accounts) > 0:
            raise Conflict("Category contains accounts")
        super().delete()


LedgerModel.account_categories = db.relationship(
    "AccountCategoryModel", cascade="delete"
)


class AccountModel(db.Model, AuditModel, CrudModel):
    """ Account model """

    __tablename__ = "account"

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(
        db.Integer, db.ForeignKey("account_category.id"), nullable=False
    )
    transactions = db.relationship("AccountTransactionModel", lazy="select")

    name = db.Column(db.String(128), nullable=False)
    institution = db.Column(db.String(256), nullable=False)
    account_number = db.Column(db.String(256), nullable=False)
    archived = db.Column(db.Boolean, nullable=False)
    external_id = db.Column(db.String(256), nullable=False)

    def delete(self):
        """ Deletes the account if it does not have any associated transactions """
        if len(self.transactions) > 0:
            raise Conflict("Account is referenced by transactions")
        super().delete()
