OUTPUT = ../../compiled

JS = jquery.mobile.datetimepicker.js
CSS = jquery.mobile.datetimepicker.css
LESS = jquery.mobile.datetimepicker.less

JSFILES = \
    js/jquery.mobile.datetimepicker.js \
    js/jquery.mobile.scrollview.js \
    js/jquery.easing.1.3.js


CSSFILES = \
    css/jquery.mobile.datetimepicker.css \
    css/jquery.mobile.scrollview.css

all: init js less css
	# Done.

js: init
	# Building the Javascript file...
	@@cat ${JSFILES} >> ${OUTPUT}/${JS}

less: init
	# Compile the less file...
	@@lessc less/${LESS} > css/${CSS}

css: init less
	# Building the CSS file...
	@@cat ${CSSFILES} >> ${OUTPUT}/${CSS}

clean:
	# Cleaning...
	@@rm -rf ${OUTPUT}/*

init: clean
	# Initializing...
	@@if ! test -d ${OUTPUT}; then \
	  mkdir ${OUTPUT}; \
	fi
