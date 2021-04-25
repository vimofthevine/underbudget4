""" Integration tests for balance APIs """
from underbudget.tests.base import BaseTestCase


class BalanceTestCase(BaseTestCase):
    """ Integration tests for balance APIs """

    # pylint: disable=too-many-arguments
    def create_transaction(
        self,
        recorded_date,
        payee,
        ledger_id,
        account_id,
        envelope_id,
        amount,
        cleared=False,
    ):
        """ Create a transaction using the REST API """
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/transactions",
            json={
                "recordedDate": recorded_date,
                "payee": payee,
                "accountTransactions": [
                    {
                        "accountId": account_id,
                        "amount": amount,
                        "cleared": cleared,
                    },
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": envelope_id,
                        "amount": amount,
                    },
                ],
            },
        )
        assert resp.status_code == 201

    def create_transaction_history(self):
        """ Create a set of transactions with two accounts and two envelopes """
        # pylint: disable=invalid-name
        l = self.create_ledger()
        acct_cat_id = self.create_account_category(l)
        a1 = self.create_account(acct_cat_id)
        a2 = self.create_account(acct_cat_id)
        env_cat_id = self.create_envelope_category(l)
        e1 = self.create_envelope(env_cat_id)
        e2 = self.create_envelope(env_cat_id)

        transactions = [
            ["2021-03-01", "Vendor A", l, a1, e1, 10000, True],
            ["2021-03-02", "Vendor B", l, a2, e1, -1000, True],
            ["2021-03-02", "Vendor C", l, a1, e2, -1000, True],
            ["2021-03-01", "Vendor A", l, a1, e1, -1500, True],
            ["2021-03-03", "Vendor B", l, a2, e2, -1000, True],
            ["2021-03-04", "Vendor C", l, a1, e1, -1000, True],
            ["2021-03-06", "Vendor C", l, a2, e1, 10000, True],
            ["2021-03-06", "Vendor B", l, a1, e2, -1000, True],
            ["2021-03-07", "Vendor A", l, a1, e1, -1000, True],
            ["2021-03-08", "Vendor C", l, a2, e2, -1500, True],
            ["2021-03-10", "Vendor B", l, a1, e1, -1000, True],
            ["2021-03-11", "Vendor C", l, a2, e1, -1000, False],
            ["2021-03-14", "Vendor A", l, a1, e2, 10000, False],
            ["2021-03-14", "Vendor B", l, a1, e1, -1000, False],
            ["2021-03-14", "Vendor A", l, a2, e2, -1000, False],
            ["2021-03-14", "Vendor B", l, a1, e1, -1500, False],
            ["2021-03-15", "Vendor B", l, a2, e1, -1000, False],
            ["2021-03-15", "Vendor B", l, a1, e2, -1000, False],
            ["2021-03-12", "Vendor C", l, a1, e1, 10000, False],
            ["2021-03-17", "Vendor B", l, a2, e2, -1000, False],
            ["2021-03-17", "Vendor B", l, a1, e1, -1000, False],
            ["2021-03-19", "Vendor C", l, a2, e1, -1500, False],
            ["2021-03-20", "Vendor B", l, a1, e2, -1000, False],
            ["2021-03-21", "Vendor A", l, a1, e1, -1000, False],
            ["2021-03-20", "Vendor A", l, a2, e2, 10000, False],
            ["2021-03-21", "Vendor B", l, a1, e1, -1000, False],
            ["2021-03-21", "Vendor A", l, a2, e1, -1000, False],
            ["2021-03-22", "Vendor C", l, a1, e2, -1500, False],
            ["2021-03-24", "Vendor B", l, a1, e1, -1000, False],
            ["2021-03-24", "Vendor A", l, a2, e2, -1000, False],
            ["2021-03-26", "Vendor B", l, a1, e1, 10000, False],
            ["2021-03-27", "Vendor C", l, a2, e1, -1000, False],
            ["2021-03-26", "Vendor A", l, a1, e2, -1000, False],
            ["2021-03-28", "Vendor B", l, a1, e1, -1500, False],
            ["2021-03-28", "Vendor C", l, a2, e2, -1000, False],
            ["2021-03-28", "Vendor A", l, a1, e1, -1000, False],
            ["2021-03-29", "Vendor B", l, a2, e1, 10000, False],
            ["2021-03-30", "Vendor A", l, a1, e2, -1000, False],
            ["2021-03-03", "Vendor B", l, a1, e1, -1000, True],
            ["2021-03-29", "Vendor C", l, a2, e2, -1500, False],
        ]

        for trn in transactions:
            self.create_transaction(*trn)

        return {
            "ledger_id": l,
            "acct_id_1": a1,
            "acct_id_2": a2,
            "env_id_1": e1,
            "env_id_2": e2,
        }

    def test_account_balance(self):
        ids = self.create_transaction_history()

        # Default date (since this is written in April 2021 and all transactions
        # are marked for March 2021, it includes all history)
        resp = self.client.get(f"/api/accounts/{ids['acct_id_1']}/balance")
        assert resp.status_code == 200
        assert resp.json.get("balance") == 18000

        # Explicit date, no transactions on date
        resp = self.client.get(
            f"/api/accounts/{ids['acct_id_1']}/balance?date=2021-03-23"
        )
        assert resp.status_code == 200
        assert resp.json.get("balance") == 13500

        # Explicit date, one transaction on date
        resp = self.client.get(
            f"/api/accounts/{ids['acct_id_1']}/balance?date=2021-03-17"
        )
        assert resp.status_code == 200
        assert resp.json.get("balance") == 18000

        # Explicit date, multiple transactions on date
        resp = self.client.get(
            f"/api/accounts/{ids['acct_id_1']}/balance?date=2021-03-14"
        )
        assert resp.status_code == 200
        assert resp.json.get("balance") == 20000

    def test_envelope_balance(self):
        ids = self.create_transaction_history()

        # Default date (since this is written in April 2021 and all transactions
        # are marked for March 2021, it includes all history)
        resp = self.client.get(f"/api/envelopes/{ids['env_id_1']}/balance")
        assert resp.status_code == 200
        assert resp.json.get("balance") == 29000

        # Explicit date, no transactions on date
        resp = self.client.get(
            f"/api/envelopes/{ids['env_id_1']}/balance?date=2021-03-18"
        )
        assert resp.status_code == 200
        assert resp.json.get("balance") == 18000

        # Explicit date, one transaction on date
        resp = self.client.get(
            f"/api/envelopes/{ids['env_id_1']}/balance?date=2021-03-07"
        )
        assert resp.status_code == 200
        assert resp.json.get("balance") == 14500

        # Explicit date, multiple transactions on date
        resp = self.client.get(
            f"/api/envelopes/{ids['env_id_1']}/balance?date=2021-03-21"
        )
        assert resp.status_code == 200
        assert resp.json.get("balance") == 13500

    def test_invalid_dates(self):
        ids = self.create_transaction_history()

        resp = self.client.get(
            f"/api/accounts/{ids['acct_id_1']}/balance?date=yesterday"
        )
        assert resp.status_code == 400

        resp = self.client.get(
            f"/api/envelopes/{ids['env_id_1']}/balance?date=yesterday"
        )
        assert resp.status_code == 400

    def test_invalid_ids(self):
        self.create_transaction_history()

        resp = self.client.get("/api/accounts/99999/balance")
        assert resp.status_code == 404

        resp = self.client.get("/api/envelopes/99999/balance")
        assert resp.status_code == 404
