""" Application health view """
from flask import Flask
from flask.views import MethodView
from sqlalchemy.exc import SQLAlchemyError

from underbudget.database import db


class HealthView(MethodView):
    """ Application health view """

    @classmethod
    def register(cls, app: Flask):
        """ Register routes for this view """
        view = cls.as_view("health")
        app.add_url_rule("/health", view_func=view, methods=["GET"])

    @staticmethod
    def get():
        """ Performs health checks and reports the health status of the app """
        try:
            db.session.execute("SELECT 1")
            return {"msg": "Ready"}, 200
        except SQLAlchemyError:
            return {"msg": "Database error"}, 503
