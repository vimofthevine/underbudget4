""" Model search filter operations """
from typing import Any, List, Optional
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


# pylint: disable=too-many-arguments
def filter_comp(
    query: Query,
    column: Column,
    negate: bool = False,
    oper: str = "eq",
    upper: Optional[Any] = None,
    value: Optional[Any] = None,
) -> Query:
    """ Update the query to filter based on number-like comparisons for a column """
    if value is None:
        return query

    if oper == "eq":
        expr = column == value
    elif oper == "lt":
        expr = column < value
    elif oper == "lte":
        expr = column <= value
    elif oper == "gt":
        expr = column > value
    elif oper == "gte":
        expr = column >= value
    elif oper == "between" and upper is not None:
        expr = column.between(value, upper)
    else:
        return query  # unknown operator

    if negate:
        expr = not_(expr)
    return query.filter(expr)


def filter_in(
    query: Query,
    column: Column,
    is_null: bool = False,
    negate: bool = False,
    values: Optional[List[Any]] = None,
) -> Query:
    """ Update the query to filter based on a set of values for a column """
    if is_null:
        # pylint: disable=singleton-comparison
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
    oper: str = "eq",
    value: Optional[str] = None,
) -> Query:
    """ Update the query to filter based on string comparisons for a column """
    if value is None:
        return query

    if oper == "eq":
        expr = column == value
    elif oper == "starts":
        expr = column.startswith(value)
    elif oper == "ends":
        expr = column.endswith(value)
    elif oper == "contains":
        expr = column.contains(value)

    if negate:
        expr = not_(expr)
    return query.filter(expr)
