OUTPUT = ../../compiled

JS = $(NULL)
CSS = $(NULL)
LESS = $(NULL)

JSFILES = \
    $(NULL)

CSSFILES = \
    $(NULL)

all: init js less css
	# Done.

js: init
	# Building the Javascript file...
	if test "x${JS}x" != "xx"; then \
	@@cat ${JSFILES} >> ${OUTPUT}/${JS}; \
        fi

less: init
	# Compile the less file...
	if test "x${CSS}x" != "xx"; then \
	@@lessc less/${LESS} > css/${CSS}; \
	fi

css: init less
	# Building the CSS file...
	if test "x${CSS}x" != "xx"; then \
	@@cat ${CSSFILES} >> ${OUTPUT}/${CSS}; \
	fi

init:
	# Initializing...
	if ! test -d ${OUTPUT}; then \
	@@mkdir ${OUTPUT}; \
	fi

clean:
	@@true
