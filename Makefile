DEBUG ?= yes
PROJECT_NAME = web-ui-fw
VERSION = 0.1.3
VERSION_COMPAT =

INLINE_PROTO = 1
OUTPUT_ROOT = $(CURDIR)/build
FRAMEWORK_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/${VERSION}
LATEST_ROOT = ${OUTPUT_ROOT}/${PROJECT_NAME}/latest

JS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/js
THEMES_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/themes
WIDGET_CSS_OUTPUT_ROOT = ${FRAMEWORK_ROOT}/widget-css
PROTOTYPE_HTML_OUTPUT_DIR = proto-html

WIDGETS_DIR = $(CURDIR)/src/widgets
THEMES_DIR = $(CURDIR)/src/themes
LIBS_DIR = $(CURDIR)/libs

DESTDIR ?=
PREFIX ?= /usr
INSTALL_DIR = ${DESTDIR}${PREFIX}

FW_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}.js
FW_LIBS_JS = ${JS_OUTPUT_ROOT}/${PROJECT_NAME}-libs.js
FW_THEME_CSS_FILE = ${PROJECT_NAME}-theme.css
FW_WIDGET_CSS_FILE = ${WIDGET_CSS_OUTPUT_ROOT}/${PROJECT_NAME}-widget.css

LIBS_JS_FILES = jlayout/jquery.sizes.js \
                jlayout/jlayout.border.js \
                jlayout/jlayout.grid.js \
                jlayout/jlayout.flexgrid.js \
                jlayout/jlayout.flow.js \
                jlayout/jquery.jlayout.js \
                $(NULL)
JQUERY = submodules/jquery-mobile/js/jquery.js
JQUERY_MOBILE = submodules/jquery-mobile/compiled/jquery.mobile.js
JQUERY_MOBILE_CSS = submodules/jquery-mobile/compiled/jquery.mobile.structure.css \
                    submodules/jquery-mobile/compiled/jquery.mobile.css \
                    $(NULL)
JQUERY_MOBILE_IMAGES = submodules/jquery-mobile/css/themes/default/images

all: third_party_widgets widgets widget_styling themes

widget_styling: init
	# Building non-theme-specific styling for web-ui-fw widgets...
	@@for w in `find ${WIDGETS_DIR} -maxdepth 1 -mindepth 1 -type d`; do \
	    for l in `find $$w -iname *.less`; do \
					echo "	# Compiling CSS from "`basename $$l`; \
	        lessc $$l >> $$l.css; \
	    done; \
	    touch ${FW_WIDGET_CSS_FILE}; \
	    for c in `find $$w -iname *.css`; do \
	        cat $$c >> ${FW_WIDGET_CSS_FILE}; \
	    done; \
	done

third_party_widgets: init
	# Building third party components...
	@@uglify=cat; \
	if test "x${DEBUG}x" = "xnox" && hash uglifyjs 2>&-; then \
		echo "	# uglifyjs enabled"; \
		uglify="uglifyjs -nc"; \
	fi; \
	cd ${LIBS_DIR}/js; \
	for f in ${LIBS_JS_FILES}; do \
		cat $$f | $${uglify} >> ${FW_LIBS_JS}; \
	done; \
	cat ${LIBS_DIR}/js/${JQUERY} | $${uglify} >> ${JS_OUTPUT_ROOT}/jquery.js ; \
	cat ${LIBS_DIR}/js/${JQUERY_MOBILE} | $${uglify} >> ${JS_OUTPUT_ROOT}/jquery-mobile.js

widgets: init
	# Building web-ui-fw widgets...
	@@uglify=cat; \
	if test "x${DEBUG}x" = "xnox" && hash uglifyjs 2>&-; then \
		echo "	# uglifyjs enabled"; \
		uglify="uglifyjs -nc"; \
	fi; \
	ls -l ${WIDGETS_DIR} | grep '^d' | awk '{print $$NF;}' | \
	while read REPLY; do \
		echo "	# Building widget $$REPLY"; \
		if test "x${INLINE_PROTO}x" = "x1x"; then \
			./tools/inline-protos.sh ${WIDGETS_DIR}/$$REPLY >> ${WIDGETS_DIR}/$$REPLY/js/$$REPLY.js.compiled; \
			cat ${WIDGETS_DIR}/$$REPLY/js/$$REPLY.js.compiled | $${uglify} >> ${FW_JS}; \
		else \
			for f in `find ${WIDGETS_DIR}/$$REPLY/js -iname '*.js' | sort`; do \
				echo "		$$f"; \
				cat $$f | $${uglify} >> ${FW_JS}; \
			done; \
		fi; \
	done

docs: init
	# Building documentation...
	@@hash docco 2>&1 /dev/null || (echo "docco not found. Please see README."; exit 1); \
	ls -l ${WIDGETS_DIR} | grep '^d' | awk '{print $$NF;}' | \
	while read REPLY; do \
		echo "	# Building docs for widget $$REPLY"; \
		for f in `find ${WIDGETS_DIR}/$$REPLY -iname '*.js' | sort`; do \
			docco $$f > /dev/null; \
		done; \
	done; \
	cp docs/docco.custom.css docs/docco.css; \
	cat docs/index.header > docs/index.html; \
	for f in `find docs -name '*.html' -not -name index.html | sort`; do \
		echo "<li><a href=\"$$(basename $$f)\">$$(basename $$f .html)</a></li>" >> docs/index.html; \
	done; \
	cat docs/index.footer >> docs/index.html

themes: widget_styling jqm_theme
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
	    cp -a ${FW_WIDGET_CSS_FILE} $$outdir/ ; \
            if test "x${INLINE_PROTO}x" != "x1x"; then \
	        mkdir -p $$outdir/${PROTOTYPE_HTML_OUTPUT_DIR}; \
	        for f in `find ${WIDGETS_DIR} -iname '*.prototype.html' | sort`; do \
	            cp $$f $$outdir/${PROTOTYPE_HTML_OUTPUT_DIR}; \
	        done; \
            fi; \
	done

jqm_theme: init
	# Adding images to jqm theme...
	@@mkdir -p ${THEMES_OUTPUT_ROOT}/default/images
	@@cp -a ${LIBS_DIR}/js/${JQUERY_MOBILE_IMAGES}/* ${THEMES_OUTPUT_ROOT}/default/images
	# Adding CSS to jqm theme...
	@@for f in ${JQUERY_MOBILE_CSS}; do \
		cat ${LIBS_DIR}/js/$$f >> ${THEMES_OUTPUT_ROOT}/default/${FW_THEME_CSS_FILE}; \
	done;

version_compat: third_party_widgets widgets
	# Creating compatible version dirs...
	for v_compat in ${VERSION_COMPAT}; do \
		ln -sf ${VERSION} ${FRAMEWORK_ROOT}/../$$v_compat; \
	done;

install: all
	# Nothing to install, but left here to support Debian packaging
	mkdir -p ${INSTALL_DIR}/share/slp-web-fw ${INSTALL_DIR}/bin
	cp -av tools/* ${INSTALL_DIR}/bin

coverage: clean all
	# Checking unit test coverage
	$(CURDIR)/tests/coverage/instrument.sh

dist: clean all docs
	# Creating tarball...
	@@ \
	TMPDIR=$$(mktemp -d tarball.XXXXXXXX); \
	DESTDIR=$${TMPDIR}/${PROJECT_NAME}; \
	MIN=''; \
	if test "x${DEBUG}x" = "xnox"; then \
		MIN='.min'; \
	fi; \
	TARBALL=${PROJECT_NAME}-${VERSION}-`date +%Y%m%d`$${MIN}.tar.gz; \
	mkdir -p $${DESTDIR}; \
	cp -a ${FW_JS} \
		${FW_LIBS_JS} \
		${THEMES_OUTPUT_ROOT}/tizen/${FW_THEME_CSS_FILE} \
		${FW_WIDGET_CSS_FILE} \
		${THEMES_OUTPUT_ROOT}/tizen/images \
		docs \
		README.md \
		COPYING \
		$${DESTDIR}; \
	hash git 2>&1 /dev/null && touch $${DESTDIR}/$$(git log | head -n 1 | awk '{print $$2;}'); \
	tar cfzps \
		$${TARBALL} \
		--exclude='.git' \
		--exclude='*.less.css' \
		--exclude='*.js.compiled' \
		--exclude='submodules/jquery-mobile' \
		--exclude='${JQUERY}' \
		-C $${TMPDIR} ${PROJECT_NAME}; \
	rm -rf $${TMPDIR}

clean:
	# Removing destination directory...
	@@rm -rf ${OUTPUT_ROOT}
	# Remove generated files...
	@@rm -f `find . -iname *.less.css`
	@@rm -f `find . -iname *.js.compiled`
	@@rm -f docs/*.html

init:
	# Checking for JQM
	@@[ -e ${LIBS_DIR}/js/${JQUERY_MOBILE} ] || (echo "You must compile jquery-mobile first. See HACKING."; exit 1;)
	# Initializing...
	@@mkdir -p ${JS_OUTPUT_ROOT}
	@@mkdir -p ${THEMES_OUTPUT_ROOT}
	@@mkdir -p ${WIDGET_CSS_OUTPUT_ROOT}
	@@test -h ${LATEST_ROOT} || ln -s ${FRAMEWORK_ROOT} ${LATEST_ROOT}
