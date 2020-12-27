""" User REST resources """
from flask_restful import Resource


class UserResource(Resource):
    """ REST resource for user accounts """

    @staticmethod
    def get():
        """ Returns all users """
        return {"name": "John Doe"}
