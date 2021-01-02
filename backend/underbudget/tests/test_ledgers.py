""" Integration tests for ledger APIs """
import json
from jsonpath_ng import parse

from underbudget.tests.base import BaseTestCase


class LedgersTestCase(BaseTestCase):
    """ Integration tests for ledger APIs """

    def test_ledger_requires_valid_name(self):
        resp = self.client.post(
            "/api/ledgers", json={"Name": "Ledger Name", "currency": 840}
        )
        assert resp.status_code == 400

        resp = self.client.post("/api/ledgers", json={"name": "", "currency": 840})
        assert resp.status_code == 400

        resp = self.client.post("/api/ledgers", json={"name": None, "currency": 840})
        assert resp.status_code == 400

    def test_ledger_requires_valid_currency(self):
        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger Name", "Currency": 840}
        )
        assert resp.status_code == 400

        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger Name", "currency": 0}
        )
        assert resp.status_code == 400

        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger Name", "currency": None}
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
        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger", "currency": 840}
        )
        assert resp.status_code == 201

        assert self.client.get("/api/ledgers/not-an-id").status_code == 404
        assert self.client.get("/api/ledgers/-1").status_code == 404
        assert self.client.get("/api/ledgers/999").status_code == 404

        resp = self.client.put(
            "/api/ledgers/999", json={"name": "Ledger", "currency": 978}
        )
        assert resp.status_code == 404

        assert self.client.delete("/api/ledgers/999").status_code == 404

    def test_ledger_is_audited(self):
        resp = self.client.post(
            "/api/ledgers", json={"name": "Audited eLdger", "currency": 840}
        )
        assert resp.status_code == 201
        ledger_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"/api/ledgers/{ledger_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        created = body.get("created", "no-created")
        assert body.get("name") == "Audited eLdger"
        assert body.get("currency") == 840
        assert created == body.get("lastUpdated", "no-lastUpdated")

        resp = self.client.put(
            f"/api/ledgers/{ledger_id}",
            json={"name": "Audited Ledger", "currency": 978},
        )
        assert resp.status_code == 200

        body = json.loads(self.client.get(f"/api/ledgers/{ledger_id}").data)
        assert body.get("name") == "Audited Ledger"
        assert body.get("currency") == 978
        assert body.get("created") == created
        assert body.get("lastUpdated") != created

        resp = self.client.put(
            f"/api/ledgers/{ledger_id}",
            json={
                "name": "Bypass Auditing Ledger",
                "currency": 123,
                "created": "2021-01-02T00:34:34+0000",
                "lastUpdated": "2021-01-02T01:34:34+0000",
            },
        )
        assert resp.status_code == 200

        body = json.loads(self.client.get(f"/api/ledgers/{ledger_id}").data)
        assert body.get("name") == "Bypass Auditing Ledger"
        assert body.get("currency") == 123
        assert body.get("created") == created
        assert body.get("lastUpdated") != "2021-01-02T01:34:34+0000"

    def test_ledger_deletion(self):
        resp = self.client.post(
            "/api/ledgers", json={"name": "Ledger", "currency": 840}
        )
        assert resp.status_code == 201
        ledger_id = json.loads(resp.data).get("id")

        assert self.client.get(f"/api/ledgers/{ledger_id}").status_code == 200
        assert self.client.delete(f"/api/ledgers/{ledger_id}").status_code == 204
        assert self.client.get(f"/api/ledgers/{ledger_id}").status_code == 404
