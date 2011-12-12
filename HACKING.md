Quick start
===========

There are two ways to quickly use this project if you don't want to build it.
First: you could download the latest official release at:

    https://github.com/web-ui-fw/web-ui-fw/downloads

Second: you could use the files from the online demo at:

    http://web-ui-fw.github.com/

and that means:

    http://web-ui-fw.github.com/web-ui-fw/web-ui-fw.js
    http://web-ui-fw.github.com/web-ui-fw/web-ui-fw-libs.js
    http://web-ui-fw.github.com/web-ui-fw/web-ui-fw-widget.css

Of course you will need JQuery Mobile (currently, version 1.0) and JQuery
(currently, version 1.6.4).

Please see the README file for some boilerplate on how to use web-ui-fw
within a jQuery Mobile project.


Installing less
---------------

`lessc` is a compiler that generates CSS code from the .less files that
style the widgets. Here are some instruction to install it on Ubuntu
11.04, and it should work on other Debian based distributions. Users of
other distributions should find their way around too:

    cd /tmp
    sudo apt-get install git-core curl build-essential openssl libssl-dev
    git clone https://github.com/joyent/node.git && cd node
    git checkout v0.4.9 # or whatever the latest stable is - last known to work v0.5.0
    ./configure && make
    sudo make install
    curl http://npmjs.org/install.sh | sudo sh
    npm install less
    export PATH=$HOME/.npm/less/1.1.4/package/bin:$PATH

You may want to add the final export to your .bashrc and source it.


Installing uglifyjs
-------------------

`uglifyjs` is a JavaScript parser/compressor/beautifier. It can be
installed via NPM. On a Debian based distribution, this should work:

    npm install uglify-js

After the installation, make sure that `uglifyjs` is in your PATH,
then set DEBUG=no in the Makefile to compress the Javascript code.


Installing Google Chrome
------------------------

The main browser used for developing web-ui-fw is Google Chrome. This
is also used to produce the coverage reports (see below). So it's
recommended that you install it if you intend to do any work on the
project.

Get it from `http://www.google.com/chrome`


Installing jscoverage
---------------------

jscoverage produces code coverage reports from instrumented JavaScript
code. It's used here to produce coverage reports from the QUnit test
suite (in tests/unit-tests): see the section on "Running the test coverage
report" for more details.

It's not essential to install this unless you want to get coverage
reports for the web-ui-fw test suite.

The source is available from: `http://siliconforks.com/jscoverage/`
It has minimal dependencies and is easy to build.

Once you've built it, put the jscoverage binary on your PATH.


Installing docco
----------------

`docco` is used to generate API documentation. It needs Pygments for
the syntax hilighting:

    sudo apt-get install python-setuptools
    sudo easy_install Pygments
    npm install docco

(Then add docco to your PATH).

Installing gawk
---------------

GNU awk (`gawk`) is used to place HTML prototypes into compiled source files.
It is usually provided by a package named `gawk`.


Building
========

***
NB: The development team working on web-ui-fw uses Linux,
so no one has attempted to build this project on other
platforms.
***

First install `less` (see above).

You'll also need `make`.

After first cloning the repository, you need to do:

    git submodule init

Subsequently, if the submodule has changed, you need to do:

    git submodule update

followed by:

    cd libs/js/submodules/jquery-mobile; make && cd -
    make

This builds jquery-mobile, then compiles the stylesheets for all the
widgets using lessc, finally concatenates all the library and widget
JavaScript into framework files.

If you want to clean the source tree, just do:

  make clean


Building the documentation
==========================

If you have installed docco (see above), you can build the
documentation by issuing the following command:

  make docs


The widget gallery demo
=======================

You'll need to build the project first (see above).

In a browser, open:

    demos/gallery/index.html

This shows the widgets currently available for the web UI framework.

If you are developing on the widget gallery demo (e.g. writing
widgets), you may want to bypass the framework loader's cache
mechanism (so you get the latest version of every JS file). To
do this, append a debug=true parameter to the URL, e.g.

    file://<path>/demos/gallery/index.html?debug=true

where `<path>` is the full, absolute (with leading /) path to your
checked out copy of the web-ui-fw repo.

Also note that each time you change your widget code, you'll
need to do `make clean && make` to rebuild the CSS and JS files.


Writing more widgets
====================

The best way to start is to copy an existing widget. A simple one
like progressbar is a good starting point.

Note that your widget JavaScript code should provide the following:

* Programmatic access: `$(selector).mywidget()` should create an instance
of your widget.

* Declarative access: `<div data-role="mywidget">...</div>` should also
create an instance of your widget.

* A `_create()` method which initialises your widget.

* A set of options which can be set via a
`$(selector).mywidget('option', value)` style method, or by attributes
on the selected element, e.g. `data-mywidget-myoption="value"`.
Where there are multiple options, you should
use a `data-mywidget-options='{...json...}'` style attribute (see
layout-hbox for an example).

* Options should include an `initSelector`, specifying the
jQuery selector for finding elements to which your widget applies. Typically
this will involve looking for `data-role` attributes, e.g.

        :jqmData(role=optionheader)

See optionheader for an example. Alternatively, if the widget applies
to all instances of a particular HTML element, you may need a more
general selector: see the jQuery Mobile widgets for examples.

* An auto-init handler which will bind your widget to the appropriate
elements when pages are created, using that initSelector to find
them, e.g.

        $(document).bind("pagecreate", function (e) {
            $($.todons.mywidget.prototype.options.initSelector, e.target)
                .not(":jqmData(role='none'), :jqmData(role='nojs')")
                .mywidget();
        });

* Theme-awareness. This means both setting a default theme swatch for
the widget and capturing any data-theme attribute set on the target element
(the one your widget constructor is being applied to). See optionheader
for an example of getting the data-theme and setting the swatch on
the target element. You should also consider whether a swatch should
be inherited by your widget (c.f. how buttons inherit their parent's
swatch).

* A `refresh()` method which will draw/redraw the widget. If you are
adding new markup, you should always test for the existence of the
markup you intend to add first, and remove it if it is present.

* If your widget relies on measuring the dimensions or position of
other widgets, you should provide for situations both where it is
being created on a visible page, and where it's being created on a page
which isn't yet visible. Code like the following, typically in the widget's
`_create()` method, should accomplish this:

        var page = this.element.closest(':jqmData(role="page")');
        var self = this;

        if (page.is(":visible")) {
            self.refresh();
        }
        else {
            page.bind("pageshow", function () {
                self.refresh();
            });
        }

* Respond to and fire events appropriately. In particular, if your
widget changes the page size (e.g. it expands/contracts) it should
fire an updatelayout event so widgets on the same page can respond
appropriately. Similarly, your widget should bind to updatelayout
events on any elements it is associated with (e.g. its parent container).

You should also supply:

* Basic API documentation about how to use the widget, at the top
of the JS file.

* A demo of how the widget can be used in demos/gallery.

* Unit tests in a tests/mywidget directory. See below for instructions
on writing new tests.


Writing tests
=============

To add a new test for your widget:

* Create a directory under tests/, named after your widget (e.g.
`tests/mywidget`).

* Add an `index.html` file to that directory, marked up for your test
pages (see `tests/autodividers/index.html` for an example: you need
all the JavaScript and CSS in the order shown there).

* Add a JavaScript file called `mywidget-tests.js` to the same directory.
This should contain your QUnit tests
(see `tests/autodividers/autodividers-tests.js` for an example).

* Edit the `tests/tests.js` file and add the path to your test file
to it, e.g.

        var TESTS = {
            "testPages":[
                "mywidget/index.html", // this is my new test file
                "autodividers/index.html"
            ]
        };

* Run your tests by opening the `tests/index.html` file (to run the
whole suite) or your individual `index.html` file to run just your tests.

NB you'll need to do a full build so the JS and CSS files are in
the build/ directory before running tests.


Running the test coverage report
================================

To get a coverage report, run jscoverage from the top level directory
with:

    make coverage

This will open the unit tests in Google Chrome and run them. Once they're
done, the coverage report is available from the "Summary" tab of the page.

NB: The instrument.sh script uses $CHROME_BIN --allow-file-access-from-files. 
If you have Chrome open already without this switch on, the tests run inside the wrong context.



OS X Lion with Homebrew
=======================

    brew update
    brew install node
    brew install npm
    npm install less -g

Notice
------
if there is error on connecting npm server , try to set registry to http:

    npm config set regsitry http://registry.npmjs.org/
