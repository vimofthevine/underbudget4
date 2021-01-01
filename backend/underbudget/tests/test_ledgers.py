""" Integration tests for ledger APIs """
from underbudget.tests.base import BaseTestCase


class LedgersTestCase(BaseTestCase):
    """ Integration tests for ledger APIs """

    def test_ledger_requires_valid_name(self):
        resp = self.client.post(
            "/api/ledgers", json={"Name": "Ledger Name", "currency": 840}
        )
        assert resp.status_code == 400

        resp = self.client.post(
            "/api/ledgers", json={"name": "", "currency": 840}
        )
        assert resp.status_code == 400

        resp = self.client.post(
            "/api/ledgers", json={"name": None, "currency": 840}
        )
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
