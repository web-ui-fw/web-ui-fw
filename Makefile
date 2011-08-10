OUTPUT = compiled
JS = jquery.mobile.datetimepicker.js

JSFILES = js/jquery.mobile.datetimepicker.js

all: init js
	# Done.

js: init
	# Building the Javascript file...
	@@cat ${JSFILES} >> ${OUTPUT}/${JS}

init:
	# Preparing...
	@@rm -rf ${OUTPUT}
	@@mkdir ${OUTPUT}
