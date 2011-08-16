OUTPUT = ../../compiled

JS = jquery.mobile.toolkit.js
JS_THEME = theme.js
CSS = theme.css
LESS = jquery.mobile.datetimepicker.less

JSFILES = \
    js/jquery.mobile.datetimepicker.js \
    js/range.js \
    $(NULL)

JS_THEME_FILES = \
    js/theme.js \
    $(NULL)

CSSFILES = \
    theme.css \
    $(NULL)

all: init js js_theme less css
	# Done.

js: init
	# Building the Javascript file...
	@@cat ${JSFILES} >> ${OUTPUT}/${JS}

js_theme: init
	# Building the Javascript theme file...
	@@cat ${JS_THEME_FILES} >> ${OUTPUT}/${JS_THEME}

less: init
	# Compile the less file...
	@@lessc less/${LESS} > ${CSS}

css: init less
	# Building the CSS file...
	@@cat ${CSSFILES} >> ${OUTPUT}/${CSS}

init:
	# Initializing...
	@@if ! test -d ${OUTPUT}; then \
	  mkdir ${OUTPUT}; \
	fi
	@@rm -f ${CSS}
