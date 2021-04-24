""" Balance REST view """
from datetime import date
from typing import Any, Dict
from flask import Flask
from flask.views import MethodView

from underbudget.common.decorators import use_args
from underbudget.models.account import AccountModel
from underbudget.models.balance import AccountBalanceModel
from underbudget.schemas.balance import BalanceQuerySchema


balance_query_schema = BalanceQuerySchema()


class AccountBalancesView(MethodView):
    """ Account balance REST resource view """

    @classmethod
    def register(cls, app: Flask):
        """ Registers routes for this view """
        view = cls.as_view("account-balances")
        app.add_url_rule(
            "/api/accounts/<int:account_id>/balance",
            view_func=view,
            methods=["GET"],
        )

    @staticmethod
    @use_args(balance_query_schema, location="query")
    def get(args: Dict[str, Any], account_id: int):
        """ Gets balance for an account """
        AccountModel.query.get_or_404(account_id)
        request_date = args.get("date", date.today())
        return {"balance": AccountBalanceModel.get_balance(account_id, request_date)}
