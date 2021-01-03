""" Integration tests for envelope APIs """
import json
from jsonpath_ng.ext import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class EnvelopesTestCase(BaseTestCase):
    """ Integration tests for envelope APIs """

    @parameterized.expand([("not-an-id",), (999,)])
    def test_envelope_category_requires_valid_ledger(self, ledger_id=None):
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/envelope-categories",
            json={"name": "Envelope Category"},
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            ("Name", "Envelope Category"),
            ("name", ""),
            ("name", None),
        ]
    )
    def test_envelope_category_requires_valid_name(self, key, value):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/envelope-categories",
            json={key: value},
        )
        assert resp.status_code == 400

    def test_envelope_category_not_found(self):
        self._test_crud_methods_against_non_existent_resource(
            "/api/envelope-categories", {"name": "Envelope Category"}
        )

    def test_envelope_category_is_audited(self):
        ledger_id = self.create_ledger()
        self._test_resource_is_audited(
            f"/api/ledgers/{ledger_id}/envelope-categories",
            "/api/envelope-categories",
            {"name": "Envelope Category"},
        )

    def test_envelope_category_modification(self):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/envelope-categories",
            json={"name": "Original Name"},
        )
        assert resp.status_code == 201
        category_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"/api/envelope-categories/{category_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Original Name"

        resp = self.client.put(
            f"/api/envelope-categories/{category_id}", json={"name": "Modified Name"}
        )
        assert resp.status_code == 200

        resp = self.client.get(f"/api/envelope-categories/{category_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Modified Name"

    def test_envelope_category_deletion(self):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        assert (
            self.client.get(f"/api/envelope-categories/{category_id}").status_code
            == 200
        )
        assert (
            self.client.delete(f"/api/envelope-categories/{category_id}").status_code
            == 204
        )
        assert (
            self.client.get(f"/api/envelope-categories/{category_id}").status_code
            == 404
        )

    @parameterized.expand([("not-an-id",), (999,)])
    def test_envelope_requires_valid_category(self, category_id):
        resp = self.client.post(
            f"/api/envelope-categories/{category_id}/envelopes",
            json={"name": "Envelope"},
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            ("Name", "Envelope"),
            ("name", ""),
            ("name", None),
        ]
    )
    def test_envelope_requires_valid_name(self, key, value):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        resp = self.client.post(
            f"/api/envelope-categories/{category_id}/envelopes", json={key: value}
        )
        assert resp.status_code == 400

    @parameterized.expand(
        [
            ("archived",),
            ("externalId",),
        ]
    )
    def test_envelope_requires_non_null_optional_values(self, key):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        resp = self.client.post(
            f"/api/envelope-categories/{category_id}/envelopes",
            json={"name": "Envelope", key: None},
        )
        assert resp.status_code == 400

    def test_envelope_not_found(self):
        self._test_crud_methods_against_non_existent_resource(
            "/api/envelopes",
            {"name": "Envelope"},
        )

    def test_envelope_is_audited(self):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        self._test_resource_is_audited(
            f"/api/envelope-categories/{category_id}/envelopes",
            "/api/envelopes",
            {"name": "Envelope"},
        )

    def test_envelope_modification(self):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        resp = self.client.post(
            f"/api/envelope-categories/{category_id}/envelopes",
            json={"name": "Original Name"},
        )
        assert resp.status_code == 201
        envelope_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"/api/envelopes/{envelope_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Original Name"
        assert not body.get("archived")
        assert body.get("externalId") == ""

        resp = self.client.put(
            f"/api/envelopes/{envelope_id}",
            json={
                "name": "Modified Name",
                "archived": True,
                "externalId": "tk-421",
            },
        )
        assert resp.status_code == 200

        resp = self.client.get(f"/api/envelopes/{envelope_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Modified Name"
        assert body.get("archived")
        assert body.get("externalId") == "tk-421"

    def test_envelope_deletion(self):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        envelope_id = self.create_envelope(category_id)
        assert self.client.get(f"/api/envelopes/{envelope_id}").status_code == 200
        assert self.client.delete(f"/api/envelopes/{envelope_id}").status_code == 204
        assert self.client.get(f"/api/envelopes/{envelope_id}").status_code == 404

    def test_fetch_all_envelope_categories(self):
        ledger_id = self.create_ledger()
        cat1_id = self.create_envelope_category(ledger_id, "Category 1")
        cat2_id = self.create_envelope_category(ledger_id, "Category 2")
        cat3_id = self.create_envelope_category(ledger_id, "Category 3")
        acct1_id = self.create_envelope(cat2_id, "Envelope 1")
        acct2_id = self.create_envelope(cat1_id, "Envelope 2")
        acct3_id = self.create_envelope(cat2_id, "Envelope 3")

        resp = self.client.get(f"/api/ledgers/{ledger_id}/envelope-categories")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        print(body)

        assert [cat1_id, cat2_id, cat3_id] == [
            m.value for m in parse("categories[*].id").find(body)
        ]
        assert ["Category 1", "Category 2", "Category 3"] == [
            m.value for m in parse("categories[*].name").find(body)
        ]

        sub = parse(f"$.categories[?id={cat1_id}]").find(body)
        assert sub is not None and len(sub) == 1
        assert sub[0].value.get("name") == "Category 1"
        assert len(sub[0].value.get("envelopes")) == 1
        assert sub[0].value.get("envelopes")[0].get("id") == acct2_id
        assert sub[0].value.get("envelopes")[0].get("name") == "Envelope 2"
        assert not sub[0].value.get("envelopes")[0].get("archived")

        sub = parse(f"$.categories[?id={cat2_id}]").find(body)
        assert sub is not None and len(sub) == 1
        assert sub[0].value.get("name") == "Category 2"
        assert len(sub[0].value.get("envelopes")) == 2

        acct = parse(f"$.envelopes[?id={acct1_id}]").find(sub[0].value)
        assert acct is not None and len(acct) == 1
        assert acct[0].value.get("id") == acct1_id
        assert acct[0].value.get("name") == "Envelope 1"
        assert not acct[0].value.get("archived")

        acct = parse(f"$.envelopes[?id={acct3_id}]").find(sub[0].value)
        assert acct is not None and len(acct) == 1
        assert acct[0].value.get("id") == acct3_id
        assert acct[0].value.get("name") == "Envelope 3"
        assert not acct[0].value.get("archived")

        sub = parse(f"$.categories[?id={cat3_id}]").find(body)
        assert sub is not None and len(sub) == 1
        assert sub[0].value.get("name") == "Category 3"
        assert len(sub[0].value.get("envelopes")) == 0

    def test_envelope_category_deletion_cascades_envelopes(self):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        envelope_id = self.create_envelope(category_id)

        assert self.client.get(f"/api/envelopes/{envelope_id}").status_code == 200
        assert (
            self.client.delete(f"/api/envelope-categories/{category_id}").status_code
            == 204
        )
        assert self.client.get(f"/api/envelopes/{envelope_id}").status_code == 404

    def test_ledger_deletion_cascades_to_envelope_categories(self):
        ledger_id = self.create_ledger()
        category_id = self.create_envelope_category(ledger_id)
        envelope_id = self.create_envelope(category_id)

        assert (
            self.client.get(f"/api/envelope-categories/{category_id}").status_code
            == 200
        )
        assert self.client.get(f"/api/envelopes/{envelope_id}").status_code == 200
        assert self.client.delete(f"/api/ledgers/{ledger_id}").status_code == 204
        assert (
            self.client.get(f"/api/envelope-categories/{category_id}").status_code
            == 404
        )
        assert self.client.get(f"/api/envelopes/{envelope_id}").status_code == 404
