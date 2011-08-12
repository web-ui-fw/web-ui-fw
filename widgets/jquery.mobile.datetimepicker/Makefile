OUTPUT = ../../compiled

JS = jquery.mobile.datetimepicker.js
CSS = jquery.mobile.datetimepicker.css

JSFILES = \
    js/jquery.mobile.datetimepicker.js \
    js/jquery.mobile.scrollview.js \
    js/jquery.easing.1.3.js

CSSFILES = \
    css/jquery.mobile.datetimepicker.css \
    css/jquery.mobile.scrollview.css

all: init js css
	# Done.

js: init
	# Building the Javascript file...
	@@cat ${JSFILES} >> ${OUTPUT}/${JS}

css: init
	# Building the CSS file...
	@@cat ${CSSFILES} >> ${OUTPUT}/${CSS}

clean:
	# Cleaning...
	@@rm -rf ${OUTPUT}/{${JS},${CSS}}

init: clean
	# Initializing...
	@@mkdir ${OUTPUT}
