default: dev

bash:
	docker-compose run --rm app bash

build:
	npm run build

dev:
	npm run dev

install:
	npm install

list-deps:
	npm ls --package-lock-only --json | jq ".dependencies | map_values(.version)" > installed-versions.json

update:
	npm update
	make list-deps
