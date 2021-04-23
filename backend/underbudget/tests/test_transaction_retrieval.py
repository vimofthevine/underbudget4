""" Integration tests for transaction retrieval APIs """
from underbudget.tests.base import BaseTestCase


class TransactionRetrievalTestCase(BaseTestCase):
    """ Integration tests for transaction retrieval APIs """

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
            ["2021-04-06", "Vendor C", l, a2, e1, 10000, "Note 3", True],
            ["2021-04-06", "Vendor B", l, a1, e2, -1000, "", True],
            ["2021-04-07", "Vendor A", l, a1, e1, -1000, "", True],
            ["2021-04-08", "Vendor C", l, a2, e2, -1500, "Note 4", True],
            ["2021-04-10", "Vendor B", l, a1, e1, -1000, "", True],
            ["2021-04-11", "Vendor C", l, a2, e1, -1000, "Note 5", False],
            ["2021-04-14", "Vendor A", l, a1, e2, 10000, "", False],
            ["2021-04-14", "Vendor B", l, a1, e1, -1000, "", False],
            ["2021-04-14", "Vendor A", l, a2, e2, -1000, "", False],
            ["2021-04-14", "Vendor B", l, a1, e1, -1500, "", False],
            ["2021-04-15", "Vendor B", l, a2, e1, -1000, "", False],
            ["2021-04-15", "Vendor B", l, a1, e2, -1000, "", False],
            ["2021-04-12", "Vendor C", l, a1, e1, 10000, "Note 6", False],
            ["2021-04-17", "Vendor B", l, a2, e2, -1000, "", False],
            ["2021-04-17", "Vendor B", l, a1, e1, -1000, "", False],
            ["2021-04-19", "Vendor C", l, a2, e1, -1500, "Note 7", False],
            ["2021-04-20", "Vendor B", l, a1, e2, -1000, "", False],
            ["2021-04-21", "Vendor A", l, a1, e1, -1000, "", False],
            ["2021-04-20", "Vendor A", l, a2, e2, 10000, "", False],
            ["2021-04-21", "Vendor B", l, a1, e1, -1000, "", False],
            ["2021-04-21", "Vendor A", l, a2, e1, -1000, "", False],
            ["2021-04-22", "Vendor C", l, a1, e2, -1500, "Note 8", False],
            ["2021-04-24", "Vendor B", l, a1, e1, -1000, "", False],
            ["2021-04-24", "Vendor A", l, a2, e2, -1000, "", False],
            ["2021-04-26", "Vendor B", l, a1, e1, 10000, "", False],
            ["2021-04-27", "Vendor C", l, a2, e1, -1000, "Note 9", False],
            ["2021-04-26", "Vendor A", l, a1, e2, -1000, "", False],
            ["2021-04-28", "Vendor B", l, a1, e1, -1500, "", False],
            ["2021-04-28", "Vendor C", l, a2, e2, -1000, "Note 10", False],
            ["2021-04-28", "Vendor A", l, a1, e1, -1000, "", False],
            ["2021-04-29", "Vendor B", l, a2, e1, 10000, "", False],
            ["2021-04-30", "Vendor A", l, a1, e2, -1000, "", False],
            ["2021-04-03", "Vendor B", l, a1, e1, -1000, "", True],
            ["2021-04-29", "Vendor C", l, a2, e2, -1500, "Note 11", False],
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

    @staticmethod
    def check_transaction_history(actual, transactions, page, size, total):
        """ Verify that received transaction history matches the expected history """
        assert actual["page"] == page
        assert actual["size"] == size
        assert actual["total"] == total
        assert len(actual["transactions"]) == len(transactions)
        for i, expected_trn in enumerate(transactions):
            if len(expected_trn) == 7:
                (date, payee, trn_type, amount, balance, memo, cleared) = expected_trn
            else:
                memo = None
                cleared = None
                (date, payee, trn_type, amount, balance) = expected_trn
            actual_trn = actual["transactions"][i]
            assert actual_trn.get("id") is not None
            assert actual_trn.get("transactionId") is not None
            assert date == actual_trn.get("recordedDate")
            assert payee == actual_trn.get("payee")
            assert trn_type == actual_trn.get("type")
            assert amount == actual_trn.get("amount")
            assert balance == actual_trn.get("balance")
            if memo is not None:
                assert memo == actual_trn.get("memo")
            if cleared is not None:
                assert cleared == actual_trn.get("cleared")

    def test_account_transaction_history(self):
        acct_1_transactions = [
            ["2021-04-30", "Vendor A", "expense", -1000, 18000, "", False],
            ["2021-04-28", "Vendor A", "expense", -1000, 19000, "", False],
            ["2021-04-28", "Vendor B", "expense", -1500, 20000, "", False],
            ["2021-04-26", "Vendor A", "expense", -1000, 21500, "", False],
            ["2021-04-26", "Vendor B", "income", 10000, 22500, "", False],
            ["2021-04-24", "Vendor B", "expense", -1000, 12500, "", False],
            ["2021-04-22", "Vendor C", "expense", -1500, 13500, "Note 8", False],
            ["2021-04-21", "Vendor B", "expense", -1000, 15000, "", False],
            ["2021-04-21", "Vendor A", "expense", -1000, 16000, "", False],
            ["2021-04-20", "Vendor B", "expense", -1000, 17000, "", False],
            ["2021-04-17", "Vendor B", "expense", -1000, 18000, "", False],
            ["2021-04-15", "Vendor B", "expense", -1000, 19000, "", False],
            ["2021-04-14", "Vendor B", "expense", -1500, 20000, "", False],
            ["2021-04-14", "Vendor B", "expense", -1000, 21500, "", False],
            ["2021-04-14", "Vendor A", "income", 10000, 22500, "", False],
            ["2021-04-12", "Vendor C", "income", 10000, 12500, "Note 6", False],
            ["2021-04-10", "Vendor B", "expense", -1000, 2500, "", True],
            ["2021-04-07", "Vendor A", "expense", -1000, 3500, "", True],
            ["2021-04-06", "Vendor B", "expense", -1000, 4500, "", True],
            ["2021-04-04", "Vendor C", "expense", -1000, 5500, "Note 2", True],
            ["2021-04-03", "Vendor B", "expense", -1000, 6500, "", True],
            ["2021-04-02", "Vendor C", "expense", -1000, 7500, "Note 1", True],
            ["2021-04-01", "Vendor A", "expense", -1500, 8500, "", True],
            ["2021-04-01", "Vendor A", "income", 10000, 10000, "", True],
        ]
        acct_2_transactions = [
            ["2021-04-29", "Vendor C", "expense", -1500, 15500, "Note 11", False],
            ["2021-04-29", "Vendor B", "income", 10000, 17000, "", False],
            ["2021-04-28", "Vendor C", "expense", -1000, 7000, "Note 10", False],
            ["2021-04-27", "Vendor C", "expense", -1000, 8000, "Note 9", False],
            ["2021-04-24", "Vendor A", "expense", -1000, 9000, "", False],
            ["2021-04-21", "Vendor A", "expense", -1000, 10000, "", False],
            ["2021-04-20", "Vendor A", "income", 10000, 11000, "", False],
            ["2021-04-19", "Vendor C", "expense", -1500, 1000, "Note 7", False],
            ["2021-04-17", "Vendor B", "expense", -1000, 2500, "", False],
            ["2021-04-15", "Vendor B", "expense", -1000, 3500, "", False],
            ["2021-04-14", "Vendor A", "expense", -1000, 4500, "", False],
            ["2021-04-11", "Vendor C", "expense", -1000, 5500, "Note 5", False],
            ["2021-04-08", "Vendor C", "expense", -1500, 6500, "Note 4", True],
            ["2021-04-06", "Vendor C", "income", 10000, 8000, "Note 3", True],
            ["2021-04-03", "Vendor B", "expense", -1000, -2000, "", True],
            ["2021-04-02", "Vendor B", "expense", -1000, -1000, "", True],
        ]

        ids = self.create_transaction_history()

        # Default pagination
        resp = self.client.get(f"/api/accounts/{ids['acct_id_1']}/transactions")
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_1_transactions[0:10], 1, 10, 24)

        # Second page, default size
        resp = self.client.get(f"/api/accounts/{ids['acct_id_1']}/transactions?page=2")
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_1_transactions[10:20], 2, 10, 24)

        # Third page, default size
        resp = self.client.get(
            f"/api/accounts/{ids['acct_id_1']}/transactions?page=3&size=10"
        )
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_1_transactions[20:], 3, 10, 24)

        # Explicit size
        resp = self.client.get(f"/api/accounts/{ids['acct_id_1']}/transactions?size=12")
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_1_transactions[0:12], 1, 12, 24)

        # Explicit size, second page
        resp = self.client.get(
            f"/api/accounts/{ids['acct_id_1']}/transactions?size=12&page=2"
        )
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_1_transactions[12:], 2, 12, 24)

        # Other account, first page
        resp = self.client.get(f"/api/accounts/{ids['acct_id_2']}/transactions")
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_2_transactions[0:10], 1, 10, 16)

        # Other account, second page
        resp = self.client.get(f"/api/accounts/{ids['acct_id_2']}/transactions?page=2")
        assert resp.status_code == 200
        self.check_transaction_history(resp.json, acct_2_transactions[10:16], 2, 10, 16)
