""" Integration tests for health API """
from underbudget.tests.base import BaseTestCase


class HealthTestCase(BaseTestCase):
    """ Integration tests for health API """

    def test_health(self):
        assert self.client.get("/health").status_code == 200
