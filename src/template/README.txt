What a developer needs to do in their application:

* Application developer drops a single bootstrap.js file into their
  application. This contains a basic loader script, plus defaults for
  the framework and theme to be used. It also contains inlined versions
  of domready.js (for DOM ready checking) and LAB.js (for async script
  loading). (Both are MIT licensed.)

* In index.html, they add a script tag to load bootstrap.js
  and specify parameters for the loader. For example:

  <script src="bootstrap.js"
          data-framework-version="0.1"
          data-framework-root="/path/to/web-ui-fw"
          data-framework-theme="default">
  </script>

* They create a config.js file to specify which of their own JS, CSS files
  need to be loaded, other app config etc. For example:

  S.load(
    'src/app_manage.js',
    'src/theme.js',
  );

  /* link custom stylesheet */
  S.css.load(
    'app_manage.css',
    'src/theme.css'
  );

  Note that as config.js is loaded last, it can reference any framework
  functions. In this case, 'S' is an arbitrary namespace I picked for
  our framework; the load() function is defined in bootstrap.js, and
  simply loads the specified JS files (relative to the application root
  directory) in order.


What happens when the app loads:

* bootstrap.js is loaded

* The auto-run function in bootstrap.js is called once the DOM is ready.
  This does the following:

  - Hides the <body> element until everything is loaded

  - Sets a default root location for the framework files (web-ui-fw in
    this demo, but could be an absolute file:// path)

  - Sets a default version of the framework to load (0.1)

  - Sets a default theme to load (default)

  - Finds the bootstrap.js <script> element in the DOM

  - Replaces any of the defaults (root, version, theme) with values
    from data- attributes on the &lt;script> element; available values
    are:
      * root = <relative or absolute URI>
      * version = 0.1 (actually the same jQuery Mobile version)
      * theme = default

  - Appends a <link rel="stylesheet"...> element to the head to
    load the theme's stylesheet

  - Uses LAB.js to load the framework JS files; the names of the files are
    specified in bootstrap.js

  - Loads config.js: any code in it runs, which may include
    loading more JavaScript files (via .load() for example); one of
    the loaded files should do the actual application stuff (equivalent of
    a main() function).

  - Shows the <body> element once config.js has finished loading; NB this
    may be before the developer's own scripts have loaded (if loaded via
    .load()).
