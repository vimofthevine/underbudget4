""" Model search filter operations """
from typing import Any, List, Optional, Union
from sqlalchemy import not_
from sqlalchemy.orm import Query
from sqlalchemy.sql.schema import Column


def filter_bool(
    query: Query,
    column: Column,
    value: bool = None,
) -> Query:
    """ Update the query to filter based on boolean value of the column """
    if value is None:
        return query
    return query.filter(column.is_(value))


def filter_comp(
    query: Query,
    column: Column,
    negate: bool = False,
    op: str = "eq",
    upper: Optional[Any] = None,
    value: Optional[Any] = None,
) -> Query:
    """ Update the query to filter based on number-like comparisons for a column """
    if value is None:
        return query

    if op == "eq":
        expr = column == value
    elif op == "lt":
        expr = column < value
    elif op == "lte":
        expr = column <= value
    elif op == "gt":
        expr = column > value
    elif op == "gte":
        expr = column >= value
    elif op == "between" and upper is not None:
        expr = column.between(value, upper)
    else:
        return query  # unknown operator

    if negate:
        expr = not_(expr)
    return query.filter(expr)


def filter_in(
    query: Query,
    column: Column,
    isNull: bool = False,
    negate: bool = False,
    values: Optional[List[Any]] = None,
) -> Query:
    """ Update the query to filter based on a set of values for a column """
    if isNull:
        return query.filter(column == None)
    if not values:
        return query
    if negate:
        return query.filter(column.notin_(tuple(values)))
    return query.filter(column.in_(tuple(values)))


def filter_str(
    query: Query,
    column: Column,
    negate: bool = False,
    op: str = "eq",
    value: Optional[str] = None,
) -> Query:
    """ Update the query to filter based on string comparisons for a column """
    if value is None:
        return query

    if op == "eq":
        expr = column == value
    elif op == "starts":
        expr = column.startswith(value)
    elif op == "ends":
        expr = column.endswith(value)
    elif op == "contains":
        expr = column.contains(value)

    if negate:
        expr = not_(expr)
    return query.filter(expr)
