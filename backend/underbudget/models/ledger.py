""" Ledger database model """
from underbudget.database import db


class LedgerModel(db.Model):
    """ Ledger model """

    __tablename__ = "ledger"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(128), nullable=False)
    currency = db.Column(db.Integer, nullable=False)

    created = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False)

    def save(self):
        """ Persists changes to this model instance to the database """
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_id(cls, ledger_id):
        """ Queries for a ledger with the given ID """
        return cls.query.get(ledger_id)

    @classmethod
    def find_all(cls, page, size):
        """ Returns all ledgers with pagination """
        return cls.query.paginate(page, size)
