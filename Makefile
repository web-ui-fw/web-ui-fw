DEBUG = yes

OUTPUT_ROOT = build
CODE_DIR = src/widgets
LIBS_DIR = libs

FW_IMAGES_DIR = ${OUTPUT_ROOT}/web-ui-fw/css/images

LIBS_JS = ${OUTPUT_ROOT}/libs/js/web-ui-fw-libs.js
LIBS_CSS= ${OUTPUT_ROOT}/libs/css/web-ui-fw-libs.css

WEB_UI_FW_JS = ${OUTPUT_ROOT}/web-ui-fw/js/web-ui-fw.js
WEB_UI_FW_JS_THEME = ${OUTPUT_ROOT}/web-ui-fw/js/web-ui-fw-default-theme.js
WEB_UI_FW_CSS = ${OUTPUT_ROOT}/web-ui-fw/css/web-ui-fw-default-theme.css

LIBS_JS_FILES =

ifeq (${DEBUG},yes)
LIBS_JS_FILES +=\
    jquery-1.6.2.js \
    jquery.mobile-1.0b2.js \
    $(NULL)
else
LIBS_JS_FILES +=\
    jquery-1.6.2.min.js \
    jquery.mobile-1.0b2.js \
    $(NULL)
endif

LIBS_CSS_FILES =

ifeq (${DEBUG},yes)
LIBS_CSS_FILES +=\
    jquery.mobile-1.0b2.css \
    $(NULL)
else
LIBS_CSS_FILES +=
    jquery.mobile-1.0b2.min.css \
    $(NULL)
endif


all: third_party widgets

third_party: init
	# Building third party components...
	@@cd $(CURDIR)/${LIBS_DIR}/js; \
	    for f in ${LIBS_JS_FILES}; do \
	        cat $$f >> $(CURDIR)/${LIBS_JS}; \
	    done
	@@cd $(CURDIR)/${LIBS_DIR}/css; \
	    for f in ${LIBS_CSS_FILES}; do \
	        cat $$f >> $(CURDIR)/${LIBS_CSS}; \
	    done; \
	    cp -r images $(CURDIR)/${OUTPUT_ROOT}/libs/css

widgets: init
	# Building widgets...
	@@ls -l ${CODE_DIR} | grep '^d' | awk '{print $$NF;}' | \
	    while read REPLY; do \
	        echo "	# Building widget $$REPLY"; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.js'`; do \
	            echo "		$$f"; \
	            cat $$f >> ${WEB_UI_FW_JS}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.js.theme'`; do \
	            echo "		$$f"; \
	            cat $$f >> ${WEB_UI_FW_JS_THEME}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.less'`; do \
	            echo "		$$f"; \
	            lessc $$f > $$f.css; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.css'`; do \
	            echo "		$$f"; \
	            cat $$f >> ${WEB_UI_FW_CSS}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.gif' -or -iname '*.png' -or -iname '*.jpg'`; do \
	            echo "		$$f"; \
	            cp $$f ${FW_IMAGES_DIR}; \
	        done; \
	    done

clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`

init: clean
	@@mkdir -p ${OUTPUT_ROOT}/libs/js
	@@mkdir -p ${OUTPUT_ROOT}/libs/css
	@@mkdir -p ${OUTPUT_ROOT}/web-ui-fw/js
	@@mkdir -p ${OUTPUT_ROOT}/web-ui-fw/css/images
