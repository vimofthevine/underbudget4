""" Transaction database models """
import enum
from typing import Any, Dict, List, Optional, Type
from flask_sqlalchemy import Pagination
from sqlalchemy import text
from werkzeug.exceptions import BadRequest, NotFound

import underbudget.models.filter_ops as filter_ops
from underbudget.database import db
from underbudget.models.base import AuditModel, CrudModel
from underbudget.models.ledger import LedgerModel


class ValidationError(BadRequest):
    """ Transaction validation error """


class TransactionType(enum.Enum):
    """ Transaction type enumeration """

    income = 1
    refund = 2
    opening_balance = 3
    expense = 4
    transfer = 5
    allocation = 6
    reallocation = 7

    @classmethod
    def parse(
        cls: Type["TransactionType"], val: Optional[str]
    ) -> Optional["TransactionType"]:
        """ Creates a transaction type for the given value, if not none """
        if val:
            try:
                return cls[val]
            except Exception as err:
                raise BadRequest(f"Invalid transaction type: {val}") from err
        return None

    @classmethod
    def incomes(cls: Type["TransactionType"]) -> List["TransactionType"]:
        """ Gets all income transaction types """
        return [cls.income, cls.refund, cls.opening_balance]

    @classmethod
    def expenses(cls: Type["TransactionType"]) -> List["TransactionType"]:
        """ Gets all expense transaction types """
        return [cls.expense]

    @classmethod
    def transfers(cls: Type["TransactionType"]) -> List["TransactionType"]:
        """ Gets all transfer transaction types """
        return [cls.transfer]

    @classmethod
    def allocations(cls: Type["TransactionType"]) -> List["TransactionType"]:
        """ Gets all allocation transaction types """
        return [cls.allocation, cls.reallocation]


class TransactionModel(db.Model, AuditModel, CrudModel):
    """ Transaction model """

    __tablename__ = "transaction"

    id = db.Column(db.Integer, primary_key=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey("ledger.id"), nullable=False)
    account_transactions = db.relationship(
        "AccountTransactionModel", cascade="save-update,delete,delete-orphan"
    )
    envelope_transactions = db.relationship(
        "EnvelopeTransactionModel", cascade="save-update,delete,delete-orphan"
    )

    transaction_type = db.Column(db.Enum(TransactionType), nullable=False)
    recorded_date = db.Column(db.Date, nullable=False)
    payee = db.Column(db.String(256), nullable=False)

    def _check_type(
        self, allowed_types: List["TransactionType"], default_type: "TransactionType"
    ):
        """
        Sets the transaction type to the default type if it is undefined, or validates that
        the type is one of the allowed types.
        """
        if not self.transaction_type:
            self.transaction_type = default_type
        elif self.transaction_type not in allowed_types:
            raise ValidationError(f"Invalid type for {default_type.name} transactions")

    def validate(self):
        """
        Verifies that the transaction satisfies all integrity constraints, including:
        - zero-sum difference between account and envelope transactions
        - transaction type matches account and envelope transactions
        """
        # pylint: disable=not-an-iterable

        account_sum = sum([trn.amount for trn in self.account_transactions], 0)
        envelope_sum = sum([trn.amount for trn in self.envelope_transactions], 0)

        has_account_trns = len(self.account_transactions) != 0
        has_envelope_trns = len(self.envelope_transactions) != 0

        if account_sum - envelope_sum != 0:
            raise ValidationError("Transaction entries are unbalanced")

        if account_sum > 0:  # is an increase
            self._check_type(TransactionType.incomes(), TransactionType.income)
        elif account_sum < 0:  # is a decrease
            self._check_type(TransactionType.expenses(), TransactionType.expense)
        elif (
            has_account_trns and not has_envelope_trns
        ):  # zero-sum, only account transactions
            self._check_type(TransactionType.transfers(), TransactionType.transfer)
        elif (
            has_envelope_trns and not has_account_trns
        ):  # zero-sum, only envelope transactions
            self._check_type(TransactionType.allocations(), TransactionType.allocation)
        elif (
            has_account_trns and has_envelope_trns
        ):  # zero-sum, account and envelope transactions
            raise ValidationError(
                "Cannot transfer account and envelope balances in same transaction",
            )
        else:  # zero-sum, no transactions at all
            raise ValidationError("Missing account or envelope transactions")

        # All checks OK


LedgerModel.transactions = db.relationship(
    "TransactionModel", cascade="delete", lazy="select"
)


class AccountTransactionModel(db.Model):
    """ Account transaction model """

    __tablename__ = "account_transaction"

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(
        db.Integer, db.ForeignKey("transaction.id"), nullable=False
    )
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)

    amount = db.Column(db.Integer, nullable=False)
    memo = db.Column(db.String(256), nullable=False)
    cleared = db.Column(db.Boolean, nullable=False)

    reconciliation_id = db.Column(
        db.Integer, db.ForeignKey("reconciliation.id"), nullable=True
    )

    @classmethod
    def update_reconciliation_id(
        cls: Type["AccountTransactionModel"],
        transaction_ids: List[int],
        reconciliation_id: int,
    ):
        """ Updates the specified transactions to reference the given reconciliation """
        count = cls.query.filter(cls.id.in_(transaction_ids)).update(
            {cls.reconciliation_id: reconciliation_id}, synchronize_session=False
        )
        if count != len(transaction_ids):
            raise NotFound("Account transaction not found")

    @classmethod
    def remove_reconciliation_id(
        cls: Type["AccountTransactionModel"], reconciliation_id: int
    ):
        """ Removes any references to the given reconciliation ID from all transactions """
        cls.query.filter_by(reconciliation_id=reconciliation_id).update(
            {"reconciliation_id": None}, synchronize_session=False
        )

    @classmethod
    def get_history(
        cls: Type["AccountTransactionModel"],
        account_id: int,
        page: int = 1,
        size: int = 20,
    ):
        """ Gets ordered transaction history for a single account. """
        # Join account transactions and transactions so we can sort by date
        # and include payee, date, type.
        # Use a postgres window function to calculate the running balance.
        sql = text(
            "SELECT "
            f"{cls.__tablename__}.id as id, "
            f"{cls.__tablename__}.amount as amount, "
            f"{cls.__tablename__}.memo as memo, "
            f"{cls.__tablename__}.cleared as cleared, "
            f"{cls.__tablename__}.reconciliation_id as reconciliation_id, "
            f"{cls.__tablename__}.transaction_id as transaction_id, "
            f"{TransactionModel.__tablename__}.transaction_type as transaction_type, "
            f"{TransactionModel.__tablename__}.recorded_date as recorded_date, "
            f"{TransactionModel.__tablename__}.payee as payee, "
            f"sum({cls.__tablename__}.amount) over "
            f"  (partition by {cls.__tablename__}.account_id "
            f"  ORDER BY {TransactionModel.__tablename__}.recorded_date, "
            f"  {cls.__tablename__}.id"
            f") AS balance "
            f"FROM {cls.__tablename__}, {TransactionModel.__tablename__} "
            f"WHERE {cls.__tablename__}.transaction_id = {TransactionModel.__tablename__}.id "
            f"AND {cls.__tablename__}.account_id = :account_id "
            f"ORDER BY {TransactionModel.__tablename__}.recorded_date DESC, "
            f"{cls.__tablename__}.id DESC "
            "LIMIT :size OFFSET :page"
        )
        transactions = db.session.execute(
            sql, {"account_id": account_id, "page": ((page - 1) * size), "size": size}
        )
        total = cls.query.filter_by(account_id=account_id).count()
        return Pagination(cls.query, page, size, total, transactions)

    # pylint: disable=too-many-arguments
    @classmethod
    def search(
        cls: Type["AccountTransactionModel"],
        page: int = 1,
        size: int = 20,
        account_id: Optional[Dict[str, Any]] = None,
        amount: Optional[Dict[str, Any]] = None,
        cleared: Optional[Dict[str, Any]] = None,
        memo: Optional[Dict[str, Any]] = None,
        payee: Optional[Dict[str, Any]] = None,
        reconciliation_id: Optional[Dict[str, Any]] = None,
        recorded_date: Optional[Dict[str, Any]] = None,
        transaction_type: Optional[Dict[str, Any]] = None,
    ):
        """ Searches for account transactions """
        query = cls.query.join(TransactionModel).add_columns(
            cls.id,
            cls.account_id,
            cls.amount,
            cls.cleared,
            cls.memo,
            cls.reconciliation_id,
            TransactionModel.transaction_type,
            TransactionModel.recorded_date,
            TransactionModel.payee,
        )
        if account_id:
            query = filter_ops.filter_in(query, cls.account_id, **account_id)
        if amount:
            query = filter_ops.filter_comp(query, cls.amount, **amount)
        if cleared:
            query = filter_ops.filter_bool(query, cls.cleared, **cleared)
        if memo:
            query = filter_ops.filter_str(query, cls.memo, **memo)
        if payee:
            query = filter_ops.filter_str(query, TransactionModel.payee, **payee)
        if reconciliation_id:
            query = filter_ops.filter_in(
                query, cls.reconciliation_id, **reconciliation_id
            )
        if recorded_date:
            query = filter_ops.filter_comp(
                query, TransactionModel.recorded_date, **recorded_date
            )
        if transaction_type:
            query = filter_ops.filter_in(
                query, TransactionModel.transaction_type, **transaction_type
            )
        return query.order_by(TransactionModel.recorded_date.desc()).paginate(
            page, size
        )


class EnvelopeTransactionModel(db.Model):
    """ Envelope transaction model """

    __tablename__ = "envelope_transaction"

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(
        db.Integer, db.ForeignKey("transaction.id"), nullable=False
    )
    envelope_id = db.Column(db.Integer, db.ForeignKey("envelope.id"), nullable=False)

    amount = db.Column(db.Integer, nullable=False)
    memo = db.Column(db.String(256), nullable=False)

    @classmethod
    def get_history(
        cls: Type["EnvelopeTransactionModel"],
        envelope_id: int,
        page: int = 1,
        size: int = 20,
    ):
        """ Gets ordered transaction history for a single envelope. """
        # Join envelope transactions and transactions so we can sort by date
        # and include payee, date, type.
        # Use a postgres window function to calculate the running balance.
        sql = text(
            "SELECT "
            f"{cls.__tablename__}.id as id, "
            f"{cls.__tablename__}.amount as amount, "
            f"{cls.__tablename__}.memo as memo, "
            f"{cls.__tablename__}.transaction_id as transaction_id, "
            f"{TransactionModel.__tablename__}.transaction_type as transaction_type, "
            f"{TransactionModel.__tablename__}.recorded_date as recorded_date, "
            f"{TransactionModel.__tablename__}.payee as payee, "
            f"sum({cls.__tablename__}.amount) over "
            f"  (partition by {cls.__tablename__}.envelope_id "
            f"  ORDER BY {TransactionModel.__tablename__}.recorded_date, "
            f"  {cls.__tablename__}.id"
            f") AS balance "
            f"FROM {cls.__tablename__}, {TransactionModel.__tablename__} "
            f"WHERE {cls.__tablename__}.transaction_id = {TransactionModel.__tablename__}.id "
            f"AND {cls.__tablename__}.envelope_id = :envelope_id "
            f"ORDER BY {TransactionModel.__tablename__}.recorded_date DESC, "
            f"{cls.__tablename__}.id DESC "
            "LIMIT :size OFFSET :page"
        )
        transactions = db.session.execute(
            sql, {"envelope_id": envelope_id, "page": ((page - 1) * size), "size": size}
        )
        total = cls.query.filter_by(envelope_id=envelope_id).count()
        return Pagination(cls.query, page, size, total, transactions)

    # pylint: disable=too-many-arguments
    @classmethod
    def search(
        cls: Type["EnvelopeTransactionModel"],
        page: int = 1,
        size: int = 20,
        amount: Optional[Dict[str, Any]] = None,
        envelope_id: Optional[Dict[str, Any]] = None,
        memo: Optional[Dict[str, Any]] = None,
        payee: Optional[Dict[str, Any]] = None,
        recorded_date: Optional[Dict[str, Any]] = None,
        transaction_type: Optional[Dict[str, Any]] = None,
    ):
        """ Searches for envelope transactions """
        query = cls.query.join(TransactionModel).add_columns(
            cls.id,
            cls.amount,
            cls.envelope_id,
            cls.memo,
            TransactionModel.transaction_type,
            TransactionModel.recorded_date,
            TransactionModel.payee,
        )
        if amount:
            query = filter_ops.filter_comp(query, cls.amount, **amount)
        if envelope_id:
            query = filter_ops.filter_in(query, cls.envelope_id, **envelope_id)
        if memo:
            query = filter_ops.filter_str(query, cls.memo, **memo)
        if payee:
            query = filter_ops.filter_str(query, TransactionModel.payee, **payee)
        if recorded_date:
            query = filter_ops.filter_comp(
                query, TransactionModel.recorded_date, **recorded_date
            )
        if transaction_type:
            query = filter_ops.filter_in(
                query, TransactionModel.transaction_type, **transaction_type
            )
        return query.order_by(TransactionModel.recorded_date.desc()).paginate(
            page, size
        )
