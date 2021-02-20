""" Integration tests for ledger APIs """
import json
from jsonpath_ng import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class LedgersTestCase(BaseTestCase):
    """ Integration tests for ledger APIs """

    @parameterized.expand(
        [
            ("Name", "Ledger Name"),
            ("name", ""),
            ("name", None),
        ]
    )
    def test_ledger_requires_valid_name(self, key, value):
        resp = self.client.post("/api/ledgers", json={key: value, "currency": 840})
        assert resp.status_code == 400

    @parameterized.expand(
        [
            ("Currency", 840),
            ("currency", 0),
            ("currency", None),
        ]
    )
    def test_ledger_requires_valid_currency(self, key, value):
        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger Name", key: value}
        )
        assert resp.status_code == 400

    def test_ledgers_are_paginated(self):
        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger Name", "currency": 840}
        )
        assert resp.status_code == 201

        resp = self.client.get("/api/ledgers?size=2")
        assert resp.status_code == 200
        actual = json.loads(resp.data)
        assert ["Ledger Name"] == [
            m.value for m in parse("ledgers[*].name").find(actual)
        ]
        assert actual.get("page") == 1
        assert actual.get("size") == 2
        assert actual.get("total") == 1

        for i in range(10):
            resp = self.client.post(
                "/api/ledgers", json={"name": f"Ledger {i}", "currency": 840}
            )
            assert resp.status_code == 201

        resp = self.client.get("/api/ledgers?size=2")
        assert resp.status_code == 200
        actual = json.loads(resp.data)
        assert len(actual.get("ledgers", [])) == 2
        assert actual.get("page") == 1
        assert actual.get("size") == 2
        assert actual.get("total") == 11

        resp = self.client.get("/api/ledgers?size=2&page=3")
        assert resp.status_code == 200
        actual = json.loads(resp.data)
        assert len(actual.get("ledgers", [])) == 2
        assert actual.get("page") == 3
        assert actual.get("size") == 2
        assert actual.get("total") == 11

    def test_ledger_not_found(self):
        self._test_crud_methods_against_non_existent_resource(
            "/api/ledgers", {"name": "Ledger", "currency": 978}
        )

    def test_ledger_is_audited(self):
        self._test_resource_is_audited(
            "/api/ledgers", "/api/ledgers", {"name": "Audited Ledger", "currency": 840}
        )

    def test_ledger_modification(self):
        resp = self.client.post(
            "/api/ledgers", json={"name": "Original Name", "currency": 840}
        )
        assert resp.status_code == 201
        ledger_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"/api/ledgers/{ledger_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == body.get("name")
        assert body.get("currency") == 840

        resp = self.client.put(
            f"/api/ledgers/{ledger_id}", json={"name": "Modified Name", "currency": 978}
        )
        assert resp.status_code == 200

        resp = self.client.get(f"/api/ledgers/{ledger_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == body.get("name")
        assert body.get("currency") == 978

    def test_ledger_deletion(self):
        ledger_id = self.create_ledger()
        assert self.client.get(f"/api/ledgers/{ledger_id}").status_code == 200
        assert self.client.delete(f"/api/ledgers/{ledger_id}").status_code == 204
        assert self.client.get(f"/api/ledgers/{ledger_id}").status_code == 404
