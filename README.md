Installing lessc
================

`lessc` is a compiler that generates CSS code from the .less files that
style the widgets. Here are some instruction to install it on Ubuntu
11.04, and it should work on other Debian based distributions. Users of
other distributions should find their way around too:

1.`cd /tmp`
2.`sudo apt-get install git-core curl build-essential openssl libssl-dev`
3.`git clone https://github.com/joyent/node.git && cd node`
4.`git checkout v0.4.9` # or whatever the latest stable is - last known to work v0.5.0
5.`./configure && make`
6.`sudo make install`
7.`curl http://npmjs.org/install.sh | sudo sh`
8.`npm install less`
9.`export PATH=$HOME/.npm/less/1.1.4/package/bin:$PATH`

You may want to add the final export to your .bashrc and source it.

NOTICE: if there is error on connecting npm server , try this command:   
`npm config regsitry=http://registry.npmjs.org/` 

Installing in Ubuntu 11.10 
--------------------------

  `sudo apt-get update && sudo apt-get install libnode-less`


Installing in OS X Lion with Homebrew
-------------------------------------

1.`brew install npm`
2.`npm install less -g`



Building
========

***
NB: The development team working on web-ui-fw uses Linux,
so no one has attempted to build this project on other
platforms.
***

First install `lessc` (see above).

You'll also need make.

Then, from a command line inside the project directory, do:

  make clean
  make

This compiles the stylesheets for all the widgets using lessc,
then concatenates all the library and widget JavaScript into
framework files.



The widget gallery demo
===============================

You'll need to build the project first (see above).

In a browser, open:

  demos/gallery/index.html

This shows the widgets currently available for the web UI framework.

If you are developing on the widget gallery demo (e.g. writing
widgets), you may want to bypass the framework loader's cache
mechanism (so you get the latest version of every JS file). To
do this, append a debug=true parameter to the URL, e.g.

file://<path>/demos/gallery/index.html?debug=true

where <path> is the full, absolute (with leading /) path to your
checked out copy of the web-ui-fw repo.

Also note that each time you change your widget code, you'll
need to do "make clean ; make" to rebuild the CSS and JS files.
