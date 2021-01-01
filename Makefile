DEV_PROJECT_NAME=underbudget4-dev

.PHONY: dev-up dev-down dev-ps

dev-up:
	COMPOSE_DOCKER_CLI_BUILD=1 docker-compose -p $(DEV_PROJECT_NAME) -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -p $(DEV_PROJECT_NAME) down

dev-ps:
	docker-compose -p $(DEV_PROJECT_NAME) ps
