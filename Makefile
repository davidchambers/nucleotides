ESLINT = node_modules/.bin/eslint --env node --env browser
MOCHA = node_modules/.bin/mocha --ui tdd
XYZ = node_modules/.bin/xyz --repo git@github.com:davidchambers/nucleotides.git


.PHONY: build
build:


.PHONY: lint
lint:
	$(ESLINT) -- nucleotides.js $(shell find scripts -type f)
	$(ESLINT) --env mocha -- $(shell find test -name '*.js')


.PHONY: release-major release-minor release-patch
release-major: LEVEL = major
release-minor: LEVEL = minor
release-patch: LEVEL = patch

release-major release-minor release-patch:
	@$(XYZ) --increment $(LEVEL)


.PHONY: setup
setup:
	npm install


.PHONY: test
test:
	$(MOCHA)
