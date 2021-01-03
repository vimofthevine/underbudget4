""" Account REST resources """
from datetime import datetime
from flask_restful import Resource, fields, marshal_with, reqparse

from underbudget.common.types import not_empty
from underbudget.models.account import AccountCategoryModel, AccountModel
from underbudget.models.ledger import LedgerModel

account_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "institution": fields.String,
    "accountNumber": fields.String(attribute="account_number"),
    "archived": fields.Boolean,
    "externalId": fields.String(attribute="external_id"),
    "created": fields.DateTime(dt_format="iso8601"),
    "lastUpdated": fields.DateTime(attribute="last_updated", dt_format="iso8601"),
}

account_summary_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "archived": fields.Boolean,
}

account_category_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "accounts": fields.List(fields.Nested(account_summary_fields)),
    "created": fields.DateTime(dt_format="iso8601"),
    "lastUpdated": fields.DateTime(attribute="last_updated", dt_format="iso8601"),
}

account_parser = reqparse.RequestParser()
account_parser.add_argument(
    "name", type=not_empty, help="Name is required", required=True, nullable=False
)
account_parser.add_argument(
    "institution", type=str, default="", required=False, nullable=False
)
account_parser.add_argument(
    "accountNumber", type=str, default="", required=False, nullable=False
)
account_parser.add_argument(
    "archived", type=bool, default=False, required=False, nullable=False
)
account_parser.add_argument(
    "externalId", type=str, default="", required=False, nullable=False
)

account_category_parser = reqparse.RequestParser()
account_category_parser.add_argument(
    "name", type=not_empty, help="Name is required", required=True, nullable=False
)


class AccountCategoryListResource(Resource):
    """ Account category list resource """

    @staticmethod
    @marshal_with(account_category_fields, envelope="categories")
    def get(ledger_id):
        """ Gets account categories for the specified ledger """
        return AccountCategoryModel.find_by_ledger_id(ledger_id)

    @staticmethod
    def post(ledger_id):
        """ Creates a new account category in the specified ledger """
        if not LedgerModel.find_by_id(ledger_id):
            return None, 404

        data = account_category_parser.parse_args()
        now = datetime.now()

        new_category = AccountCategoryModel(
            ledger_id=ledger_id,
            name=data["name"],
            created=now,
            last_updated=now,
        )
        new_category.save()
        return {"id": int(new_category.id)}, 201


class AccountCategoryResource(Resource):
    """ Account category resource """

    @staticmethod
    @marshal_with(account_category_fields)
    def get(category_id):
        """ Gets a specific account category """
        category = AccountCategoryModel.find_by_id(category_id)
        return category if category else (None, 404)

    @staticmethod
    def put(category_id):
        """ Modifies a specific account category """
        data = account_category_parser.parse_args()

        category = AccountCategoryModel.find_by_id(category_id)
        if category:
            category.name = data["name"]
            category.last_updated = datetime.now()
            category.save()
            return None, 200
        return None, 404

    @staticmethod
    def delete(category_id):
        """ Deletes a specific account category """
        category = AccountCategoryModel.find_by_id(category_id)
        if category:
            category.delete()
            return None, 204
        return None, 404


class AccountListResource(Resource):
    """ Account list resource """

    @staticmethod
    def post(category_id):
        """ Creates a new account in the specified category """
        if not AccountCategoryModel.find_by_id(category_id):
            return None, 404

        data = account_parser.parse_args()
        now = datetime.now()

        new_account = AccountModel(
            category_id=category_id,
            name=data["name"],
            institution=data["institution"],
            account_number=data["accountNumber"],
            archived=data["archived"],
            external_id=data["externalId"],
            created=now,
            last_updated=now,
        )
        new_account.save()
        return {"id": int(new_account.id)}, 201


class AccountResource(Resource):
    """ Account resource """

    @staticmethod
    @marshal_with(account_fields)
    def get(account_id):
        """ Gets a specific account """
        account = AccountModel.find_by_id(account_id)
        return account if account else (None, 404)

    @staticmethod
    def put(account_id):
        """ Modifies a specific account """
        data = account_parser.parse_args()

        account = AccountModel.find_by_id(account_id)
        if account:
            account.name = data["name"]
            account.institution = data["institution"]
            account.account_number = data["accountNumber"]
            account.archived = data["archived"]
            account.external_id = data["externalId"]
            account.last_updated = datetime.now()
            account.save()
            return None, 200
        return None, 404

    @staticmethod
    def delete(account_id):
        """ Deletes a specific account """
        account = AccountModel.find_by_id(account_id)
        if account:
            account.delete()
            return None, 204
        return None, 404
