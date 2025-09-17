default: dev

bash:
	docker compose run --rm app bash

build:
	docker compose run --rm app bash -c "npm run build"

clean:
	docker compose kill
	docker compose rm

dev:
	docker compose up -d app

install:
	docker compose run --rm app bash -c "npm install"

list-deps:
	docker compose run --rm app bash -c "npm ls --package-lock-only --json | jq \".dependencies | map_values(.version)\" > installed-versions.json"

logs:
	docker compose logs -f

test:
	#docker compose run --rm app bash -c "npm run test:ui"
	npm run test:ui

update:
	docker compose run --rm app bash -c "npm update"
	make list-deps
