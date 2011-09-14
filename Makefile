DEBUG = yes
PROJECT_NAME = web-ui-fw
VERSION = 0.1
THEME_NAME = default

OUTPUT_ROOT = build
FRAMEWORK_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}
JS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/js
CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/css
CSS_IMAGES_OUTPUT_DIR = ${CSS_OUTPUT_ROOT}/images
PROTOTYPE_HTML_OUTPUT_DIR = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}/proto-html/${THEME_NAME}

CODE_DIR = src/widgets
LIBS_DIR = libs

FW_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}.js
FW_JS_THEME = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-${THEME_NAME}-theme.js
FW_CSS = ${CSS_OUTPUT_ROOT}/${PROJECT_NAME}-${THEME_NAME}-theme.css
FW_LIBS_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-libs.js

LIBS_JS_FILES = underscore.js
ifeq (${DEBUG},yes)
LIBS_JS_FILES +=\
    jquery-1.6.2.js \
    jquery.mobile-1.0b2.js \
    jquery.ui.position.git+dfe75e1.js \
    $(NULL)
else
LIBS_JS_FILES +=\
    jquery-1.6.2.min.js \
    jquery.mobile-1.0b2.min.js \
    jquery.ui.position.git+dfe75e1.min.js \
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
	        cat $$f >> $(CURDIR)/${FW_LIBS_JS}; \
	    done
	@@cd $(CURDIR)/${LIBS_DIR}/css; \
	    for f in ${LIBS_CSS_FILES}; do \
	        cat $$f >> $(CURDIR)/${FW_CSS}; \
	    done; \
	    cp -r images/* $(CURDIR)/${CSS_IMAGES_OUTPUT_DIR}

	@@cp -a $(CURDIR)/${LIBS_DIR}/images $(CURDIR)/${FRAMEWORK_ROOT}/

widgets: init
	# Building widgets...
	@@ls -l ${CODE_DIR} | grep '^d' | awk '{print $$NF;}' | \
	    while read REPLY; do \
	        echo "	# Building widget $$REPLY"; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.js'`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_JS}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.js.theme'`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_JS_THEME}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.less'`; do \
	            echo "		$$f"; \
	            lessc $$f > $$f.css; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.css'`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_CSS}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.gif' -or -iname '*.png' -or -iname '*.jpg'`; do \
	            echo "		$$f"; \
	            cp $$f ${CSS_IMAGES_OUTPUT_DIR}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.prototype.html'`; do \
	            echo "		$$f"; \
	            cp $$f ${PROTOTYPE_HTML_OUTPUT_DIR}; \
	        done; \
	    done

clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`

init: clean
	# Initializing...
	@@mkdir -p ${JS_OUTPUT_ROOT}
	@@mkdir -p ${CSS_OUTPUT_ROOT}
	@@mkdir -p ${CSS_IMAGES_OUTPUT_DIR}
	@@mkdir -p ${PROTOTYPE_HTML_OUTPUT_DIR}
