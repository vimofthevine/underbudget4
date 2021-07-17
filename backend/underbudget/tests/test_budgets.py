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

    def test_fetch_all_budgets(self):
        ledger_id = self.create_ledger()
        budget_1_id = self.create_budget(ledger_id, "Budget 1", periods=12)
        budget_2_id = self.create_budget(ledger_id, "Budget 2", periods=24)

        resp = self.client.get(f"/api/ledgers/{ledger_id}/budgets")
        assert resp.status_code == 200

        assert [budget_1_id, budget_2_id] == [
            m.value for m in parse("budgets[*].id").find(resp.json)
        ]
        assert ["Budget 1", "Budget 2"] == [
            m.value for m in parse("budgets[*].name").find(resp.json)
        ]
        assert [12, 24] == [
            m.value for m in parse("budgets[*].periods").find(resp.json)
        ]

    @parameterized.expand([("not-an-id",), (999,)])
    def test_active_budget_requires_valid_ledger(self, ledger_id=None):
        budget_id = self.create_budget(self.create_ledger())
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/active-budgets",
            json={"budgetId": budget_id, "year": 2021},
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            (400, "BudgetId", "auto"),
            (400, "budgetId", None),
            (400, "budgetId", ""),
            (404, "budgetId", 0),
            (404, "budgetId", -1),
            (404, "budgetId", 999),
            (400, "budgetId", "other"),
            (201, "budgetId", "auto"),
        ]
    )
    def test_active_budget_requires_valid_budget_id(self, code, key, value):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        other_ledger_id = self.create_ledger()
        other_budget_id = self.create_budget(other_ledger_id)

        if value == "auto":
            value = budget_id
        elif value == "other":
            value = other_budget_id

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/active-budgets",
            json={key: value, "year": 2021},
        )
        assert resp.status_code == code

    @parameterized.expand(
        [
            ("Year", 2021),
            ("Year", ""),
            ("Year", None),
        ]
    )
    def test_active_budget_requires_valid_year(self, key, value):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/active-budgets",
            json={"budgetId": budget_id, key: value},
        )
        assert resp.status_code == 400

    def test_active_budget_rejected_for_duplicate_year(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        self.create_active_budget(ledger_id, budget_id, year=2021)
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/active-budgets",
            json={"budgetId": budget_id, "year": 2021},
        )
        assert resp.status_code == 400

    def test_active_budget_not_found(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        self._test_crud_methods_against_non_existent_resource(
            "/api/active-budgets", {"budgetId": budget_id}
        )

    def test_active_budget_is_audited(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        self._test_resource_is_audited(
            f"/api/ledgers/{ledger_id}/active-budgets",
            "/api/active-budgets",
            {"budgetId": budget_id, "year": 2021},
            {"budgetId": budget_id},
        )

    def test_active_budget_modification(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        other_budget_id = self.create_budget(ledger_id)
        self._test_resource_is_modifiable(
            f"/api/ledgers/{ledger_id}/active-budgets",
            "/api/active-budgets",
            {"budgetId": budget_id, "year": 2021},
            {"budgetId": other_budget_id},
        )

    def test_active_budget_deletion(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        active_budget_id = self.create_active_budget(ledger_id, budget_id)
        assert (
            self.client.get(f"/api/active-budgets/{active_budget_id}").status_code
            == 200
        )
        assert (
            self.client.delete(f"/api/active-budgets/{active_budget_id}").status_code
            == 204
        )
        assert (
            self.client.get(f"/api/active-budgets/{active_budget_id}").status_code
            == 404
        )

    def test_prevent_delete_of_budget_while_active(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        self.create_active_budget(ledger_id, budget_id)
        assert(
            self.client.delete(f"/api/budgets/{budget_id}")
        ).status_code == 409

    def test_fetch_all_active_budgets(self):
        ledger_id = self.create_ledger()
        budget_1_id = self.create_budget(ledger_id, "Budget 1")
        budget_2_id = self.create_budget(ledger_id, "Budget 2")
        active_1_id = self.create_active_budget(ledger_id, budget_2_id, year=2021)
        active_2_id = self.create_active_budget(ledger_id, budget_1_id, year=2020)

        resp = self.client.get(f"/api/ledgers/{ledger_id}/active-budgets")
        assert resp.status_code == 200

        assert [active_1_id, active_2_id] == [
            m.value for m in parse("activeBudgets[*].id").find(resp.json)
        ]
        assert [budget_2_id, budget_1_id] == [
            m.value for m in parse("activeBudgets[*].budgetId").find(resp.json)
        ]
        assert ["Budget 2", "Budget 1"] == [
            m.value for m in parse("activeBudgets[*].name").find(resp.json)
        ]

    def test_fetch_active_budget(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id, "Budget 1")
        active_id = self.create_active_budget(ledger_id, budget_id, year=2021)

        resp = self.client.get(f"/api/active-budgets/{active_id}")
        assert resp.status_code == 200
        assert resp.json.get("budgetId") == budget_id
        assert resp.json.get("name") == "Budget 1"
        assert resp.json.get("year") == 2021
