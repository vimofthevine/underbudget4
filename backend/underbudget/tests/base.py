""" Test case base class """
from datetime import datetime
import json
import unittest

from underbudget import app, config, database


def clean_db(db_to_clean):
    """ Deletes all content in all tables of the given database """
    for table in reversed(db_to_clean.metadata.sorted_tables):
        db_to_clean.session.execute(table.delete())


class BaseTestCase(unittest.TestCase):
    """ Custom base test case """

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.app = app.create_app(app_config=config.TestConfig)
        cls.db = database.db
        with cls.app.app_context():
            cls.db.create_all()
            cls.db.session.commit()

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            cls.db.drop_all()
        super().tearDownClass()

    def setUp(self):
        super().setUp()

        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        clean_db(self.db)

    def tearDown(self):
        self.db.session.rollback()
        self.app_context.pop()

        super().tearDown()

    def create_ledger(self, name="Ledger Name", currency=840):
        """ Creates a ledger resource """
        resp = self.client.post(
            "/api/ledgers", json={"name": name, "currency": currency}
        )
        assert resp.status_code == 201
        return json.loads(resp.data).get("id")

    def create_account_category(self, ledger_id, name="Account Category"):
        """ Creates an account category resource """
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/account-categories", json={"name": name}
        )
        assert resp.status_code == 201
        return json.loads(resp.data).get("id")

    def create_account(self, category_id, name="Account"):
        """ Creates an account resource """
        resp = self.client.post(
            f"/api/account-categories/{category_id}/accounts", json={"name": name}
        )
        assert resp.status_code == 201
        return json.loads(resp.data).get("id")

    def create_envelope_category(self, ledger_id, name="Envelope Category"):
        """ Creates an envelope category resource """
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/envelope-categories", json={"name": name}
        )
        assert resp.status_code == 201
        return json.loads(resp.data).get("id")

    def create_envelope(self, category_id, name="Envelope"):
        """ Creates an envelope resource """
        resp = self.client.post(
            f"/api/envelope-categories/{category_id}/envelopes", json={"name": name}
        )
        assert resp.status_code == 201
        return json.loads(resp.data).get("id")

    def create_budget(self, ledger_id, name="Budget", periods=12):
        """ Creates a budget """
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/budgets", json={"name": name, "periods": periods}
        )
        assert resp.status_code == 201
        return resp.json.get("id")

    def create_active_budget(self, ledger_id, budget_id, year=None):
        """ Creates an active budget """
        if not year:
            year = datetime.now().year
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/active-budgets",
            json={"budgetId": budget_id, "year": year},
        )
        assert resp.status_code == 201
        return resp.json.get("id")

    def create_periodic_income(self, budget_id, amount, name="Income"):
        """ Creates a budgeted periodic income """
        resp = self.client.post(
            f"/api/budgets/{budget_id}/periodic-incomes",
            json={"name": name, "amount": amount},
        )
        assert resp.status_code == 201
        return resp.json.get("id")

    def create_periodic_expense(self, budget_id, envelope_id, amount, name="Expense"):
        """ Creates a budgeted periodic expense """
        resp = self.client.post(
            f"/api/budgets/{budget_id}/periodic-expenses",
            json={"envelopeId": envelope_id, "name": name, "amount": amount},
        )
        assert resp.status_code == 201
        return resp.json.get("id")

    # pylint: disable=too-many-arguments
    def create_annual_expense(
        self, budget_id, envelope_id, amount=0, details=None, name="Expense"
    ):
        """ Creates a budgeted annual expense """
        expense_details = []
        if details:
            for detail_amount in details:
                expense_details.append({"name": "", "amount": detail_amount})
        resp = self.client.post(
            f"/api/budgets/{budget_id}/annual-expenses",
            json={
                "envelopeId": envelope_id,
                "name": name,
                "amount": amount,
                "details": expense_details,
            },
        )
        assert resp.status_code == 201
        return resp.json.get("id")

    def _test_crud_methods_against_non_existent_resource(self, base_url, payload):
        """
        Tests that the GET/PUT/DELETE methods against a resource return 404 against invalid IDs
        """
        assert self.client.get(f"{base_url}/not-an-id").status_code == 404
        assert self.client.get(f"{base_url}/-1").status_code == 404
        assert self.client.get(f"{base_url}/999").status_code == 404

        assert self.client.put(f"{base_url}/999", json=payload).status_code == 404

        assert self.client.delete(f"{base_url}/999").status_code == 404

    def _test_resource_is_audited(
        self, post_url, base_url, post_payload, put_payload=None
    ):
        """
        Tests that the created and lastUpdated fields of the resource are populated and updated by
        POST and PUT methods
        """
        resp = self.client.post(post_url, json=post_payload)
        assert resp.status_code == 201
        resource_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"{base_url}/{resource_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        created = body.get("created", "no-created")
        assert created == body.get("lastUpdated", "no-lastUpdated")

        if not put_payload:
            put_payload = post_payload

        resp = self.client.put(f"{base_url}/{resource_id}", json=put_payload)
        assert resp.status_code == 200

        body = json.loads(self.client.get(f"{base_url}/{resource_id}").data)
        assert body.get("created") == created
        assert body.get("lastUpdated") != created

        put_payload["created"] = ("2021-01-02T00:34:34+0000",)
        put_payload["lastUpdated"] = ("2021-01-02T01:34:34+0000",)

        resp = self.client.put(f"{base_url}/{resource_id}", json=put_payload)
        assert resp.status_code == 400

        body = json.loads(self.client.get(f"{base_url}/{resource_id}").data)
        assert body.get("created") == created
        assert body.get("lastUpdated") != "2021-01-02T01:34:34+0000"

    def _test_resource_is_modifiable(
        self, post_url, base_url, post_payload, put_payload
    ):
        """ Tests that the resource can be modified """
        resp = self.client.post(post_url, json=post_payload)
        assert resp.status_code == 201
        resource_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"{base_url}/{resource_id}")
        assert resp.status_code == 200
        for key, value in post_payload.items():
            assert resp.json.get(key, f"{key}-undefined") == value

        assert (
            self.client.put(f"{base_url}/{resource_id}", json=put_payload).status_code
            == 200
        )

        resp = self.client.get(f"{base_url}/{resource_id}")
        assert resp.status_code == 200
        for key, value in put_payload.items():
            assert resp.json.get(key, f"{key}-undefined") == value
