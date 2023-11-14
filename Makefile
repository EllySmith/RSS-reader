develop:
	npx webpack serve

install:
	npm install

start:
	npm webpack serve	

build: 
	npm run build

test:
	npm test

lint:
	npx eslint 

test--coverage:
	npm test -- ---coverage --coverageProvider=v8

	