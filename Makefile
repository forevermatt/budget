default: dev

bash:
	docker-compose run --rm app bash

build:
	npm run build

dev:
	npm run dev

install:
	npm install

update:
	npm update
