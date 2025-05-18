install:
	npm ci

lint:
	npx eslint .

publish:
	nmp publish --dry-run

develop: 
    npx webpack serve

build:
	NODE_ENV=production npx webpack