""" Account database models """
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
    def find_by_id(cls, model_id):
        """ Queries for a model instance with the given ID """
        return cls.query.get(model_id)

    @classmethod
    def find_by_ledger_id(cls, ledger_id):
        """ Queries for account categories under the given ledger ID """
        return cls.query.filter_by(ledger_id=ledger_id).all()


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

    name = db.Column(db.String(128), nullable=False)
    institution = db.Column(db.String(256), nullable=False)
    account_number = db.Column(db.String(256), nullable=False)
    archived = db.Column(db.Boolean, nullable=False)
    external_id = db.Column(db.String(256), nullable=False)

    @classmethod
    def find_by_id(cls, model_id):
        """ Queries for a model instance with the given ID """
        return cls.query.get(model_id)
