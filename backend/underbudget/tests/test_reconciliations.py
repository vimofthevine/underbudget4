""" Integration tests for reconciliation APIs """
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class ReconciliationsTestCase(BaseTestCase):
    """ Integration tests for reconciliation APIs """

    # pylint: disable=too-many-arguments
    def create_transaction(
        self,
        recorded_date,
        payee,
        ledger_id,
        account_id,
        envelope_id,
        amount,
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
                        "memo": "",
                        "cleared": False,
                    },
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": envelope_id,
                        "amount": amount,
                        "memo": "",
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
            ["2021-04-01", "Vendor A", l, a1, e1, 10000],
            ["2021-04-02", "Vendor B", l, a2, e1, -1000],
            ["2021-04-02", "Vendor C", l, a1, e2, -1000],
            ["2021-04-01", "Vendor A", l, a1, e1, -1500],
            ["2021-04-03", "Vendor B", l, a2, e2, -1000],
            ["2021-04-04", "Vendor C", l, a1, e1, -1000],
            ["2021-04-06", "Vendor C", l, a2, e1, 10000],
            ["2021-04-06", "Vendor B", l, a1, e2, -1000],
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

    @parameterized.expand([("not-an-id",), (999,)])
    def test_reconciliation_requires_valid_account(self, account_id=None):
        resp = self.client.post(
            f"/api/accounts/{account_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": [],
            },
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            (400, "BeginningBalance", 0),
            (400, "beginningBalance", ""),
            (400, "beginningBalance", None),
            (201, "beginningBalance", 0),
        ]
    )
    def test_reconciliation_requires_valid_beginning_balance(self, code, key, value):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                key: value,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": [],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "BeginningDate", "2021-01-24"),
            (400, "beginningDate", ""),
            (400, "beginningDate", None),
            (400, "beginningDate", "yesterday"),
            (400, "beginningDate", "01/24/2021"),
            (400, "beginningDate", "2021-01-24T00:00:00"),
            (400, "beginningDate", "2021-05-01"),
            (201, "beginningDate", "2021-04-01"),
        ]
    )
    def test_transaction_requires_valid_beginning_date(self, code, key, value):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                key: value,
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": [],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "EndingBalance", 0),
            (400, "endingBalance", ""),
            (400, "endingBalance", None),
            (201, "endingBalance", 0),
        ]
    )
    def test_reconciliation_requires_valid_ending_balance(self, code, key, value):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                key: value,
                "endingDate": "2021-04-30",
                "transactionIds": [],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "EndingDate", "2021-01-24"),
            (400, "endingDate", ""),
            (400, "endingDate", None),
            (400, "endingDate", "yesterday"),
            (400, "endingDate", "01/24/2021"),
            (400, "endingDate", "2021-01-24T00:00:00"),
            (400, "endingDate", "2021-03-31"),
            (201, "endingDate", "2021-04-30"),
        ]
    )
    def test_transaction_requires_valid_ending_date(self, code, key, value):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                key: value,
                "transactionIds": [],
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (400, "TransactionIds", []),
            (400, "transactionIds", ""),
            (400, "transactionIds", None),
            (404, "transactionIds", [999]),
            (201, "transactionIds", []),
            (201, "transactionIds", "auto"),
        ]
    )
    def test_transaction_requires_valid_transaction_ids(self, code, key, value):
        if value == "auto":
            ids = self.create_transaction_history()
            acct_id = ids["acct_id_1"]

            resp = self.client.get(f"/api/accounts/{acct_id}/unreconciled-transactions")
            assert resp.status_code == 200
            value = [trn["id"] for trn in resp.json.get("transactions")]
        else:
            ledger_id = self.create_ledger()
            acct_cat_id = self.create_account_category(ledger_id)
            acct_id = self.create_account(acct_cat_id)

        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                key: value,
            },
        )
        assert resp.status_code == code

    def test_reconciliation_not_found(self):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)
        self._test_crud_methods_against_non_existent_resource(
            f"/api/accounts/{acct_id}/reconciliations",
            {
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": [],
            },
        )

    def test_reconciliation_is_not_created_when_transactions_are_not_found(self):
        ids = self.create_transaction_history()
        acct_id = ids["acct_id_1"]

        resp = self.client.get(f"/api/accounts/{acct_id}/unreconciled-transactions?size=3")
        assert resp.status_code == 200
        trn_ids = [trn["id"] for trn in resp.json.get("transactions")]

        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-11",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": [999] + trn_ids,
            },
        )
        assert resp.status_code == 404

        resp = self.client.get(f"/api/accounts/{acct_id}/reconciliations")
        assert resp.status_code == 200
        assert len(resp.json.get("reconciliations")) == 0

        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": trn_ids,
            },
        )
        assert resp.status_code == 201

        resp = self.client.get(f"/api/accounts/{acct_id}/reconciliations")
        assert resp.status_code == 200
        assert len(resp.json.get("reconciliations")) == 1

    def test_reconciliation_deletion(self):
        ids = self.create_transaction_history()
        acct_id = ids["acct_id_1"]

        resp = self.client.get(f"/api/accounts/{acct_id}/unreconciled-transactions?size=3")
        assert resp.status_code == 200

        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": [trn["id"] for trn in resp.json.get("transactions")],
            },
        )
        assert resp.status_code == 201
        reconciliation_id = resp.json.get("id")

        resp = self.client.get(f"/api/reconciliations/{reconciliation_id}/transactions?size=20")
        assert resp.status_code == 200
        assert len(resp.json.get("transactions")) == 3

        resp = self.client.get(f"/api/accounts/{acct_id}/unreconciled-transactions?size=10")
        assert resp.status_code == 200
        assert len(resp.json.get("transactions")) == 2

        resp = self.client.delete(f"/api/reconciliations/{reconciliation_id}")
        assert resp.status_code == 204

        resp = self.client.get(f"/api/accounts/{acct_id}/unreconciled-transactions?size=10")
        assert resp.status_code == 200
        assert len(resp.json.get("transactions")) == 5

    def test_get_last_reconciliation(self):
        ledger_id = self.create_ledger()
        acct_cat_id = self.create_account_category(ledger_id)
        acct_id = self.create_account(acct_cat_id)

        resp = self.client.get(f"/api/accounts/{acct_id}/reconciliations/last")
        assert resp.status_code == 404

        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 200,
                "beginningDate": "2021-05-01",
                "endingBalance": 300,
                "endingDate": "2021-05-31",
                "transactionIds": [],
            },
        )
        assert resp.status_code == 201
        reconciliation_id = resp.json.get("id")

        resp = self.client.post(
            f"/api/accounts/{acct_id}/reconciliations",
            json={
                "beginningBalance": 100,
                "beginningDate": "2021-04-01",
                "endingBalance": 200,
                "endingDate": "2021-04-30",
                "transactionIds": [],
            },
        )
        assert resp.status_code == 201

        resp = self.client.get(f"/api/accounts/{acct_id}/reconciliations/last")
        assert resp.status_code == 200
        assert reconciliation_id == resp.json.get("id")
