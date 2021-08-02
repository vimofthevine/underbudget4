""" Integration tests for budget query APIs """
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class BudgetQueriesTestCase(BaseTestCase):
    """ Integration tests for budget query APIs """

    @parameterized.expand(
        [
            ("not-an-id", 2021, 1),
            (999, 2021, 1),
            ("auto", "not-a-year", 1),
            ("auto", 2022, 1),
            ("auto", 2021, "not-a-period"),
            ("auto", 2021, -1),
            ("auto", 2021, 2),
        ]
    )
    def test_active_budgeted_expenses_when_budget_not_found(self, ledger, year, period):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id, periods=2)
        self.create_active_budget(ledger_id, budget_id, year=2021)

        if ledger == "auto":
            ledger = ledger_id

        assert (
            self.client.get(
                f"/api/ledgers/{ledger}/budgeted-expenses/{year}/{period}"
            ).status_code
            == 404
        )

    def test_active_budget_expenses_include_all_expenses_for_period(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id, periods=4)
        self.create_active_budget(ledger_id, budget_id, year=2021)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_1_id = self.create_envelope(env_cat_id)
        env_2_id = self.create_envelope(env_cat_id)
        env_3_id = self.create_envelope(env_cat_id)
        self.create_periodic_expense(budget_id, env_1_id, amount=75)
        self.create_periodic_expense(budget_id, env_2_id, amount=50)
        self.create_periodic_expense(budget_id, env_3_id, amount=120)
        self.create_annual_expense(budget_id, env_2_id, amount=240)
        self.create_annual_expense(budget_id, env_1_id, details=[17, 21, 0, 13])

        resp = self.client.get(f"/api/ledgers/{ledger_id}/budgeted-expenses/2021/0")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 92,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

        resp = self.client.get(f"/api/ledgers/{ledger_id}/budgeted-expenses/2021/1")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 96,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

        resp = self.client.get(f"/api/ledgers/{ledger_id}/budgeted-expenses/2021/2")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 75,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

        resp = self.client.get(f"/api/ledgers/{ledger_id}/budgeted-expenses/2021/3")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 88,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

    @parameterized.expand(
        [
            ("not-an-id", 1),
            (999, 1),
            ("auto", "not-a-period"),
            ("auto", -1),
            ("auto", 2),
        ]
    )
    def test_budgeted_expenses_when_budget_not_found(self, budget, period):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id, periods=2)

        if budget == "auto":
            budget = budget_id

        assert (
            self.client.get(
                f"/api/budgets/{budget}/budgeted-expenses/{period}"
            ).status_code
            == 404
        )

    def test_budget_expenses_include_all_expenses_for_period(self):
        ledger_id = self.create_ledger()
        budget_id = self.create_budget(ledger_id, periods=4)
        env_cat_id = self.create_envelope_category(ledger_id)
        env_1_id = self.create_envelope(env_cat_id)
        env_2_id = self.create_envelope(env_cat_id)
        env_3_id = self.create_envelope(env_cat_id)
        self.create_periodic_expense(budget_id, env_1_id, amount=75)
        self.create_periodic_expense(budget_id, env_2_id, amount=50)
        self.create_periodic_expense(budget_id, env_3_id, amount=120)
        self.create_annual_expense(budget_id, env_2_id, amount=240)
        self.create_annual_expense(budget_id, env_1_id, details=[17, 21, 0, 13])

        resp = self.client.get(f"/api/budgets/{budget_id}/budgeted-expenses/0")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 92,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

        resp = self.client.get(f"/api/budgets/{budget_id}/budgeted-expenses/1")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 96,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

        resp = self.client.get(f"/api/budgets/{budget_id}/budgeted-expenses/2")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 75,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }

        resp = self.client.get(f"/api/budgets/{budget_id}/budgeted-expenses/3")
        assert resp.status_code == 200
        assert resp.json == {
            "expensesByEnvelopeId": {
                str(env_1_id): 88,
                str(env_2_id): 110,
                str(env_3_id): 120,
            }
        }
