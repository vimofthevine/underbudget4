TAG=latest

.PHONY: black pylint mypy style image run start stop

black:
	black --check underbudget/

pylint:
	pylint underbudget/

mypy:
	mypy --disallow-untyped-defs underbudget/

style: pylint mypy black

image:
	DOCKER_BUILDKIT=1 docker build -t vimofthevine/underbudget-api:$(TAG) .

run:
	FLASK_APP=underbudget FLASK_ENV=development flask run

start:
	docker run --rm -d -p 5000:80 --name underbudget-api vimofthevine/underbudget-api:$(TAG)

stop:
	docker stop underbudget-api
