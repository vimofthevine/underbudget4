""" Integration tests for budget generator APIs """
from jsonpath_ng.ext import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class BudgetGeneratorsTestCase(BaseTestCase):
    """ Integration tests for budget generator APIs """

    @parameterized.expand([("not-an-id",), (999,)])
    def test_budget_copy_requires_valid_ledger(self, ledger_id=None):
        budget_id = self.create_budget(self.create_ledger())
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets/copy",
            json={"origId": budget_id},
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            (400, "OrigId", "auto"),
            (400, "origId", None),
            (400, "origId", ""),
            (404, "origId", 0),
            (404, "origId", -1),
            (404, "origId", 999),
            (400, "origId", "other"),
            (201, "origId", "auto"),
        ]
    )
    def test_budget_copy_requires_valid_orig_id(self, code, key, value):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        other_ledger_id = self.create_ledger()
        other_budget_id = self.create_budget(other_ledger_id)

        if value == "auto":
            value = budget_id
        elif value == "other":
            value = other_budget_id

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets/copy",
            json={key: value},
        )
        assert resp.status_code == code

    def test_budget_copy_includes_periodic_incomes(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id)
        income_1_id = self.create_periodic_income(
            budget_id, name="Income 1", amount=100
        )
        income_2_id = self.create_periodic_income(
            budget_id, name="Income 2", amount=200
        )

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets/copy",
            json={"origId": budget_id},
        )
        assert resp.status_code == 201
        copy_budget_id = resp.json.get("id")

        resp = self.client.get(f"/api/budgets/{copy_budget_id}/periodic-incomes")
        assert resp.status_code == 200

        income_ids = [m.value for m in parse("incomes[*].id").find(resp.json)]
        assert income_1_id not in income_ids
        assert income_2_id not in income_ids
        assert ["Income 1", "Income 2"] == [
            m.value for m in parse("incomes[*].name").find(resp.json)
        ]
        assert [100, 200] == [
            m.value for m in parse("incomes[*].amount").find(resp.json)
        ]

    def test_budget_copy_includes_periodic_expenses(self):
        ledger_id = self.create_ledger()
        env_cat_id = self.create_envelope_category(ledger_id)
        envelope_1_id = self.create_envelope(env_cat_id)
        envelope_2_id = self.create_envelope(env_cat_id)
        budget_id = self.create_budget(ledger_id)
        expense_1_id = self.create_periodic_expense(
            budget_id, envelope_2_id, name="Expense 1", amount=100
        )
        expense_2_id = self.create_periodic_expense(
            budget_id, envelope_1_id, name="Expense 2", amount=200
        )

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets/copy",
            json={"origId": budget_id},
        )
        assert resp.status_code == 201
        copy_budget_id = resp.json.get("id")

        resp = self.client.get(f"/api/budgets/{copy_budget_id}/periodic-expenses")
        assert resp.status_code == 200

        expense_ids = [m.value for m in parse("expenses[*].id").find(resp.json)]
        assert expense_1_id not in expense_ids
        assert expense_2_id not in expense_ids
        assert [envelope_2_id, envelope_1_id] == [
            m.value for m in parse("expenses[*].envelopeId").find(resp.json)
        ]
        assert ["Expense 1", "Expense 2"] == [
            m.value for m in parse("expenses[*].name").find(resp.json)
        ]
        assert [100, 200] == [
            m.value for m in parse("expenses[*].amount").find(resp.json)
        ]

    def test_budget_copy_includes_annual_expenses(self):
        ledger_id = self.create_ledger()
        env_cat_id = self.create_envelope_category(ledger_id)
        envelope_1_id = self.create_envelope(env_cat_id)
        envelope_2_id = self.create_envelope(env_cat_id)
        budget_id = self.create_budget(ledger_id, periods=2)
        expense_1_id = self.create_annual_expense(
            budget_id, envelope_2_id, name="Expense 1", amount=100
        )
        expense_2_id = self.create_annual_expense(
            budget_id, envelope_1_id, name="Expense 2", details=[75, 85]
        )

        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets/copy",
            json={"origId": budget_id},
        )
        assert resp.status_code == 201
        copy_budget_id = resp.json.get("id")

        resp = self.client.get(f"/api/budgets/{copy_budget_id}/annual-expenses")
        assert resp.status_code == 200

        expense_ids = [m.value for m in parse("expenses[*].id").find(resp.json)]
        assert expense_1_id not in expense_ids
        assert expense_2_id not in expense_ids
        assert [envelope_2_id, envelope_1_id] == [
            m.value for m in parse("expenses[*].envelopeId").find(resp.json)
        ]
        assert ["Expense 1", "Expense 2"] == [
            m.value for m in parse("expenses[*].name").find(resp.json)
        ]
        assert [100, 160] == [
            m.value for m in parse("expenses[*].amount").find(resp.json)
        ]
        assert [75, 85] == [
            m.value for m in parse("expenses[1].details[*].amount").find(resp.json)
        ]
