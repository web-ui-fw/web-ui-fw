DEBUG = yes
PROJECT_NAME = web-ui-fw
VERSION = 0.1
THEME_NAME = default

INLINE_PROTO = 1
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
    jquery.mobile-1.0rc1.js \
    jquery.ui.position.git+dfe75e1.js \
    $(NULL)
JQUERY = jquery-1.6.4.js
else
LIBS_JS_FILES +=\
    jquery.mobile-1.0rc1.min.js \
    jquery.ui.position.git+dfe75e1.min.js \
    $(NULL)
JQUERY = jquery-1.6.4.min.js
endif

LIBS_CSS_FILES =
ifeq (${DEBUG},yes)
LIBS_CSS_FILES +=\
    jquery.mobile-1.0rc1.css \
    $(NULL)
else
LIBS_CSS_FILES +=\
    jquery.mobile-1.0rc1.min.css \
    $(NULL)
endif

all: third_party widgets

third_party: init
	# Building third party components...
	@@cd $(CURDIR)/${LIBS_DIR}/js; \
	    for f in ${LIBS_JS_FILES}; do \
	        cat $$f >> $(CURDIR)/${FW_LIBS_JS}; \
	    done
	    cp $(CURDIR)/${LIBS_DIR}/js/${JQUERY} $(CURDIR)/${JS_OUTPUT_ROOT}/jquery.js
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
                if test "x${INLINE_PROTO}x" = "x1x"; then \
                  ./tools/inline-protos.sh ${CODE_DIR}/$$REPLY >> ${CODE_DIR}/$$REPLY/js/$$REPLY.js.compiled; \
                  cat ${CODE_DIR}/$$REPLY/js/$$REPLY.js.compiled >> ${FW_JS}; \
                else \
	          for f in `find ${CODE_DIR}/$$REPLY -iname 'js/*.js' | sort`; do \
	              echo "		$$f"; \
	              cat $$f >> ${FW_JS}; \
	          done; \
                fi; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.js.theme' | sort`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_JS_THEME}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.less' | sort`; do \
	            echo "		$$f"; \
	            lessc $$f > $$f.css; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.css' | sort`; do \
	            echo "		$$f"; \
	            cat $$f >> ${FW_CSS}; \
	        done; \
	        for f in `find ${CODE_DIR}/$$REPLY -iname '*.gif' -or -iname '*.png' -or -iname '*.jpg' | sort`; do \
	            echo "		$$f"; \
	            cp $$f ${CSS_IMAGES_OUTPUT_DIR}; \
	        done; \
                if test "x${INLINE_PROTO}x" != "x1x"; then \
	          for f in `find ${CODE_DIR}/$$REPLY -iname '*.prototype.html' | sort`; do \
	              echo "		$$f"; \
	              cp $$f ${PROTOTYPE_HTML_OUTPUT_DIR}; \
	          done; \
                fi; \
	    done

clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`
	@@rm -f `find . -iname *.js.compiled`

init: clean
	# Initializing...
	@@mkdir -p ${JS_OUTPUT_ROOT}
	@@mkdir -p ${CSS_OUTPUT_ROOT}
	@@mkdir -p ${CSS_IMAGES_OUTPUT_DIR}
	@@mkdir -p ${PROTOTYPE_HTML_OUTPUT_DIR}
