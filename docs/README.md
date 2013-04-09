jQuery Mobile Web-UI-FW API Docs. (based on Grunt-0.4)
============================================================


## Building

### Requirements
* <a href="http://www.xmlsoft.org/">libxml2-utils</a>
* <a href="http://xmlsoft.org/XSLT/">libxslt</a>

The `xmllint` and `xsltproc` utilities should be in your path. 
The [`xmllint`](http://manpages.ubuntu.com/manpages/lucid/man1/xmllint.1.html) is included in libxml(libxml2-utils ackage) and the [`xsltproc`](http://manpages.ubuntu.com/manpages/precise/en/man1/xsltproc.1.html) is part of [libxslt](http://manpages.ubuntu.com/manpages/natty/man3/libxslt.3.html).
If you are on Windows, you can get libxml2 and libxslt from [GnuWin32](http://sourceforge.net/projects/gnuwin32/files/).


### Build

To build only the documentation files on the "docs" folder in which web-ui-fw is cloned, you can build it with the steps as follows.:

1. Install grunt-cli (if you haven't yet).
	```
	npm install -g grunt-cli
	```

2. Install local build dependencies.
	```
	npm install
	```

3. Copy the config-sample.json file to config.json in the same directory.
	```
	cp config-sample.json config.json
	```

4. Build the files.
	```
	grunt
	```


### Build and Deploy

To build and deploy your changes for previewing in a [`jquery-wp-content`](https://github.com/jquery/jquery-wp-content) instance, follow the **[workflow instructions](http://contribute.jquery.org/web-sites/#workflow)** from our documentation on [contributing to jQuery Foundation web sites](http://contribute.jquery.org/web-sites/).


