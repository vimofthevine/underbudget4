""" Balance resource model """
import datetime
from sqlalchemy.sql import func

from underbudget.database import db
from underbudget.models.transaction import (
    AccountTransactionModel,
    EnvelopeTransactionModel,
    TransactionModel,
)


class AccountBalanceModel:
    """ Account balance model """

    @staticmethod
    def get_balance(
        account_id: int,
        date: datetime.date,
    ) -> int:
        """ Gets the balance of an account as of a particular date. """
        result = (
            db.session.query(func.sum(AccountTransactionModel.amount).label("balance"))
            .join(TransactionModel)
            .filter(AccountTransactionModel.account_id == account_id)
            .filter(TransactionModel.recorded_date <= date)
            .first()
        )
        if result:
            return result[0]
        return 0


class EnvelopeBalanceModel:
    """ Envelope balance model """

    @staticmethod
    def get_balance(
        envelope_id: int,
        date: datetime.date,
    ) -> int:
        """ Gets the balance of an envelope as of a particular date. """
        result = (
            db.session.query(func.sum(EnvelopeTransactionModel.amount).label("balance"))
            .join(TransactionModel)
            .filter(EnvelopeTransactionModel.envelope_id == envelope_id)
            .filter(TransactionModel.recorded_date <= date)
            .first()
        )
        if result:
            return result[0]
        return 0
