web-ui-fw is a set of widgets and other components for jQuery Mobile,
including:

* color pickers
* datetime picker
* calendar picker (based on JQM-Datebox)
* weekday picker
* progressbar
* "processing" bar (aka indeterminate progress bar)
* "processing" spinner
* swipe list (list items which can be swiped to the right to reveal
  related buttons or other content)
* shortcut scroll (links to list dividers within a listview)
* expandable/collapsible list items
* person picker
* switch (replacement for the two value jQuery Mobile slider; also,
  orientated vertically rather than horizontally)
* slider improvements, including a togglable popup showing the current value
* optionheader (collapsible form element container)
* volume control
* popup window (which can also be used for tooltips)
* single image display widget (which handles maintaining aspect ratio
  and providing an "image missing" replacement image)
* simple horizontal and vertical box layout management (based on jLayout)
* listview controls (declarative, modal control of the appearance of a listview)

web-ui-fw also includes a custom theme (slightly deprecated, as it was built
using the outdated single CSS file approach).

The project is complementary to jQuery Mobile and the components
should slot into existing projects. In almost all cases, the colours
and styling of the widgets should broadly adhere to the jQuery Mobile
styling approach.

Instructions for using web-ui-fw in your own project are in the
**Using a web-ui-fw distribution** section.

If you are interested in working on web-ui-fw itself, please see
HACKING.md.

**Note: This is the first release of the project, and there are
many rough edges. But we felt it was important to release our work
as soon as it was possible and practical. Please feel free to provide
feedback, log bugs, provide patches etc.**

Dependencies
============

web-ui-fw depends on jQuery and jQuery Mobile. It is written against the
1.0-stable branch of jQuery Mobile. So you should use the 1.0 version
of jQuery Mobile as explained at:

  http://jquerymobile.com/download/

web-ui-fw incorporates the following third party libraries
either in full or in part:

* <a href="http://www.bramstein.com/projects/jlayout/">jLayout and
  the jLayout jQuery plugin</a> (all of them)
* <a href="http://www.bramstein.com/projects/jsizes/">jSizes</a> (all of it)
* <a href="https://github.com/jtsage/jquery-mobile-datebox">JQM-DateBox</a>
* some experimental elements of jQuery Mobile, especially scrollview

There is no need to download these libraries, as they are included
in the project and the built JavaScript.

If you have any of these libraries in your project, you may need to
be careful of unwanted interactions.

See COPYING for their individual licences and further information.

Licence
=======

The project is MIT licensed (see COPYING for details).

Maintainers
===========

The project is maintained by Intel's Open Source Technology Centre.

Contact
===========

Contact us on FreeNode: irc.freenode.net channel #web-ui-fw

Using a web-ui-fw distribution
==============================

This document explains how to use one of the web-ui-fw distribution
files (available under
<a href="https://github.com/otcshare/web-ui-fw/downloads">**Downloads**</a>).

A distribution file contains the following:

<pre>
docs/                   basic API documentation
images/                 images used by web-ui-fw widgets and custom theme;
                        note that this includes several jqm sprite
                        pngs, for use in the custom theme; if you're using
                        jqm from a CDN, some of these may be redundant
COPYING                 licence file
README                  this file
web-ui-fw-libs.js       3rd party libraries web-ui-fw depends on (see Dependencies)
web-ui-fw.js            the web UI widgets, components etc.
web-ui-fw-widget.css    CSS styling for the web UI widgets
</pre>

The JavaScript files will be minified (via uglify-js) if you got the
.min.tar.gz file and are less suitable for debugging.

To use the archive, follow the steps in the next section.

Step by step
------------

1. Download the tarball and unpack it somewhere. This should give you
   a web-ui-fw directory.
2. Copy the files from there to your project (it's up to you where they go).
3. Add stylesheet and script elements to load the web-ui-fw files in the
   correct order, _after_ the lines you added to load jQuery and jQuery Mobile.

For example, if your project had a layout like this:

<pre>
/ (root directory)
  index.html (the entry point to your application)
  js/
    app.js (your application's JavaScript)
  css/
    app.css (your application's CSS)
</pre>

You could add the web-ui-fw directory to your project like this:

<pre>
/
  index.html
  js/
    app.js
  css/
    app.css
  web-ui-fw/
    images/
      ... web-ui-fw images ...
    web-ui-fw-libs.js (3rd party dependencies of web-ui-fw)
    web-ui-fw.js (web UI components)
    web-ui-fw-widget.css (web UI widget styling)
    web-ui-fw-theme.css (optional)
</pre>

Note that the web-ui-fw-theme.css file is optional. If you want to
use it, see the **Using the custom theme** section.

The boilerplate for a basic web-ui-fw project, pulling in all
the required files in the right order, is shown in the next section.

Boilerplate index.html
----------------------

(This assumes the directory layout from the previous section.)

<pre>
&lt;!DOCTYPE html&gt;
&lt;html&gt;

  &lt;head&gt;

    &lt;title&gt;My app&lt;/title&gt;

    &lt;!-- jQuery Mobile stylesheet --&gt;
    &lt;link rel="stylesheet"
          href="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css" /&gt;

    &lt;!-- web-ui-fw widget styling --&gt;
    &lt;link rel="stylesheet" href="web-ui-fw/web-ui-fw-widget.css" /&gt;

    &lt;!-- your application stylesheet --&gt;
    &lt;link rel="stylesheet" href="css/app.css" /&gt;

    &lt;!-- jQuery and jQuery Mobile JS --&gt;
    &lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
    &lt;script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"&gt;&lt;/script&gt;

    &lt;!-- web-ui-fw JS --&gt;
    &lt;script src="web-ui-fw/web-ui-fw-libs.js"&gt;&lt;/script&gt;
    &lt;script src="web-ui-fw/web-ui-fw.js"&gt;&lt;/script&gt;

    &lt;!-- your application JS --&gt;
    &lt;script src="js/app.js"&gt;&lt;/script&gt;

  &lt;/head&gt;

  &lt;body&gt;

    &lt;div data-role="page" id="home"&gt;
      &lt;div data-role="header"&gt;
        &lt;h1&gt;page header&lt;/h1&gt;
      &lt;/div&gt;

      &lt;div data-role="content"&gt;
        &lt;!-- APPLY ONE OF THE web-ui-fw COMPONENTS --&gt;
        &lt;ul data-role="listview" data-autodividers="alpha"&gt;
          &lt;li&gt;Albert&lt;/li&gt;
          &lt;li&gt;Aldo&lt;/li&gt;
          &lt;li&gt;Betty&lt;/li&gt;
          &lt;li&gt;Brian&lt;/li&gt;
          &lt;li&gt;Carrie&lt;/li&gt;
          &lt;li&gt;Dave&lt;/li&gt;
          &lt;li&gt;Ethel&lt;/li&gt;
          &lt;li&gt;Grant&lt;/li&gt;
          &lt;li&gt;Greta&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/div&gt;
    &lt;/div&gt;

  &lt;/body&gt;

&lt;/html&gt;
</pre>

The listview in the example above uses the autodividers component
from web-ui-fw. If you can see list dividers containing alphabetical letters
at the appropriate points in the listview, you can be fairly confident
that web-ui-fw has loaded correctly.

Using the custom theme
----------------------

Replace the standard jQuery Mobile theme file with the
web-ui-fw-theme.css file. For example:

<pre>
&lt;!-- load the custom theme instead of jquery.mobile-1.0.min.css --&gt;
&lt;link rel="stylesheet" href="web-ui-fw/web-ui-fw-theme.css" /&gt;

&lt;!-- load jQuery and jQuery Mobile JavaScript--&gt;
&lt;script src="http://code.jquery.com/jquery-1.6.4.min.js"&gt;&lt;/script&gt;
&lt;script src="http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.js"&gt;&lt;/script&gt;

&lt;!-- load the web-ui-fw as above --&gt;
...
</pre>
