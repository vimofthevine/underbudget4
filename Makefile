DEV_PROJECT_NAME=underbudget4-dev
TEST_ARGS=

.PHONY: dev-up dev-build dev-down dev-ps api-test

dev-up:
	COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml up -d

dev-build:
	COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml build

dev-down:
	docker-compose -p $(DEV_PROJECT_NAME) down

dev-ps:
	docker-compose -p $(DEV_PROJECT_NAME) ps

api-test:
	docker exec underbudget-dev-api pytest $(TEST_ARGS)
