#!/bin/bash
# Run instrumented unit tests
#
# set CHROME_BIN to the path to/name of your Google Chrome binary
# (default = `which google-chrome`)
# set JS_COVERAGE_BIN to the path to/name of your jscoverage binary
# (default = `which jscoverage`)

# where are we?
SCRIPT_PATH=`readlink -f $0`

if [[ "x" == "x$SCRIPT_PATH" ]] ; then
  DIR=`dirname $0`
else
  DIR=`dirname $SCRIPT_PATH`
fi

# programs we need to run
if [[ "x" == "x$CHROME_BIN" ]] ; then
  CHROME_BIN=`which google-chrome`
fi

if [[ "x$CHROME_BIN" == "x" ]] ; then
  echo "*** ERROR: google-chrome not found - please make sure it's installed"
  echo "Then either put it on your PATH or set the CHROME_BIN env variable"
  exit 1
fi

if [[ "x" == "x$JSCOVERAGE_BIN" ]] ; then
  JSCOVERAGE_BIN=`which jscoverage`
fi

if [[ "x$JSCOVERAGE_BIN" == "x" ]] ; then
  echo "*** ERROR: jscoverage not found - please make sure it's installed"
  echo "Then either put it on your PATH or set the JSCOVERAGE_BIN env variable"
  exit 1
fi

# directory for instrumented files
if [ -d $DIR/instrumented ] ; then
  rm -Rf $DIR/instrumented
fi

# just instrument the web-ui-fw file
$JSCOVERAGE_BIN --exclude web-ui-fw-libs.js --exclude jquery.js \
  $DIR/../../build/web-ui-fw/latest/js $DIR/instrumented

# copy all the unit tests to the instrumented directory
cp -a $DIR/../unit-tests/* $DIR/instrumented/

# edit links in all index.html test files
for file in `find $DIR/instrumented/ -name index.html` ; do
  # refer to the instrumented web-ui-fw JS file
  sed -i -e 's%\.\.\/\.\.\/\.\.\/build\/web-ui-fw\/latest\/js\/web-ui-fw\.js%\.\.\/web-ui-fw\.js%' $file

  # other files are just one directory further up
  sed -i -e 's%\.\.\/\.\.\/build%\.\.\/\.\.\/\.\.\/build%' $file
  sed -i -e 's%\.\.\/\.\.\/\libs%\.\.\/\.\.\/\.\.\/libs%' $file
done

# run the top-level test file through jscoverage
$CHROME_BIN --allow-file-access-from-files file://$DIR/instrumented/jscoverage.html?index.html
