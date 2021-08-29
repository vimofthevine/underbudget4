""" Utilities to split query parameters into search/filter parameters """
from typing import Any, Callable, Dict


def split_bool(param: Any) -> Dict[str, Any]:
    """ Split query parameter into filter-bool parameters """
    if not param:
        return {}
    if type(param) == bool:
        return dict(value=param)
    value = param.lower() in ["true", "yes", "on", "1"]
    return dict(value=value)


def split_comp(param: Any, convert: Callable[[str], Any] = str) -> Dict[str, Any]:
    """ Split query parameter into filter-comp parameters """
    if not param:
        return {}
    if type(param) != str:
        return dict(value=param)
    if ":" not in param:
        return dict(value=convert(param))

    # param = (not:)(op:)value(:upper)
    parts = param.split(":")
    count = len(parts)
    negate = parts[0] == "not"

    if count >= 4:
        return dict(
            negate=negate, op=parts[1], value=convert(parts[2]), upper=convert(parts[3])
        )
    elif count == 3:
        if negate:
            return dict(negate=negate, op=parts[1], value=convert(parts[2]))
        return dict(op=parts[0], value=convert(parts[1]), upper=convert(parts[2]))
    # else count == 2 (and can't be 1)
    elif negate:
        return dict(negate=negate, value=convert(parts[1]))
    return dict(op=parts[0], value=convert(parts[1]))


def split_in(param: Any, convert: Callable[[str], Any] = str) -> Dict[str, Any]:
    """ Split query parameter into filter-in parameters """
    if not param:
        return {}
    if type(param) != str:
        return dict(values=[param])
    if param == "is:null":
        return dict(isNull=True)
    if ":" not in param:
        return dict(values=list(map(convert, param.split(","))))
    parts = param.split(":")
    return dict(
        negate=(parts[0] == "not"), values=list(map(convert, parts[1].split(",")))
    )


def split_str(param: Any) -> Dict[str, Any]:
    """ Split query parameter into filter-str parameters """
    if not param or type(param) != str:
        return {}
    if ":" not in param:
        return dict(value=param)

    # param = (not:)(op:)value
    parts = param.split(":")
    count = len(parts)
    negate = parts[0] == "not"

    if count >= 3:
        return dict(negate=negate, op=parts[1], value=parts[2])
    # else count == 2 (and can't be 1)
    elif negate:
        return dict(negate=negate, value=parts[1])
    return dict(op=parts[0], value=parts[1])
