""" Custom decorators """
import functools
from flask import request

from underbudget.common.parser import parser


use_args = parser.use_args


def with_pagination(func):
    """ Adds page and size arguments from request args to the decorated function """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        kwargs["page"] = request.args.get("page", 1, type=int)
        kwargs["size"] = request.args.get("size", 10, type=int)
        return func(*args, **kwargs)

    return wrapper
