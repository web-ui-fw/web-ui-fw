OUTPUT = ../../compiled

JS = jquery.mobile.switch.js
JS_THEME = theme.js
CSS = jquery.mobile.switch.css
CSS_THEME = theme.css

JSFILES = \
    js/jquery.mobile.switch.js \
    $(NULL)

JS_THEME_FILES = \
    js/theme.js \
    $(NULL)

CSSFILES = \
    $(NULL)

CSS_THEME_FILES = \
    css/theme.css \
    $(NULL)

all: init js js_theme css css_theme
	# Done.

js: init
	# Building the Javascript file...
	@@if test "x${JSFILES}x" != "xx"; then \
	  cat ${JSFILES} >> ${OUTPUT}/${JS}; \
	fi

js_theme: init
	# Building the Javascript theme file...
	@@if test "x${JS_THEME_FILES}x" != "xx"; then \
	  cat ${JS_THEME_FILES} >> ${OUTPUT}/${JS_THEME}; \
	fi

css: init
	# Building the CSS file...
	@@if test "x${CSSFILES}x" != "xx"; then \
	  cat ${CSSFILES} >> ${OUTPUT}/${CSS}; \
	fi

css_theme: init
	# Building the CSS theme file...
	@@if test "x${CSS_THEME_FILES}x" != "xx"; then \
	  cat ${CSS_THEME_FILES} >> ${OUTPUT}/${CSS_THEME}; \
	fi

clean:
	# Cleaning...
	@@rm -rf ${OUTPUT}/{${JS},${CSS},${JS_THEME},${CSS_THEME}

init: clean
	# Initializing...
	@@if ! test -d ${OUTPUT}; then \
	  mkdir ${OUTPUT}; \
	fi
