default: dev

bash:
	docker compose run --rm app bash

build:
	docker compose run --rm app bash -c "npm run build"

dev:
	docker compose up -d app

install:
	docker compose run --rm app bash -c "npm install"

list-deps:
	docker compose run --rm app bash -c "npm ls --package-lock-only --json | jq \".dependencies | map_values(.version)\" > installed-versions.json"

update:
	docker compose run --rm app bash -c "npm update"
	make list-deps
