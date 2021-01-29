""" Ledger REST view """
from datetime import datetime
from flask.views import MethodView

from underbudget.common.decorators import use_args, with_pagination
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.ledger as schema


ledger_schema = schema.LedgerSchema()
pages_schema = schema.LedgersPageSchema()


class LedgersView(MethodView):
    """ Ledger REST resource view """

    @staticmethod
    @with_pagination
    def get(page, size):
        """ Gets a subset of ledgers, by page """
        return pages_schema.dump(LedgerModel.find_all(page, size))

    @staticmethod
    @use_args(ledger_schema)
    def post(args):
        """ Creates a new ledger """
        now = datetime.now()

        new_ledger = LedgerModel(
            name=args["name"],
            currency=args["currency"],
            created=now,
            last_updated=now,
        )
        new_ledger.save()
        return {"id": int(new_ledger.id)}, 201
