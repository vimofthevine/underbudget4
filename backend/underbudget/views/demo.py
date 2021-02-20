""" Ledger REST view """
import calendar
from datetime import date, datetime, timedelta
import random
from typing import Any, Dict
from flask import Flask
from flask.views import MethodView

from underbudget.common.decorators import use_args
from underbudget.database import db
from underbudget.models.account import AccountCategoryModel, AccountModel
from underbudget.models.envelope import EnvelopeCategoryModel, EnvelopeModel
from underbudget.models.ledger import LedgerModel
from underbudget.models.transaction import (
    AccountTransactionModel,
    EnvelopeTransactionModel,
    TransactionModel,
)
from underbudget.schemas.demo import DemoSchema


class DemoView(MethodView):
    """ Demo REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        app.add_url_rule(
            "/api/demos",
            view_func=cls.as_view("demo"),
            methods=["POST"],
        )

    @use_args(DemoSchema)
    def post(self, args: Dict[str, Any]):
        """ Creates a demo ledger """
        random.seed(args["seed"])

        now = datetime.now()
        # Start num +1 months ago so the last month is completely in the past
        start = now - timedelta(days=((30 * (args["months"] + 1)) + 10))

        ledger = LedgerModel(
            name=args["name"],
            currency=args["currency"],
            created=start,
            last_updated=start,
        )

        (accounts, envelopes) = self._populate_ledger(ledger, start)
        months = self._create_dates(args["months"])
        for month in months:
            self._create_rent_transactions(ledger, month, accounts, envelopes)
            self._create_utility_transactions(ledger, month, accounts, envelopes)
            self._create_gas_transactions(ledger, month, accounts, envelopes)
            self._create_maintenance_transactions(ledger, month, accounts, envelopes)
            self._create_grocery_transactions(ledger, month, accounts, envelopes)
            self._create_dining_transactions(ledger, month, accounts, envelopes)
            self._create_clothing_transactions(ledger, month, accounts, envelopes)
            self._create_entertainment_transactions(ledger, month, accounts, envelopes)

        ledger.save()
        return {"id": int(ledger.id)}, 201

    def _create_dates(self, num_months):
        """ Creates specific dates to use based on the number of desired months """
        now = date.today()
        # Start num +1 months ago so the last month is completely in the past
        start = (now - timedelta(days=(30 * (num_months + 1)))).replace(day=1)
        months = []
        num = 0
        while start < now:
            months.append(
                self._generate_dates_for_month(start.year, start.month, num, num_months)
            )
            start = (start + timedelta(days=32)).replace(day=1)
            num = num + 1
        return months

    @staticmethod
    def _generate_dates_for_month(year, month, num, total):
        """ Generates key dates for the given month """
        first = date(year, month, 1)
        last = first.replace(day=calendar.monthrange(year, month)[1])
        return {
            "first": first,
            "fridays": [
                week[4] for week in calendar.Calendar().monthdatescalendar(year, month)
            ],
            "last": last,
            "num": num,
            "total": total,
            "is_last_month": num == total - 1,
        }

    def _populate_ledger(self, ledger, now):
        """ Creates a set of accounts and envelopes """
        acct_cat1 = self._create_account_category(ledger, "Assets", now)
        acct_cat2 = self._create_account_category(ledger, "Liabilities", now)
        accounts = {
            "checking": self._create_account(acct_cat1, "Checking Account", now),
            "savings": self._create_account(acct_cat1, "Savings Account", now),
            "credit": self._create_account(acct_cat2, "Credit Card", now),
        }

        env_cat1 = self._create_envelope_category(ledger, "Housing", now)
        env_cat2 = self._create_envelope_category(ledger, "Transportation", now)
        env_cat3 = self._create_envelope_category(ledger, "Food", now)
        env_cat4 = self._create_envelope_category(ledger, "Luxury", now)
        envelopes = {
            "rent": self._create_envelope(env_cat1, "Rent", now),
            "utilities": self._create_envelope(env_cat1, "Utilities", now),
            "gas": self._create_envelope(env_cat2, "Gas", now),
            "maintenance": self._create_envelope(env_cat2, "Car Maintenance", now),
            "groceries": self._create_envelope(env_cat3, "Groceries", now),
            "dining": self._create_envelope(env_cat3, "Dining", now),
            "clothes": self._create_envelope(env_cat4, "Clothes", now),
            "entertainment": self._create_envelope(env_cat4, "Entertainment", now),
        }

        return (accounts, envelopes)

    @staticmethod
    def _create_account_category(ledger, name, now):
        """ Creates an account category """
        category = AccountCategoryModel(
            name=name,
            created=now,
            last_updated=now,
        )
        db.session.add(category)
        ledger.account_categories.append(category)
        return category

    @staticmethod
    def _create_account(category, name, now):
        """ Creates an account """
        account = AccountModel(
            name=name,
            institution="",
            account_number="",
            archived=False,
            external_id="",
            created=now,
            last_updated=now,
        )
        db.session.add(account)
        category.accounts.append(account)
        return account

    @staticmethod
    def _create_envelope_category(ledger, name, now):
        """ Creates an envelope category """
        category = EnvelopeCategoryModel(
            name=name,
            created=now,
            last_updated=now,
        )
        db.session.add(category)
        ledger.envelope_categories.append(category)
        return category

    @staticmethod
    def _create_envelope(category, name, now):
        """ Creates an envelope """
        envelope = EnvelopeModel(
            name=name,
            archived=False,
            external_id="",
            created=now,
            last_updated=now,
        )
        db.session.add(envelope)
        category.envelopes.append(envelope)
        return envelope

    @staticmethod
    def _create_transaction(
        ledger, recorded_date, amount, payee, cleared, account, envelope
    ):  # pylint: disable=too-many-arguments
        """ Creates a simple transaction """
        trn = TransactionModel(
            transaction_type=None,
            recorded_date=recorded_date,
            payee=payee,
            created=recorded_date,
            last_updated=recorded_date,
        )
        ledger.transactions.append(trn)

        acct_trn = AccountTransactionModel(
            amount=amount,
            memo="",
            cleared=cleared,
        )
        account.transactions.append(acct_trn)
        trn.account_transactions.append(acct_trn)

        env_trn = EnvelopeTransactionModel(
            amount=amount,
            memo="",
        )
        envelope.transactions.append(env_trn)
        trn.envelope_transactions.append(env_trn)

        trn.validate()
        db.session.add(trn)

    def _create_rent_transactions(self, ledger, month, accounts, envelopes):
        """ Creates rent transactions """
        self._create_transaction(
            ledger=ledger,
            recorded_date=month["first"],
            amount=-78322,
            payee="Rent payment",
            cleared=not month["is_last_month"],
            account=accounts["checking"],
            envelope=envelopes["rent"],
        )

    def _create_utility_transactions(self, ledger, month, accounts, envelopes):
        """ Creates utility transactions """
        self._create_transaction(
            ledger=ledger,
            recorded_date=month["first"].replace(day=10),
            amount=-9846,
            payee="Electric and gas",
            cleared=not month["is_last_month"],
            account=accounts["checking"],
            envelope=envelopes["utilities"],
        )
        self._create_transaction(
            ledger=ledger,
            recorded_date=month["first"].replace(day=random.randint(9, 11)),
            amount=-9846,
            payee="Phone",
            cleared=not month["is_last_month"],
            account=accounts["credit"],
            envelope=envelopes["utilities"],
        )

    def _create_gas_transactions(self, ledger, month, accounts, envelopes):
        """ Creates gas transactions """
        for _ in range(random.randint(1, 3)):
            self._create_transaction(
                ledger=ledger,
                recorded_date=month["first"].replace(
                    day=random.randint(1, month["last"].day)
                ),
                amount=random.randint(-2700, -1700),
                payee="Gas",
                cleared=not month["is_last_month"],
                account=accounts["credit"],
                envelope=envelopes["gas"],
            )

    def _create_maintenance_transactions(self, ledger, month, accounts, envelopes):
        """ Creates maintenance transactions """
        if random.randint(1, 10) > 8:
            small = random.randint(1, 2) == 1
            self._create_transaction(
                ledger=ledger,
                recorded_date=month["first"].replace(
                    day=random.randint(1, month["last"].day)
                ),
                amount=random.randint(-3000, -1500)
                if small
                else random.randint(-50000, -15000),
                payee="Mechanic (routine)" if small else "Mechanic",
                cleared=not month["is_last_month"],
                account=accounts["credit"],
                envelope=envelopes["maintenance"],
            )

    def _create_grocery_transactions(self, ledger, month, accounts, envelopes):
        """ Creates grocery transactions """
        recorded_date = month["first"] + timedelta(days=random.randint(0, 5))
        while recorded_date <= month["last"]:
            self._create_transaction(
                ledger=ledger,
                recorded_date=recorded_date,
                amount=random.randint(-70000, -3000),
                payee="Grocer",
                cleared=not month["is_last_month"],
                account=accounts["credit"],
                envelope=envelopes["groceries"],
            )
            recorded_date = recorded_date + timedelta(days=random.randint(1, 5))

    def _create_dining_transactions(self, ledger, month, accounts, envelopes):
        """ Creates dining transactions """
        recorded_date = month["first"] + timedelta(days=random.randint(0, 3))
        while recorded_date <= month["last"]:
            self._create_transaction(
                ledger=ledger,
                recorded_date=recorded_date,
                amount=random.randint(-30000, -700),
                payee=random.choice(["Deli", "Restaurant", "Take-out"]),
                cleared=not month["is_last_month"],
                account=accounts["credit"],
                envelope=envelopes["dining"],
            )
            recorded_date = recorded_date + timedelta(days=random.randint(1, 3))

    def _create_clothing_transactions(self, ledger, month, accounts, envelopes):
        """ Creates clothing transactions """
        if random.randint(1, 10) > 4:
            self._create_transaction(
                ledger=ledger,
                recorded_date=month["first"].replace(
                    day=random.randint(1, month["last"].day)
                ),
                amount=random.randint(-4000, -2000),
                payee="Shopping mall",
                cleared=not month["is_last_month"],
                account=accounts["credit"],
                envelope=envelopes["clothes"],
            )

    def _create_entertainment_transactions(self, ledger, month, accounts, envelopes):
        """ Creates entertainment transactions """
        if random.randint(1, 10) > 7:
            self._create_transaction(
                ledger=ledger,
                recorded_date=month["first"].replace(
                    day=random.randint(1, month["last"].day)
                ),
                amount=random.randint(-1400, -1200),
                payee="Movie theater",
                cleared=not month["is_last_month"],
                account=accounts["credit"],
                envelope=envelopes["entertainment"],
            )
        self._create_transaction(
            ledger=ledger,
            recorded_date=month["first"].replace(day=21),
            amount=-798,
            payee="Streaming subscription",
            cleared=not month["is_last_month"],
            account=accounts["checking"],
            envelope=envelopes["entertainment"],
        )
