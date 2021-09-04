""" Integration tests for transaction query APIs """
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class TransactionQueriesTestCase(BaseTestCase):
    """ Integration tests for transaction query APIs """

    # pylint: disable=too-many-arguments
    def create_transaction(
        self,
        recorded_date,
        payee,
        ledger_id,
        account_id,
        envelope_id,
        amount,
        memo="",
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
                        "memo": memo,
                        "cleared": cleared,
                    },
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": envelope_id,
                        "amount": amount,
                        "memo": memo,
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
            ["2021-04-01", "Vendor A", l, a1, e1, 10000, "", True],
            ["2021-04-02", "Vendor B", l, a2, e1, -1000, "", True],
            ["2021-04-02", "Vendor C", l, a1, e2, -1000, "Note 1", True],
            ["2021-04-01", "Vendor A", l, a1, e1, -1500, "", True],
            ["2021-04-03", "Vendor B", l, a2, e2, -1000, "", True],
            ["2021-04-04", "Vendor C", l, a1, e1, -1000, "Note 2", True],
            ["2021-04-06", "Vendor C", l, a2, e1, 10000, "some thing", True],
            ["2021-04-06", "Vendor B", l, a1, e2, -1000, "", True],
            ["2021-04-07", "Vendor A", l, a1, e1, -1000, "", True],
            ["2021-04-08", "Vendor C", l, a2, e2, -1500, "another thing", True],
            ["2021-04-10", "Vendor B", l, a1, e1, -500, "", True],
            ["2021-04-11", "Vendor C", l, a2, e2, -1000, "one thing", False],
            ["2021-04-14", "Vendor A", l, a1, e2, 10000, "", False],
            ["2021-04-14", "Vendor B", l, a1, e1, -1000, "", False],
            ["2021-04-14", "Vendor A", l, a2, e2, -1000, "Note 2", False],
            ["2021-04-14", "Vendor B", l, a1, e1, -1500, "", False],
            ["2021-04-15", "Vendor B", l, a2, e1, -500, "", False],
            ["2021-04-15", "Vendor B", l, a1, e2, -1000, "", False],
            ["2021-04-12", "Vendor C", l, a1, e1, 10000, "thing for someone", False],
            ["2021-04-17", "Vendor B", l, a2, e2, -1000, "", False],
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

    def setUp(self):
        super().setUp()
        self.ids = self.create_transaction_history()

    def test_account_transaction_query_by_account_id(self):
        # in
        resp = self.client.get(
            f"/api/account-transactions/search?accountId={self.ids['acct_id_1']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 12

        resp = self.client.get(
            f"/api/account-transactions/search?accountId={self.ids['acct_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 8

        resp = self.client.get(
            "/api/account-transactions/search?"
            f"accountId={self.ids['acct_id_1']},{self.ids['acct_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 20

        # not in
        resp = self.client.get(
            f"/api/account-transactions/search?accountId=not:{self.ids['acct_id_1']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 8

        resp = self.client.get(
            f"/api/account-transactions/search?accountId=not:{self.ids['acct_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 12

        resp = self.client.get(
            "/api/account-transactions/search?"
            f"accountId=not:{self.ids['acct_id_1']},{self.ids['acct_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 0

    @parameterized.expand(
        [
            ("", 20),
            # equal
            ("10000", 4),
            ("not:10000", 16),
            ("eq:-500", 2),
            ("not:eq:-500", 18),
            # less than
            ("lt:-1000", 3),
            ("not:lt:-1000", 17),
            # less than or equal
            ("lte:-1000", 14),
            ("not:lte:-1000", 6),
            # greater than
            ("gt:-500", 4),
            ("not:gt:-500", 16),
            # greater than or equal
            ("gte:-500", 6),
            ("not:gte:-500", 14),
            # between
            ("between:-1200:-400", 13),
            ("not:between:-1200:-400", 7),
        ]
    )
    def test_account_transaction_query_by_amount(self, criteria, expected):
        resp = self.client.get(
            f"/api/account-transactions/search?amount={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            ("true", 11),
            ("True", 11),
            ("yes", 11),
            ("on", 11),
            ("1", 11),
            ("false", 9),
            ("no", 9),
            ("0", 9),
        ]
    )
    def test_account_transaction_query_by_cleared(self, criteria, expected):
        resp = self.client.get(
            f"/api/account-transactions/search?cleared={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            # equal
            ("Note%201", 1),
            ("not:Note%201", 19),
            ("eq:Note%202", 2),
            ("not:eq:Note%202", 18),
            # starts
            ("starts:Note", 3),
            ("not:starts:Note", 17),
            # ends
            ("ends:thing", 3),
            ("not:ends:thing", 17),
            # contains
            ("contains:some", 2),
            ("contains:thing", 4),
            ("not:contains:thing", 16),
        ]
    )
    def test_account_transaction_query_by_memo(self, criteria, expected):
        resp = self.client.get(
            f"/api/account-transactions/search?memo={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            ("Vendor%20A", 5),
            ("not:Vendor%20A", 15),
            # all other string operators are tested with the memo
        ]
    )
    def test_account_transaction_query_by_payee(self, criteria, expected):
        resp = self.client.get(
            f"/api/account-transactions/search?payee={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    def test_account_transaction_query_by_reconciliation_id(self):
        resp = self.client.get(
            "/api/account-transactions/search?reconciliationId=is:null&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 20

        trn_ids = [
            t["id"]
            for t in resp.json["transactions"]
            if t["accountId"] == self.ids["acct_id_1"]
        ]

        resp = self.client.post(
            f"/api/accounts/{self.ids['acct_id_1']}/reconciliations",
            json={
                "beginningBalance": 0,
                "beginningDate": "2021-04-01",
                "endingBalance": 0,
                "endingDate": "2021-04-30",
                "transactionIds": trn_ids,
            },
        )
        assert resp.status_code == 201
        reconciliation_id = resp.json.get("id")

        resp = self.client.get(
            "/api/account-transactions/search?reconciliationId=is:null&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 8

        resp = self.client.get(
            f"/api/account-transactions/search?reconciliationId={reconciliation_id}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 12

    @parameterized.expand(
        [
            ("", 20),
            # equal
            ("eq:2021-04-14", 4),
            ("not:eq:2021-04-14", 16),
            # less than
            ("lt:2021-04-14", 13),
            ("not:lt:2021-04-14", 7),
            # less than or equal
            ("lte:2021-04-14", 17),
            ("not:lte:2021-04-14", 3),
            # greater than
            ("gt:2021-04-14", 3),
            ("not:gt:2021-04-14", 17),
            # greater than or equal
            ("gte:2021-04-14", 7),
            ("not:gte:2021-04-14", 13),
            # between
            ("between:2021-04-08:2021-04-14", 8),
            ("not:between:2021-04-08:2021-04-14", 12),
        ]
    )
    def test_account_transaction_query_by_recorded_date(self, criteria, expected):
        resp = self.client.get(
            f"/api/account-transactions/search?recordedDate={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            ("income", 4),
            ("not:income", 16),
            ("expense", 16),
            ("not:expense", 4),
            ("income,refund", 4),
            ("income,expense", 20),
            ("not:income,expense", 0),
            ("not:transfer,expense", 4),
        ]
    )
    def test_account_transaction_query_by_type(self, criteria, expected):
        resp = self.client.get(
            f"/api/account-transactions/search?type={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    def test_envelope_transaction_query_by_envelope_id(self):
        # in
        resp = self.client.get(
            f"/api/envelope-transactions/search?envelopeId={self.ids['env_id_1']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 11

        resp = self.client.get(
            f"/api/envelope-transactions/search?envelopeId={self.ids['env_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 9

        resp = self.client.get(
            "/api/envelope-transactions/search?"
            f"envelopeId={self.ids['env_id_1']},{self.ids['env_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 20

        # not in
        resp = self.client.get(
            f"/api/envelope-transactions/search?envelopeId=not:{self.ids['env_id_1']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 9

        resp = self.client.get(
            f"/api/envelope-transactions/search?envelopeId=not:{self.ids['env_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 11

        resp = self.client.get(
            "/api/envelope-transactions/search?"
            f"envelopeId=not:{self.ids['env_id_1']},{self.ids['env_id_2']}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == 0

    @parameterized.expand(
        [
            ("", 20),
            # equal
            ("10000", 4),
            ("not:10000", 16),
            ("eq:-500", 2),
            ("not:eq:-500", 18),
            # less than
            ("lt:-1000", 3),
            ("not:lt:-1000", 17),
            # less than or equal
            ("lte:-1000", 14),
            ("not:lte:-1000", 6),
            # greater than
            ("gt:-500", 4),
            ("not:gt:-500", 16),
            # greater than or equal
            ("gte:-500", 6),
            ("not:gte:-500", 14),
            # between
            ("between:-1200:-400", 13),
            ("not:between:-1200:-400", 7),
        ]
    )
    def test_envelope_transaction_query_by_amount(self, criteria, expected):
        resp = self.client.get(
            f"/api/envelope-transactions/search?amount={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            # equal
            ("Note%201", 1),
            ("not:Note%201", 19),
            ("eq:Note%202", 2),
            ("not:eq:Note%202", 18),
            # starts
            ("starts:Note", 3),
            ("not:starts:Note", 17),
            # ends
            ("ends:thing", 3),
            ("not:ends:thing", 17),
            # contains
            ("contains:some", 2),
            ("contains:thing", 4),
            ("not:contains:thing", 16),
        ]
    )
    def test_envelope_transaction_query_by_memo(self, criteria, expected):
        resp = self.client.get(
            f"/api/envelope-transactions/search?memo={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            ("Vendor%20A", 5),
            ("not:Vendor%20A", 15),
            # all other string operators are tested with the memo
        ]
    )
    def test_envelope_transaction_query_by_payee(self, criteria, expected):
        resp = self.client.get(
            f"/api/envelope-transactions/search?payee={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            # equal
            ("eq:2021-04-14", 4),
            ("not:eq:2021-04-14", 16),
            # less than
            ("lt:2021-04-14", 13),
            ("not:lt:2021-04-14", 7),
            # less than or equal
            ("lte:2021-04-14", 17),
            ("not:lte:2021-04-14", 3),
            # greater than
            ("gt:2021-04-14", 3),
            ("not:gt:2021-04-14", 17),
            # greater than or equal
            ("gte:2021-04-14", 7),
            ("not:gte:2021-04-14", 13),
            # between
            ("between:2021-04-08:2021-04-14", 8),
            ("not:between:2021-04-08:2021-04-14", 12),
        ]
    )
    def test_envelope_transaction_query_by_recorded_date(self, criteria, expected):
        resp = self.client.get(
            f"/api/envelope-transactions/search?recordedDate={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected

    @parameterized.expand(
        [
            ("", 20),
            ("income", 4),
            ("not:income", 16),
            ("expense", 16),
            ("not:expense", 4),
            ("income,refund", 4),
            ("income,expense", 20),
            ("not:income,expense", 0),
            ("not:transfer,expense", 4),
        ]
    )
    def test_envelope_transaction_query_by_type(self, criteria, expected):
        resp = self.client.get(
            f"/api/envelope-transactions/search?type={criteria}&size=50"
        )
        assert resp.status_code == 200
        assert len(resp.json["transactions"]) == expected
