OUTPUT = ../../compiled

JS = jquery.mobile.switch.js
CSS = jquery.mobile.switch.css

JSFILES = \
    js/jquery.mobile.switch.js 

CSSFILES = \
    css/jquery.mobile.switch.css

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
	@@if ! test -d ${OUTPUT}; then \
	  mkdir ${OUTPUT}; \
	fi
