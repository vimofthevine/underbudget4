""" Integration tests for transaction APIs """
import json
from jsonpath_ng import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class TransactionsTestCase(BaseTestCase):
    """ Integration tests for transaction APIs """

    @parameterized.expand([("not-an-id",), (999,)])
    def test_transaction_requires_valid_ledger(self, ledger_id=None):
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
            },
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            ("Payee", "Unit Testers"),
            ("payee", ""),
            ("payee", None),
        ]
    )
    def test_transaction_requires_valid_payee(self, key, value):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                key: value,
            },
        )
        assert resp.status_code == 400
        assert b"payee" in resp.data

    @parameterized.expand(
        [
            ("RecordedDate", "2021-01-024"),
            ("recordeddate", "2021-01-024"),
            ("recordedDate", ""),
            ("recordedDate", None),
            ("recordedDate", "yesterday"),
            ("recordedDate", "01/24/2021"),
            ("recordedDate", "2021-01-024T00:00:00"),
        ]
    )
    def test_transaction_requires_valid_recorded_date(self, key, value):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "payee": "Unit Testers",
                key: value,
            },
        )
        assert resp.status_code == 400
        assert b"recordedDate" in resp.data

    @parameterized.expand(
        [
            ("AccountId", "auto", 400),
            ("accountId", None, 400),
            ("accountId", '', 400),
            ("accountId", 0, 404),
            ("accountId", -1, 404),
            ("accountId", 999, 404),
            ("accountId", "other", 400),
        ]
    )
    def test_transaction_requires_valid_account_id(self, key, value, code):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_id = self.create_envelope(env_cat_id)
        other_ledger_id = self.create_ledger()
        other_cat_id = self.create_account_category(other_ledger_id)
        other_acct_id = self.create_account(other_cat_id)

        if value == "auto":
            value = acct_id
        elif value == "other":
            value = other_acct_id

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": [
                    {
                        key: value,
                        "amount": 10,
                    },
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": env_id,
                        "amount": 10,
                    },
                ],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            ("Amount", 10),
            ("amount", None),
            ("amount", ''),
            ("amount", 11),
        ]
    )
    def test_transaction_requires_valid_account_amount(self, key, value):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_id = self.create_envelope(env_cat_id)

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        key: value,
                    },
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": env_id,
                        "amount": 10,
                    },
                ],
            },
        )
        assert resp.status_code == 400

    @parameterized.expand(
        [
            ("EnvelopeId", "auto", 400),
            ("envelopeId", None, 400),
            ("envelopeId", '', 400),
            ("envelopeId", 0, 404),
            ("envelopeId", -1, 404),
            ("envelopeId", 999, 404),
            ("envelopeId", "other", 400),
        ]
    )
    def test_transaction_requires_valid_envelope_id(self, key, value, code):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_id = self.create_envelope(env_cat_id)
        other_ledger_id = self.create_ledger()
        other_cat_id = self.create_envelope_category(other_ledger_id)
        other_env_id = self.create_envelope(other_cat_id)

        if value == "auto":
            value = env_id
        elif value == "other":
            value = other_env_id

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": 10,
                    },
                ],
                "envelopeTransactions": [
                    {
                        key: value,
                        "amount": 10,
                    },
                ],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            ("Amount", 10),
            ("amount", None),
            ("amount", ''),
            ("amount", 11),
        ]
    )
    def test_transaction_requires_valid_envelope_amount(self, key, value):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_id = self.create_envelope(env_cat_id)

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": 10,
                    },
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": env_id,
                        key: value,
                    },
                ],
            },
        )
        assert resp.status_code == 400

    def test_transaction_requires_sub_transactions(self):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
            }
        )
        assert resp.status_code == 400

    @parameterized.expand(
        [
            ([10], [11]), # one each, net positive
            ([-11],[-10]), # one each, net negative
            ([-10],[10]), # one each, mismatched signs
            ([10, 10], []), # only accounts, net positive
            ([-10, -10], []), # only accounts, net negative
            ([], [10, 10]), # only envelopes, net positive
            ([], [-10, -10]), # only envelopes, net negative
        ]
    )
    def test_transaction_requires_balanced_amounts(self, acct_amounts, env_amounts):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_id = self.create_envelope(env_cat_id)

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": amount,
                    } for amount in acct_amounts
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": env_id,
                        "amount": amount,
                    } for amount in env_amounts
                ],
            },
        )
        assert resp.status_code == 400

    @parameterized.expand(
        [
            # Incomes
            (400, "gain", [10], [10]),
            (201, "income", [10], [10]),
            (201, "refund", [10], [10]),
            (201, "opening_balance", [10], [10]),
            (400, "expense", [10], [10]),
            (400, "transfer", [10], [10]),
            (400, "allocation", [10], [10]),
            (400, "reallocation", [10], [10]),
            # Expenses
            (400, "loss", [-10], [-10]),
            (400, "income", [-10], [-10]),
            (400, "refund", [-10], [-10]),
            (400, "opening_balance", [-10], [-10]),
            (201, "expense", [-10], [-10]),
            (400, "transfer", [-10], [-10]),
            (400, "allocation", [-10], [-10]),
            (400, "reallocation", [-10], [-10]),
            # Transfers
            (400, "move", [10, -10], []),
            (400, "income", [10, -10], []),
            (400, "refund", [10, -10], []),
            (400, "opening_balance", [10, -10], []),
            (400, "expense", [10, -10], []),
            (201, "transfer", [10, -10], []),
            (400, "allocation", [10, -10], []),
            (400, "reallocation", [10, -10], []),
            # Allocations
            (400, "shuffle", [], [-10, 10]),
            (400, "income", [], [-10, 10]),
            (400, "refund", [], [-10, 10]),
            (400, "opening_balance", [], [-10, 10]),
            (400, "expense", [], [-10, 10]),
            (400, "transfer", [], [-10, 10]),
            (201, "allocation", [], [-10, 10]),
            (201, "reallocation", [], [-10, 10]),
        ]
    )
    def test_transaction_requires_valid_types(self, code, trn_type, acct_amounts, env_amounts):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_id = self.create_envelope(env_cat_id)

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "type": trn_type,
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": amount,
                    } for amount in acct_amounts
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": env_id,
                        "amount": amount,
                    } for amount in env_amounts
                ],
            },
        )
        assert resp.status_code == code
