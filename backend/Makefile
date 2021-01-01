.PHONY: black pylint mypy style pip-freeze run

black:
	black --check underbudget/

pylint:
	pylint underbudget/

mypy:
	mypy --disallow-untyped-defs underbudget/

style: pylint mypy black

pip-freeze:
	pip freeze | grep -v git > requirements.txt

run:
	FLASK_APP=underbudget.app FLASK_ENV=development flask run
