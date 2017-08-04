# Creates rolled up bundles of testing goodness.  Make it faster with --jobs.

# Find all *.spec.js files in the src directory
spec_files := $(shell find src -name '*.spec.js')

# Build the *.tmp.js filenames based on the *.spec.js filenames
src_files := $(spec_files:%.spec.js=%)
tmp_files := $(src_files:%=%.tmp.js)

objects := $(tmp_files)

# clear out any suffixes
.SUFFIXES:

.PHONY : all test clean

all : $(objects)

test :  $(tmp_files)

%.tmp.js : %.js %.spec.js
	@BUILD=test ./node_modules/.bin/rollup --format cjs --input $*.js --output $@ --config rollup.config.js && ./node_modules/.bin/tap $*.spec.js

clean :
	rm -rf $(objects)
