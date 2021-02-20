""" Database model base and mixin classes """
from underbudget.database import db


class CrudModel:
    """ CRUD operations model """

    def save(self):
        """ Persists changes to this model instance to the database """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """ Deletes this model from the database """
        db.session.delete(self)
        db.session.commit()


# pylint: disable=too-few-public-methods
class AuditModel:
    """ Auditable model """

    created = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False)
