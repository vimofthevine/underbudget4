""" Ledger database model """
from underbudget.database import db
from underbudget.models.base import AuditModel, CrudModel


class LedgerModel(db.Model, AuditModel, CrudModel):
    """ Ledger model """

    __tablename__ = "ledger"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), nullable=False)
    currency = db.Column(db.Integer, nullable=False)

    @classmethod
    def find_by_id(cls, model_id):
        """ Queries for a model instance with the given ID """
        return cls.query.get(model_id)

    @classmethod
    def find_all(cls, page, size):
        """ Returns all ledgers with pagination """
        return cls.query.paginate(page, size)
