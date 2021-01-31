""" Customized webargs parser """
from flask import Request
from marshmallow import Schema, ValidationError
from webargs.flaskparser import FlaskParser
from werkzeug.exceptions import BadRequest


class Parser(FlaskParser):
    DEFAULT_VALIDATION_STATUS = 400


parser = Parser()


@parser.error_handler
def handle_error(error: ValidationError, *args, **kwargs):
    msg = error.messages
    if type(error.messages) is dict and "json" in error.messages:
        msg = error.messages["json"]
    raise BadRequest(msg)
