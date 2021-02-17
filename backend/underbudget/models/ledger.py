""" Ledger database model """
from underbudget.database import db
from underbudget.models.base import AuditModel, CrudModel


class LedgerModel(db.Model, AuditModel, CrudModel):
    """ Ledger model """

    __tablename__ = "ledger"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), nullable=False)
    currency = db.Column(db.Integer, nullable=False)
