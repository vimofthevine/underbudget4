""" Integration tests for transaction modification APIs """
from jsonpath_ng.ext import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class TransactionModificationTestCase(BaseTestCase):
    """ Integration tests for transaction modification APIs """

    @parameterized.expand(
        [
            (400, "Payee", "Unit Testers"),
            (400, "payee", ""),
            (400, "payee", None),
            (200, "payee", "Unit Testers"),
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
                "payee": "orig",
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": 0,
                    },
                ],
            },
        )
        assert resp.status_code == 201
        trn_id = resp.json["id"]

        resp = self.client.patch(
            f"/api/transactions/{trn_id}",
            json={
                "recordedDate": "2021-01-24",
                key: value,
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
            (200, "recordedDate", "2021-01-24"),
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
                "recordedDate": "2021-01-01",
                "accountTransactions": [
                    {
                        "accountId": acct_id,
                        "amount": 0,
                    },
                ],
            },
        )
        assert resp.status_code == 201
        trn_id = resp.json["id"]

        resp = self.client.patch(
            f"/api/transactions/{trn_id}",
            json={
                "payee": "Unit Testers",
                key: value,
            },
        )
        assert resp.status_code == code

    def create_transaction(self, acct_amounts=[], env_amounts=[]):
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
                    }
                    for amount in acct_amounts
                ],
                "envelopeTransactions": [
                    {
                        "envelopeId": env_id,
                        "amount": amount,
                    }
                    for amount in env_amounts
                ],
            },
        )
        assert resp.status_code == 201
        trn_id = resp.json["id"]

        resp = self.client.get(f"/api/transactions/{trn_id}")
        assert resp.status_code == 200
        acct_trn_ids = [
            m.value for m in parse("accountTransactions[*].id").find(resp.json)
        ]
        env_trn_ids = [
            m.value for m in parse("envelopeTransactions[*].id").find(resp.json)
        ]

        return (
            {
                "ledger_id": ledger_id,
                "acct_cat_id": acct_cat_id,
                "acct_id": acct_id,
                "env_cat_id": env_cat_id,
                "env_id": env_id,
                "trn_id": trn_id,
                "acct_trn_ids": acct_trn_ids,
                "env_trn_ids": env_trn_ids,
            },
            resp.json,
        )

    @parameterized.expand(
        [
            # Splitting account transactions
            (400, [10], [10], [2], [], [], [], [], []),
            (400, [10], [10], [-2], [], [], [], [], []),
            (200, [10], [10], [2], [], [8], [], [], []),
            (200, [10], [10], [2], [], [], [12], [], []),
            (200, [10], [10], [3, 3], [], [4], [], [], []),
            (200, [-10], [-10], [-2], [], [], [-12], [], []),
            (200, [-10], [-10], [-3, -3], [], [-4], [], [], []),
            # Splitting envelope transactions
            (400, [10], [10], [], [2], [], [], [], []),
            (400, [10], [10], [], [-2], [], [], [], []),
            (200, [10], [10], [], [2], [], [8], [], []),
            (200, [10], [10], [], [2], [12], [], [], []),
            (200, [10], [10], [], [3, 3], [], [4], [], []),
            (200, [-10], [-10], [], [-2], [-12], [], [], []),
            (200, [-10], [-10], [], [-3, -3], [], [-4], [], []),
            # Adjusting account transactions
            (400, [10, -10], [], [], [], [11], [], [], []),
            (200, [10, -10], [], [], [], [11, -11], [], [], []),
            # Adjusting envelope transactions
            (400, [], [10, -10], [], [], [], [11], [], []),
            (200, [], [10, -10], [], [], [], [11, -11], [], []),
            # Consolidating account transactions
            (400, [8, 2], [10], [], [], [], [], [1], []),
            (200, [8, 2], [10], [], [], [10], [], [1], []),
            (200, [8, 2], [10], [], [], [], [2], [0], []),
            # Consolidating envelope transactions
            (400, [-10], [-8, -2], [], [], [], [], [], [1]),
            (200, [-10], [-8, -2], [], [], [], [-10], [], [1]),
            (200, [-10], [-8, -2], [], [], [-2], [], [], [0]),
            # Replacing/converting
            (200, [10], [10], [-5], [-5], [], [], [0], [0]),
            (200, [10, -10], [], [], [-5, 5], [], [], [0, 1], []),
        ]
    )
    def test_transaction_modifications_require_balanced_amounts(
        self,
        code,
        init_acct_amounts,
        init_env_amounts,
        add_acct_amounts,
        add_env_amounts,
        mod_acct_amounts,
        mod_env_amounts,
        del_acct_idxs,
        del_env_idxs,
    ):
        ids, _ = self.create_transaction(init_acct_amounts, init_env_amounts)

        resp = self.client.patch(
            f"/api/transactions/{ids['trn_id']}",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": {
                    "add": [
                        {
                            "accountId": ids["acct_id"],
                            "amount": amount,
                        }
                        for amount in add_acct_amounts
                    ],
                    "modify": [
                        {
                            "id": ids["acct_trn_ids"][index],
                            "accountId": ids["acct_id"],
                            "amount": amount,
                        }
                        for index, amount in enumerate(mod_acct_amounts)
                    ],
                    "delete": [ids["acct_trn_ids"][index] for index in del_acct_idxs],
                },
                "envelopeTransactions": {
                    "add": [
                        {
                            "envelopeId": ids["env_id"],
                            "amount": amount,
                        }
                        for amount in add_env_amounts
                    ],
                    "modify": [
                        {
                            "id": ids["env_trn_ids"][index],
                            "envelopeId": ids["env_id"],
                            "amount": amount,
                        }
                        for index, amount in enumerate(mod_env_amounts)
                    ],
                    "delete": [ids["env_trn_ids"][index] for index in del_env_idxs],
                },
            },
        )
        assert resp.status_code == code
