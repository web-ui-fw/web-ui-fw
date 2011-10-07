THEMES	= 
export THEME_OUTPUT_ROOT ?= ../../build/

all: themes

themes:
	# Make themes...
	@for theme in ${THEMES}; do \
		make -C $$theme || exit $?; \
		done

clean:
	# Clean themes...
	@for theme in ${THEMES}; do \
		make -C $$theme clean; \
		done

