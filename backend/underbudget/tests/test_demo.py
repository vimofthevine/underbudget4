""" Integration tests for demo API """
from underbudget.tests.base import BaseTestCase


class DemoTestCase(BaseTestCase):
    """ Integration tests for demo API """

    def test_create_simple_demo(self):
        resp = self.client.post(
            "/api/demos",
            json={
                "name": "Demo",
                "currency": 840,
                "months": 3,
            },
        )
        assert resp.status_code == 201

    def test_create_complex_demo(self):
        resp = self.client.post(
            "/api/demos",
            json={
                "name": "Demo",
                "currency": 840,
                "months": 18,
            },
        )
        assert resp.status_code == 201
