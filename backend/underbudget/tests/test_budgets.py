""" Integration tests for budget APIs """
from jsonpath_ng.ext import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class BudgetsTestCase(BaseTestCase):
    """ Integration tests for budget APIs """

    @parameterized.expand([("not-an-id",), (999,)])
    def test_budget_requires_valid_ledger(self, ledger_id=None):
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets",
            json={"name": "Test Budget", "periods": 12},
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            ("Name", "Test Budget"),
            ("name", ""),
            ("name", None),
        ]
    )
    def test_budget_requires_valid_name(self, key, value):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets", json={key: value, "periods": 12}
        )
        assert resp.status_code == 400

    @parameterized.expand(
        [
            ("Periods", 12, 400),
            ("periods", "", 400),
            ("periods", None, 400),
            ("periods", 0, 400),
            ("periods", "1", 201),
            ("periods", 1, 201),
            ("periods", 2, 201),
            ("periods", 3, 201),
            ("periods", 4, 201),
            ("periods", 5, 400),
            ("periods", 6, 201),
            ("periods", 12, 201),
            ("periods", 24, 201),
            ("periods", 26, 201),
            ("periods", 52, 201),
        ]
    )
    def test_budget_requires_valid_periods(self, key, value, code):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets",
            json={"name": "Test Budget", key: value},
        )
        assert resp.status_code == code

    def test_budget_not_found(self):
        self._test_crud_methods_against_non_existent_resource(
            "/api/budgets", {"name": "Test Budget", "periods": 12}
        )

    def test_budget_is_audited(self):
        ledger_id = self.create_ledger()
        self._test_resource_is_audited(
            f"/api/ledgers/{ledger_id}/budgets",
            "/api/budgets",
            {"name": "Test Budget", "periods": 12},
        )

    def test_budget_modification(self):
        ledger_id = self.create_ledger()
        self._test_resource_is_modifiable(
            f"/api/ledgers/{ledger_id}/budgets",
            "/api/budgets",
            {"name": "Original Budget", "periods": 12},
            {"name": "Modified Budget", "periods": 24},
        )

    def test_budget_deletion(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        assert self.client.get(f"/api/budgets/{budget_id}").status_code == 200
        assert self.client.delete(f"/api/budgets/{budget_id}").status_code == 204
        assert self.client.get(f"/api/budgets/{budget_id}").status_code == 404
