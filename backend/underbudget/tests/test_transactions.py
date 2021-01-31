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
            (400, "Payee", "Unit Testers"),
            (400, "payee", ""),
            (400, "payee", None),
            (201, "payee", "Unit Testers"),
        ]
    )
    def test_transaction_requires_valid_payee(self, code, key, value):
        ledger_id = self.create_ledger()
        cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(cat_id)
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": "2021-01-24",
                key: value,
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": 0,
                    },
                ],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "RecordedDate", "2021-01-24"),
            (400, "recordeddate", "2021-01-24"),
            (400, "recordedDate", ""),
            (400, "recordedDate", None),
            (400, "recordedDate", "yesterday"),
            (400, "recordedDate", "01/24/2021"),
            (400, "recordedDate", "2021-01-24T00:00:00"),
            (201, "recordedDate", "2021-01-24"),
        ]
    )
    def test_transaction_requires_valid_recorded_date(self, code, key, value):
        ledger_id = self.create_ledger()
        cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(cat_id)
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "payee": "Unit Testers",
                key: value,
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": 0,
                    },
                ],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "AccountId", "auto"),
            (400, "accountId", None),
            (400, "accountId", ''),
            (404, "accountId", 0),
            (404, "accountId", -1),
            (404, "accountId", 999),
            (400, "accountId", "other"),
            (201, "accountId", "auto"),
        ]
    )
    def test_transaction_requires_valid_account_id(self, code, key, value):
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
            (400, "Amount", 10),
            (400, "amount", None),
            (400, "amount", ''),
            (400, "amount", 11),
            (201, "amount", 10),
        ]
    )
    def test_transaction_requires_valid_account_amount(self, code, key, value):
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
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "EnvelopeId", "auto"),
            (400, "envelopeId", None),
            (400, "envelopeId", ''),
            (404, "envelopeId", 0),
            (404, "envelopeId", -1),
            (404, "envelopeId", 999),
            (400, "envelopeId", "other"),
            (201, "envelopeId", "auto"),
        ]
    )
    def test_transaction_requires_valid_envelope_id(self, code, key, value):
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
            (400, "Amount", 10),
            (400, "amount", None),
            (400, "amount", ''),
            (400, "amount", 11),
            (201, "amount", 10),
        ]
    )
    def test_transaction_requires_valid_envelope_amount(self, code, key, value):
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
        assert resp.status_code == code

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
            (400, [10], [11]), # one each, net positive
            (201, [11], [11]),
            (400, [-11],[-10]), # one each, net negative
            (201, [-10],[-10]),
            (400, [-10],[10]), # one each, mismatched signs
            (400, [10, 10], []), # only accounts, net positive
            (400, [-10, -10], []), # only accounts, net negative
            (201, [10, -10], []),
            (400, [], [10, 10]), # only envelopes, net positive
            (400, [], [-10, -10]), # only envelopes, net negative
            (201, [], [-10, 10]),
        ]
    )
    def test_transaction_requires_balanced_amounts(self, code, acct_amounts, env_amounts):
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
        assert resp.status_code == code

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
