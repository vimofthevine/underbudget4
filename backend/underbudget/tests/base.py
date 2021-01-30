""" Test case base class """
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
        cls.db.init_app(cls.app)

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

    def _test_crud_methods_against_non_existent_resource(self, base_url, payload):
        """
        Tests that the GET/PUT/DELETE methods against a resource return 404 against invalid IDs
        """
        assert self.client.get(f"{base_url}/not-an-id").status_code == 404
        assert self.client.get(f"{base_url}/-1").status_code == 404
        assert self.client.get(f"{base_url}/999").status_code == 404

        assert self.client.put(f"{base_url}/999", json=payload).status_code == 404

        assert self.client.delete(f"{base_url}/999").status_code == 404

    def _test_resource_is_audited(self, post_url, base_url, payload):
        """
        Tests that the created and lastUpdated fields of the resource are populated and updated by
        POST and PUT methods
        """
        resp = self.client.post(post_url, json=payload)
        assert resp.status_code == 201
        resource_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"{base_url}/{resource_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        created = body.get("created", "no-created")
        assert created == body.get("lastUpdated", "no-lastUpdated")

        resp = self.client.put(f"{base_url}/{resource_id}", json=payload)
        assert resp.status_code == 200

        body = json.loads(self.client.get(f"{base_url}/{resource_id}").data)
        assert body.get("created") == created
        assert body.get("lastUpdated") != created

        payload["created"] = ("2021-01-02T00:34:34+0000",)
        payload["lastUpdated"] = ("2021-01-02T01:34:34+0000",)

        resp = self.client.put(f"{base_url}/{resource_id}", json=payload)
        # TODO uncomment this when all resources use webargs
        # assert resp.status_code == 400

        body = json.loads(self.client.get(f"{base_url}/{resource_id}").data)
        assert body.get("created") == created
        assert body.get("lastUpdated") != "2021-01-02T01:34:34+0000"
