DEBUG = yes
PROJECT_NAME = web-ui-fw
VERSION = 0.1
VERSION_COMPAT =

INLINE_PROTO = 1
OUTPUT_ROOT = $(CURDIR)/build
FRAMEWORK_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}

JS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/js
THEMES_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes
PROTOTYPE_HTML_OUTPUT_DIR = ${FRAMEWORK_ROOT}/proto-html

WIDGETS_DIR = $(CURDIR)/src/widgets
THEMES_DIR = $(CURDIR)/src/themes
LIBS_DIR = $(CURDIR)/libs

DESTDIR ?=
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

FW_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}.js
FW_LIBS_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-libs.js
FW_THEME_CSS_FILE = web-ui-fw-theme.css

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

all: third_party_widgets widgets widget_styling third_party_themes themes

third_party_widgets: init
	# Building third party components...
	@@cd ${LIBS_DIR}/js; \
	    for f in ${LIBS_JS_FILES}; do \
	        cat $$f >> ${FW_LIBS_JS}; \
	    done
	    cp ${LIBS_DIR}/js/${JQUERY} ${JS_OUTPUT_ROOT}/jquery.js

widgets: init
	# Building web-ui-fw widgets...
	@@ls -l ${WIDGETS_DIR} | grep '^d' | awk '{print $$NF;}' | \
	    while read REPLY; do \
	        echo "	# Building widget $$REPLY"; \
          if test "x${INLINE_PROTO}x" = "x1x"; then \
              ./tools/inline-protos.sh ${WIDGETS_DIR}/$$REPLY >> ${WIDGETS_DIR}/$$REPLY/js/$$REPLY.js.compiled; \
              cat ${WIDGETS_DIR}/$$REPLY/js/$$REPLY.js.compiled >> ${FW_JS}; \
          else \
              for f in `find ${WIDGETS_DIR}/$$REPLY -iname 'js/*.js' | sort`; do \
                  echo "		$$f"; \
                  cat $$f >> ${FW_JS}; \
              done; \
          fi; \
          if test "x${INLINE_PROTO}x" != "x1x"; then \
              for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.prototype.html' | sort`; do \
                  echo "		$$f"; \
                  cp $$f ${PROTOTYPE_HTML_OUTPUT_DIR}; \
              done; \
          fi; \
	    done

widget_styling: init
	# Building non-theme-specific styling for web-ui-fw widgets...

third_party_themes: widget_styling
	# Building jqm themes...
	@@cd ${LIBS_DIR}/themes; \
	for f in `find ${LIBS_DIR}/themes -maxdepth 1 -mindepth 1 -type d`; do \
	    outdir=${THEMES_OUTPUT_ROOT}/`basename $$f`; \
	    mkdir -p $$outdir/images; \
	    cp -a $$f/images/* $$outdir/images/; \
	    touch $$outdir/${FW_THEME_CSS_FILE}; \
	    for c in `find $$f -iname *.css` ; do \
          cat $$c >> $$outdir/${FW_THEME_CSS_FILE}; \
	    done; \
	done

themes: widget_styling
	# Building web-ui-fw themes...
	@@cd ${THEMES_DIR}; \
	for f in `find ${THEMES_DIR} -maxdepth 1 -mindepth 1 -type d`; do \
	    outdir=${THEMES_OUTPUT_ROOT}/`basename $$f`; \
	    mkdir -p $$outdir/images; \
	    cp -a $$f/images/* $$outdir/images/; \
	    touch $$outdir/${FW_THEME_CSS_FILE}; \
	    for l in `find $$f -iname *.less` ; do \
	        lessc $$l >> $$l.css; \
	    done; \
	    for c in `find $$f -iname *.css` ; do \
          cat $$c >> $$outdir/${FW_THEME_CSS_FILE}; \
	    done; \
	done

version_compat: third_party_widgets widgets
	# Creating compatible version dirs...
	for v_compat in ${VERSION_COMPAT}; do \
		ln -sf ${VERSION} ${FRAMEWORK_ROOT}/../$$v_compat; \
	done;

demos: all
  # Building demo...
	mkdir -p ${OUTPUT_ROOT}/demos
	cp -av demos/* ${OUTPUT_ROOT}/demos/
	@@rm -f `find ${OUTPUT_ROOT}/demos/ -iname bootstrap.js`
	cp -f src/template/bootstrap.js ${OUTPUT_ROOT}/demos/gallery/

install: all
	mkdir -p ${INSTALL_DIR}/share/slp-web-fw ${INSTALL_DIR}/bin
	cp -av ${OUTPUT_ROOT}/* src/template ${INSTALL_DIR}/share/slp-web-fw/
	cp -av tools/* ${INSTALL_DIR}/bin

clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`
	@@rm -f `find . -iname *.js.compiled`

init: clean
	# Initializing...
	@@mkdir -p ${JS_OUTPUT_ROOT}
	@@mkdir -p ${THEMES_OUTPUT_ROOT}
	@@mkdir -p ${PROTOTYPE_HTML_OUTPUT_DIR}
