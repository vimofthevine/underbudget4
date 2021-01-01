""" Argument types """


def min_int(min_val):
    def validate(val):
        val = int(val)
        if val < min_val:
            raise ValidationError
        return val
    return validate


def max_int(max_val):
    def validate(val):
        val = int(val)
        if val > max_val:
            raise ValidationError
        return val
    return validate


def not_empty(val):
    if not val:
        raise ValidationError
    return val
