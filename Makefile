DEV_PROJECT_NAME=underbudget4-dev
TEST_ARGS=

.PHONY: dev-up dev-build dev-down dev-ps api-test

dev-up:
	COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml up -d

dev-build:
	COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml build

dev-down:
	docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml down

dev-ps:
	docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml ps

dev-db-upgrade:
	docker exec underbudget-dev-api flask db upgrade

dev-db-rebuild:
	docker exec underbudget-dev-db psql -U postgres -c \
		'DROP SCHEMA "public" CASCADE; CREATE SCHEMA "public"; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;'
	docker exec underbudget-dev-api flask db upgrade

dev-db-migrate:
	docker exec underbudget-dev-api flask db migrate -m "$(MSG)"

api-test:
	docker exec underbudget-dev-api pytest $(TEST_ARGS)
