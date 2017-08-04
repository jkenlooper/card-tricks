spec_files := $(shell find src -name '*.spec.js')
src_files := $(spec_files:%.spec.js=%)

objects := $(src_files:%=%.tmp.js)

# clear out any suffixes
.SUFFIXES:

test :  $(objects)
.PHONY : test clean

%.tmp.js : %.js %.spec.js
	@BUILD=test ./node_modules/.bin/rollup --format cjs --input $*.js --output $@ --config rollup.config.js && ./node_modules/.bin/tap $*.spec.js

clean :
	rm -rf $(objects)
