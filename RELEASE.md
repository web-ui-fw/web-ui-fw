# Release process for \<version\>

0. grunt test
1. Build web-ui-fw.
2. Deploy the API docs as shown below. This assumes you have already set up LAMP with wordpress to host local.api.jquerymobile.com and that the docs will overwrite that site.


    ```
$ cd docs
$ grunt wordpress-deploy
$ wget --mirror -p http://local.api.jquerymobile.com/
$ cd local.api.jquerymobile.com/
$ git init .
$ git add *
$ git commit -a -m 'Mirror: Fresh.'
$ find | grep '?' | while read; do F=$( echo "$REPLY" | sed 's/\?.*$//' ); if test -f "$F"; then git rm "$REPLY"; else git mv "$REPLY" "$F"; fi; done
$ git commit -a -m 'Removed ? files'
$ find -type f | while read; do cat "$REPLY" | sed '/shortcut icon/N; s/^[^\n]*\n//' > "$REPLY".new && mv "$REPLY".new "$REPLY"; done
$ git commit -a -m 'Removing shortcut icon'
$ cat - >> jquery-wp-content/themes/jquery/css/base.css 
#logo-events { display: none; }
#global-nav { display: none; }
#main { display: none; }
#legal { display: none !important; }
.cdn, .download { display: none; }
.eight.columns.centered h3 { display: none; }
$ # NOTE: Use Ctrl+D to complete the command above.
$ git commit -a -m 'Hiding branding.'
$ find | grep 'feed$' | xargs rm -rf
$ git commit -a -m 'Removed feeds.'
$ cat index.html | sed 's@<title>jQuery Mobile API Documentation</title>@<title>jQuery Mobile Web UI Framework API Documentation</title>@' > index.html.new && mv index.html.new index.html
$ git commit -a -m 'Changing title.'
$ cat index.html | grep -vE '<meta name="(author|description)"' > index.html.new && mv index.html.new index.html
$ git commit -a -m 'Removing author and description meta tag.'
$ find -type f | grep -v '\.git' | while read; do cat "$REPLY" | grep -vE '<link rel="(alternate|pingback|EditURI|wlwmanifest)"' > "$REPLY".new && mv "$REPLY".new "$REPLY"; done
$ git checkout jquery-wp-content/
$ git commit -a -m 'Removing pingback, rss, etc. links'
$ find -type f | grep -v '\.git' | sed 's@^\./@@' | while read; do DEPTH=$( dirname "$REPLY" | awk -F '/' '{ if ( $0 == "." ) print 0; else print NF ; }' ); RELPATH=`for (( Nix=0; Nix < $DEPTH ; Nix++ )); do echo -n "../"; done`; cat "$REPLY" | sed -r 's@http://local.api.jquerymobile.com/@'"$RELPATH"'@g' > "$REPLY".new && mv "$REPLY".new "$REPLY" ; done
$ git commit -a -m 'Making paths relative.'
$ find -type f | grep -v '\.git' | sed 's@^\./@@' | while read; do cat "$REPLY" | sed 's@<li><a class="icon-github" href="http://github.com/jquery/jquery-mobile">GitHub <small>jQuery Mobile <br>Source</small></a></li>@<li><a class="icon-github" href="http://github.com/web-ui-fw/web-ui-fw/">GitHub <small>Web UI Framework<br>Source</small></a></li>@' > "$REPLY".new && mv "$REPLY".new "$REPLY" ; done
$ git commit -a -m 'Fixing repo link.'
$ find -type f | grep -v '\.git' | sed 's@^\./@@' | while read; do cat "$REPLY" | grep -v '<li><a class="icon-group" href="http://forum.jquery.com/jquery-mobile">Forum <small>Community <br>Support</small></a></li>' > "$REPLY".new && mv "$REPLY".new "$REPLY" ; done
$ git checkout jquery-wp-content/
$ git commit -a -m 'Removing forum link.'
$ find -type f | grep -v '\.git' | while read; do cat "$REPLY" | sed 's@<a class="icon-warning-sign" href="http://github.com/jquery/jquery-mobile/issues">@<a class="icon-warning-sign" href="http://github.com/web-ui-fw/web-ui-fw/issues/">@' > "$REPLY".new && mv "$REPLY".new "$REPLY" ; done
$ git commit -a -m 'Fixing issues link.'
$ find -type f | grep -v '\.git' | while read; do cat "$REPLY" | sed 's@http://local.api.jquery.com/@http://api.jquery.com/@g' > "$REPLY".new && mv "$REPLY".new "$REPLY" ; done
$ git commit -a -m 'Fixing references to jQuery API documentation.'
$ rm -rf .git
$ cd ..
$ mv local.api.jquerymobile.com/ ../dist/api-docs
$ cd ..
```
3. ```cp -a dist``` as ```<version>``` to the repository from which ```http://web-ui-fw.github.com/jqm/<version>``` will be produced.

    For example:
    ```
$ cp -a dist ../web-ui-fw.github.com/jqm/0.2.0
$ cd ../web-ui-fw.github.com
$ git add jqm/0.2.0
$ git commit -a -m 'Web UI Framework version 0.2.0.'
$ git push origin master
```

    This should result in the following directory structure:

    ```
http://web-ui-fw.github.com/jqm/<version>/web-ui-fw.js
http://web-ui-fw.github.com/jqm/<version>/web-ui-fw.css
etc.
```
4. git tag <version> and push.
