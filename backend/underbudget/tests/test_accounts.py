""" Integration tests for account APIs """
import json
from jsonpath_ng.ext import parse
from parameterized import parameterized

from underbudget.tests.base import BaseTestCase


class AccountsTestCase(BaseTestCase):
    """ Integration tests for account APIs """

    @parameterized.expand([("not-an-id",), (999,)])
    def test_account_category_requires_valid_ledger(self, ledger_id=None):
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/account-categories",
            json={"name": "Account Category"},
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            ("Name", "Account Category"),
            ("name", ""),
            ("name", None),
        ]
    )
    def test_account_category_requires_valid_name(self, key, value):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/account-categories",
            json={key: value},
        )
        assert resp.status_code == 400

    def test_account_category_not_found(self):
        self._test_crud_methods_against_non_existent_resource(
            "/api/account-categories", {"name": "Account Category"}
        )

    def test_account_category_is_audited(self):
        ledger_id = self.create_ledger()
        self._test_resource_is_audited(
            f"/api/ledgers/{ledger_id}/account-categories",
            "/api/account-categories",
            {"name": "Account Category"},
        )

    def test_account_category_modification(self):
        ledger_id = self.create_ledger()
        resp = self.client.post(
            f"/api/ledgers/{ledger_id}/account-categories",
            json={"name": "Original Name"},
        )
        assert resp.status_code == 201
        category_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"/api/account-categories/{category_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Original Name"

        resp = self.client.put(
            f"/api/account-categories/{category_id}", json={"name": "Modified Name"}
        )
        assert resp.status_code == 200

        resp = self.client.get(f"/api/account-categories/{category_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Modified Name"

    def test_account_category_deletion(self):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        assert (
            self.client.get(f"/api/account-categories/{category_id}").status_code == 200
        )
        assert (
            self.client.delete(f"/api/account-categories/{category_id}").status_code
            == 204
        )
        assert (
            self.client.get(f"/api/account-categories/{category_id}").status_code == 404
        )

    @parameterized.expand([("not-an-id",), (999,)])
    def test_account_requires_valid_category(self, category_id):
        resp = self.client.post(
            f"/api/account-categories/{category_id}/accounts", json={"name": "Account"}
        )
        assert resp.status_code == 404

    @parameterized.expand(
        [
            ("Name", "Account"),
            ("name", ""),
            ("name", None),
        ]
    )
    def test_account_requires_valid_name(self, key, value):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        resp = self.client.post(
            f"/api/account-categories/{category_id}/accounts", json={key: value}
        )
        assert resp.status_code == 400

    @parameterized.expand(
        [
            ("institution",),
            ("accountNumber",),
            ("archived",),
            ("externalId",),
        ]
    )
    def test_account_requires_non_null_optional_values(self, key):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        resp = self.client.post(
            f"/api/account-categories/{category_id}/accounts",
            json={"name": "Account", key: None},
        )
        assert resp.status_code == 400

    def test_account_not_found(self):
        self._test_crud_methods_against_non_existent_resource(
            "/api/accounts",
            {"name": "Account"},
        )

    def test_account_is_audited(self):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        self._test_resource_is_audited(
            f"/api/account-categories/{category_id}/accounts",
            "/api/accounts",
            {"name": "Account"},
        )

    def test_account_modification(self):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        resp = self.client.post(
            f"/api/account-categories/{category_id}/accounts",
            json={"name": "Original Name"},
        )
        assert resp.status_code == 201
        account_id = json.loads(resp.data).get("id")

        resp = self.client.get(f"/api/accounts/{account_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Original Name"
        assert body.get("institution") == ""
        assert body.get("accountNumber") == ""
        assert not body.get("archived")
        assert body.get("externalId") == ""

        resp = self.client.put(
            f"/api/accounts/{account_id}",
            json={
                "name": "Modified Name",
                "institution": "Bank Name",
                "accountNumber": "8675309",
                "archived": True,
                "externalId": "tk-421",
            },
        )
        assert resp.status_code == 200

        resp = self.client.get(f"/api/accounts/{account_id}")
        assert resp.status_code == 200
        body = json.loads(resp.data)
        assert body.get("name") == "Modified Name"
        assert body.get("institution") == "Bank Name"
        assert body.get("accountNumber") == "8675309"
        assert body.get("archived")
        assert body.get("externalId") == "tk-421"

    def test_account_deletion(self):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        account_id = self.create_account(category_id)
        assert self.client.get(f"/api/accounts/{account_id}").status_code == 200
        assert self.client.delete(f"/api/accounts/{account_id}").status_code == 204
        assert self.client.get(f"/api/accounts/{account_id}").status_code == 404

    def test_fetch_all_account_categories(self):
        ledger_id = self.create_ledger()
        cat1_id = self.create_account_category(ledger_id, "Category 1")
        cat2_id = self.create_account_category(ledger_id, "Category 2")
        cat3_id = self.create_account_category(ledger_id, "Category 3")
        acct1_id = self.create_account(cat2_id, "Account 1")
        acct2_id = self.create_account(cat1_id, "Account 2")
        acct3_id = self.create_account(cat2_id, "Account 3")

        resp = self.client.get(f"/api/ledgers/{ledger_id}/account-categories")
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
        assert len(sub[0].value.get("accounts")) == 1
        assert sub[0].value.get("accounts")[0].get("id") == acct2_id
        assert sub[0].value.get("accounts")[0].get("name") == "Account 2"
        assert not sub[0].value.get("accounts")[0].get("archived")

        sub = parse(f"$.categories[?id={cat2_id}]").find(body)
        assert sub is not None and len(sub) == 1
        assert sub[0].value.get("name") == "Category 2"
        assert len(sub[0].value.get("accounts")) == 2

        acct = parse(f"$.accounts[?id={acct1_id}]").find(sub[0].value)
        assert acct is not None and len(acct) == 1
        assert acct[0].value.get("id") == acct1_id
        assert acct[0].value.get("name") == "Account 1"
        assert not acct[0].value.get("archived")

        acct = parse(f"$.accounts[?id={acct3_id}]").find(sub[0].value)
        assert acct is not None and len(acct) == 1
        assert acct[0].value.get("id") == acct3_id
        assert acct[0].value.get("name") == "Account 3"
        assert not acct[0].value.get("archived")

        sub = parse(f"$.categories[?id={cat3_id}]").find(body)
        assert sub is not None and len(sub) == 1
        assert sub[0].value.get("name") == "Category 3"
        assert len(sub[0].value.get("accounts")) == 0

    def test_account_category_deletion_fails_with_child_accounts(self):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        account_id = self.create_account(category_id)

        assert (
            self.client.delete(f"/api/account-categories/{category_id}").status_code
            == 409
        )
        assert self.client.get(f"/api/accounts/{account_id}").status_code == 200

    def test_ledger_deletion_cascades_to_account_categories(self):
        ledger_id = self.create_ledger()
        category_id = self.create_account_category(ledger_id)
        account_id = self.create_account(category_id)

        assert (
            self.client.get(f"/api/account-categories/{category_id}").status_code == 200
        )
        assert self.client.get(f"/api/accounts/{account_id}").status_code == 200
        assert self.client.delete(f"/api/ledgers/{ledger_id}").status_code == 204
        assert (
            self.client.get(f"/api/account-categories/{category_id}").status_code == 404
        )
        assert self.client.get(f"/api/accounts/{account_id}").status_code == 404
