""" Integration tests for transaction modification APIs """
from jsonpath_ng.ext import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


def get(values, index, fallback):
    """
    Gets the specified index value from the list, or the fallback value if
    index is out of bounds
    """
    if index < len(values):
        return values[index]
    return fallback


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

    def create_transaction(self, acct_amounts, env_amounts):
        """ Creates a transaction """
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
            # Invalid IDs
            (404, [10], [10], [], [], [8, 2], [], [], []),
            (404, [10], [10], [], [], [], [8, 2], [], []),
            (404, [10], [10], [], [], [], [], [1], []),
            (404, [10], [10], [], [], [], [], [], [1]),
        ]
    )
    # pylint: disable=too-many-arguments
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
                            "id": get(ids["acct_trn_ids"], index, 999),
                            "accountId": ids["acct_id"],
                            "amount": amount,
                        }
                        for index, amount in enumerate(mod_acct_amounts)
                    ],
                    "delete": [
                        get(ids["acct_trn_ids"], index, 999) for index in del_acct_idxs
                    ],
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
                            "id": get(ids["env_trn_ids"], index, 999),
                            "envelopeId": ids["env_id"],
                            "amount": amount,
                        }
                        for index, amount in enumerate(mod_env_amounts)
                    ],
                    "delete": [
                        get(ids["env_trn_ids"], index, 999) for index in del_env_idxs
                    ],
                },
            },
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            (200, "same", "same"),
            (400, None, "same"),
            (400, "same", None),
            (400, "", "same"),
            (400, "same", ""),
            (404, 0, "same"),
            (404, "same", 0),
            (404, -1, "same"),
            (404, "same", -1),
            (404, 999, "same"),
            (404, "same", 999),
            (400, "other", "same"),
            (400, "same", "other"),
            (200, "like", "same"),
            (200, "same", "like"),
        ]
    )
    def test_transaction_modifications_require_accounts_and_envelopes_from_save_ledger(
        self, code, acct_id, env_id
    ):
        ids, _ = self.create_transaction([10], [10])

        if acct_id == "same":
            acct_id = ids["acct_id"]
        elif acct_id == "like":
            cat_id = self.create_account_category(ids["ledger_id"])
            acct_id = self.create_account(cat_id)
        elif acct_id == "other":
            ledger_id = self.create_ledger()
            cat_id = self.create_account_category(ledger_id)
            acct_id = self.create_account(cat_id)

        if env_id == "same":
            env_id = ids["env_id"]
        elif env_id == "like":
            cat_id = self.create_envelope_category(ids["ledger_id"])
            env_id = self.create_envelope(cat_id)
        elif env_id == "other":
            ledger_id = self.create_ledger()
            cat_id = self.create_envelope_category(ledger_id)
            env_id = self.create_envelope(cat_id)

        resp = self.client.patch(
            f"/api/transactions/{ids['trn_id']}",
            json={
                "recordedDate": "2021-01-24",
                "payee": "Unit Testers",
                "accountTransactions": {
                    "modify": [
                        {
                            "id": ids["acct_trn_ids"][0],
                            "accountId": acct_id,
                            "amount": 10,
                        },
                    ],
                },
                "envelopeTransactions": {
                    "modify": [
                        {
                            "id": ids["env_trn_ids"][0],
                            "envelopeId": env_id,
                            "amount": 10,
                        },
                    ],
                },
            },
        )
        assert resp.status_code == code

    def test_transaction_deletion(self):
        ids, _ = self.create_transaction([10], [10])
        assert self.client.get(f"/api/transactions/{ids['trn_id']}").status_code == 200
        assert (
            self.client.delete(f"/api/transactions/{ids['trn_id']}").status_code == 204
        )
        assert self.client.get(f"/api/transactions/{ids['trn_id']}").status_code == 404

    def test_account_deletion_fails_when_transactions_exist(self):
        ids, _ = self.create_transaction([10], [10])
        assert self.client.delete(f"/api/accounts/{ids['acct_id']}").status_code == 409

    def test_envelope_deletion_fails_when_transactions_exist(self):
        ids, _ = self.create_transaction([10], [10])
        assert self.client.delete(f"/api/envelopes/{ids['env_id']}").status_code == 409

    def test_ledger_deletion_cascades_to_transactions(self):
        ids, _ = self.create_transaction([10], [10])

        assert self.client.get(f"/api/transactions/{ids['trn_id']}").status_code == 200
        assert self.client.delete(f"/api/ledgers/{ids['ledger_id']}").status_code == 204
        assert self.client.get(f"/api/transactions/{ids['trn_id']}").status_code == 404
