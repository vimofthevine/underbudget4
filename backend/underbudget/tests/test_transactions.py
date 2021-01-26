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
                "recordedDate": "2021-01-24T00:00:00",
                key: value,
            },
        )
        assert resp.status_code == 400
        assert b"Payee is required" in resp.data

    @parameterized.expand(
        [
            ("RecordedDate", "2021-01-024T00:00:00"),
            ("recordeddate", "2021-01-024T00:00:00"),
            ("recordedDate", ""),
            ("recordedDate", None),
            ("recordedDate", "yesterday"),
            ("recordedDate", "01/24/2021"),
            ("recordedDate", "2021-01-24"),
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
        assert b"Recorded date is required" in resp.data

    @parameterized.expand(
        [
            ("accountId", None, b"Account ID is required"),
            ("accountId", 0, b"Account ID is required"),
            ("accountId", -1, b"Account ID is required"),
            ("accountId", 999, b"Account ID is required"),
            ("AccountId", "other", b"Account ID is required"),
        ]
    )
    def test_transaction_requires_valid_account_id(self, key, value, message):
        ledger_id = self.create_ledger()
        cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(cat_id)
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
                "x_recordedDate": "2021-01-24T00:00:00",
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
        assert resp.status_code == 400
        # assert message in resp.data

    # @parameterized.expand(
    #     [
    #         ("Amount", 10),
    #         ("amount", None),
    #     ]
    # )
