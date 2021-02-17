""" Accounts REST view """
from datetime import datetime
from typing import Any, Dict, Optional
from flask import Flask
from flask.views import MethodView

from underbudget.common.decorators import use_args
from underbudget.models.account import AccountCategoryModel, AccountModel
from underbudget.models.ledger import LedgerModel
import underbudget.schemas.account as schema


account_schema = schema.AccountSchema()
category_schema = schema.AccountCategorySchema()


class AccountCategoriesView(MethodView):
    """ Account category REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("account-categories")
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/account-categories",
            defaults={"category_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/ledgers/<int:ledger_id>/account-categories",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/account-categories/<int:category_id>",
            defaults={"ledger_id": None},
            view_func=view,
            methods=["GET"],
        )
        app.add_url_rule(
            "/api/account-categories/<int:category_id>",
            view_func=view,
            methods=["PUT", "DELETE"],
        )

    @staticmethod
    def get(ledger_id: Optional[int], category_id: Optional[int]):
        """ Gets a specific category or all categories in the specified ledger """
        if category_id:
            category = AccountCategoryModel.find_by_id(category_id)
            return category_schema.dump(category) if category else ({}, 404)
        if ledger_id:
            return {
                "categories": category_schema.dump(
                    AccountCategoryModel.find_by_ledger_id(ledger_id), many=True
                )
            }
        return ({}, 404)

    @staticmethod
    @use_args(category_schema)
    def post(args: Dict[str, Any], ledger_id: int):
        """ Creates a new category """
        LedgerModel.query.get_or_404(ledger_id)
        now = datetime.now()

        new_category = AccountCategoryModel(
            ledger_id=ledger_id,
            name=args["name"],
            created=now,
            last_updated=now,
        )
        new_category.save()
        return {"id": int(new_category.id)}, 201

    @staticmethod
    @use_args(category_schema)
    def put(args: Dict[str, Any], category_id: int):
        """ Modifies a specific category """
        category = AccountCategoryModel.find_by_id(category_id)
        if category:
            category.name = args["name"]
            category.last_updated = datetime.now()
            category.save()
            return {}, 200
        return {}, 404

    @staticmethod
    def delete(category_id: int):
        """ Deletes a specific category """
        category = AccountCategoryModel.find_by_id(category_id)
        if category:
            category.delete()
            return {}, 204
        return {}, 404


class AccountsView(MethodView):
    """ Account REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("accounts")
        app.add_url_rule(
            "/api/account-categories/<int:category_id>/accounts",
            view_func=view,
            methods=["POST"],
        )
        app.add_url_rule(
            "/api/accounts/<int:account_id>",
            view_func=view,
            methods=["GET", "PUT", "DELETE"],
        )

    @staticmethod
    def get(account_id: int):
        """ Gets a specific account """
        account = AccountModel.find_by_id(account_id)
        return account_schema.dump(account) if account else ({}, 404)

    @staticmethod
    @use_args(account_schema)
    def post(args: Dict[str, Any], category_id: int):
        """ Creates a new account in the specified category """
        if not AccountCategoryModel.find_by_id(category_id):
            return {}, 404

        now = datetime.now()

        new_account = AccountModel(
            category_id=category_id,
            name=args["name"],
            institution=args["institution"],
            account_number=args["account_number"],
            archived=args["archived"],
            external_id=args["external_id"],
            created=now,
            last_updated=now,
        )
        new_account.save()
        return {"id": int(new_account.id)}, 201

    @staticmethod
    @use_args(account_schema)
    def put(args: Dict[str, Any], account_id: int):
        """ Modifies a specific account """
        account = AccountModel.find_by_id(account_id)
        if account:
            account.name = args["name"]
            account.institution = args["institution"]
            account.account_number = args["account_number"]
            account.archived = args["archived"]
            account.external_id = args["external_id"]
            account.last_updated = datetime.now()
            account.save()
            return {}, 200
        return {}, 404

    @staticmethod
    def delete(account_id: int):
        """ Deletes a specific account """
        account = AccountModel.find_by_id(account_id)
        if account:
            account.delete()
            return {}, 204
        return {}, 404
