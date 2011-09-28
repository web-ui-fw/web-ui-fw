// domready.js (https://github.com/ded/domready)
// NB not minified, as it the minified version doesn't work
!function (context, doc) {
  var fns = [], ol, fn, f = false,
      testEl = doc.documentElement,
      hack = testEl.doScroll,
      domContentLoaded = 'DOMContentLoaded',
      addEventListener = 'addEventListener',
      onreadystatechange = 'onreadystatechange',
      loaded = /^loade|c/.test(doc.readyState);

  function flush(i) {
    loaded = 1;
    while (i = fns.shift()) { i() }
  }
  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f);
    flush();
  }, f);


  hack && doc.attachEvent(onreadystatechange, (ol = function () {
    if (/^c/.test(doc.readyState)) {
      doc.detachEvent(onreadystatechange, ol);
      flush();
    }
  }));

  context['domReady'] = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left');
          } catch (e) {
            return setTimeout(function() { context['domReady'](fn) }, 50);
          }
          fn();
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn);
    };

}(this, document);

/*yepnope1.0.2|WTFPL*/(function(a,b,c){function H(){var a=z;a.loader={load:G,i:0};return a}function G(a,b,c){var e=b=="c"?r:q;i=0,b=b||"j",u(a)?F(e,a,b,this.i++,d,c):(h.splice(this.i++,0,a),h.length==1&&E());return this}function F(a,c,d,g,j,l){function q(){!o&&A(n.readyState)&&(p.r=o=1,!i&&B(),n.onload=n.onreadystatechange=null,e(function(){m.removeChild(n)},0))}var n=b.createElement(a),o=0,p={t:d,s:c,e:l};n.src=n.data=c,!k&&(n.style.display="none"),n.width=n.height="0",a!="object"&&(n.type=d),n.onload=n.onreadystatechange=q,a=="img"?n.onerror=q:a=="script"&&(n.onerror=function(){p.e=p.r=1,E()}),h.splice(g,0,p),m.insertBefore(n,k?null:f),e(function(){o||(m.removeChild(n),p.r=p.e=o=1,B())},z.errorTimeout)}function E(){var a=h.shift();i=1,a?a.t?e(function(){a.t=="c"?D(a):C(a)},0):(a(),B()):i=0}function D(a){var c=b.createElement("link"),d;c.href=a.s,c.rel="stylesheet",c.type="text/css";if(!a.e&&(o||j)){var g=function(a){e(function(){if(!d)try{a.sheet.cssRules.length?(d=1,B()):g(a)}catch(b){b.code==1e3||b.message=="security"||b.message=="denied"?(d=1,e(function(){B()},0)):g(a)}},0)};g(c)}else c.onload=function(){d||(d=1,e(function(){B()},0))},a.e&&c.onload();e(function(){d||(d=1,B())},z.errorTimeout),!a.e&&f.parentNode.insertBefore(c,f)}function C(a){var c=b.createElement("script"),d;c.src=a.s,c.onreadystatechange=c.onload=function(){!d&&A(c.readyState)&&(d=1,B(),c.onload=c.onreadystatechange=null)},e(function(){d||(d=1,B())},z.errorTimeout),a.e?c.onload():f.parentNode.insertBefore(c,f)}function B(){var a=1,b=-1;while(h.length- ++b)if(h[b].s&&!(a=h[b].r))break;a&&E()}function A(a){return!a||a=="loaded"||a=="complete"}var d=b.documentElement,e=a.setTimeout,f=b.getElementsByTagName("script")[0],g={}.toString,h=[],i=0,j="MozAppearance"in d.style,k=j&&!!b.createRange().compareNode,l=j&&!k,m=k?d:f.parentNode,n=a.opera&&g.call(a.opera)=="[object Opera]",o="webkitAppearance"in d.style,p=o&&"async"in b.createElement("script"),q=j?"object":n||p?"img":"script",r=o?"img":q,s=Array.isArray||function(a){return g.call(a)=="[object Array]"},t=function(a){return Object(a)===a},u=function(a){return typeof a=="string"},v=function(a){return g.call(a)=="[object Function]"},w=[],x={},y,z;z=function(a){function h(a,b){function i(a){if(u(a))g(a,f,b,0,c);else if(t(a))for(h in a)a.hasOwnProperty(h)&&g(a[h],f,b,h,c)}var c=!!a.test,d=c?a.yep:a.nope,e=a.load||a.both,f=a.callback,h;i(d),i(e),a.complete&&b.load(a.complete)}function g(a,b,d,e,g){var h=f(a),i=h.autoCallback;if(!h.bypass){b&&(b=v(b)?b:b[a]||b[e]||b[a.split("/").pop().split("?")[0]]);if(h.instead)return h.instead(a,b,d,e,g);d.load(h.url,h.forceCSS||!h.forceJS&&/css$/.test(h.url)?"c":c,h.noexec),(v(b)||v(i))&&d.load(function(){H(),b&&b(h.origUrl,g,e),i&&i(h.origUrl,g,e)})}}function f(a){var b=a.split("!"),c=w.length,d=b.pop(),e=b.length,f={url:d,origUrl:d,prefixes:b},g,h;for(h=0;h<e;h++)g=x[b[h]],g&&(f=g(f));for(h=0;h<c;h++)f=w[h](f);return f}var b,d,e=this.yepnope.loader;if(u(a))g(a,0,e,0);else if(s(a))for(b=0;b<a.length;b++)d=a[b],u(d)?g(d,0,e,0):s(d)?z(d):t(d)&&h(d,e);else t(a)&&h(a,e)},z.addPrefix=function(a,b){x[a]=b},z.addFilter=function(a){w.push(a)},z.errorTimeout=1e4,b.readyState==null&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",y=function(){b.removeEventListener("DOMContentLoaded",y,0),b.readyState="complete"},0)),a.yepnope=H()})(this,this.document)

// 'S' is the framework namespace (temporary)
S = {
    cacheBust: (document.location.href.match(/debug=true/)) ?
               '?cacheBust=' + (new Date()).getTime() :
               '',
    basePath: '',

    // these should be loaded before config.js
    scriptsToLoadPreConfig: ['js/jquery.js'],

    // these are scripts which should be loaded after config.js
    scriptsToLoadPostConfig: ['js/web-ui-fw-libs.js',
                              'js/web-ui-fw-default-theme.js',
                              'js/web-ui-fw.js'],

    addBasePath: function (scripts) {
        var mapped = [];

        for (var i = 0; i < scripts.length; i++) {
            mapped.push(this.basePath + scripts[i]);
        }

        return mapped;
    },

    // load jquery and then config.js; this enables us to inject
    // configuration into jqm mobile before it is init'ed; it also
    // allows us to define jqm widgets and capture pagecreate/pageshow
    // events for the first page, as we turn off page autoinitialization
    // and only turn it back on after config has finished loading its
    // pages
    loadConfig: function () {
        var scriptsToLoad = this.addBasePath(this.scriptsToLoadPreConfig);
        scriptsToLoad.push('config.js');

        var callback = function () {
            $(document).bind('mobileinit', function () {
                $.mobile.autoInitializePage = false;
            });
        };

        this.loadScriptsWithCallback(scriptsToLoad, callback);
    },

    // call this from config.js to load js specific to the app,
    // followed by the rest of the framework (except jQuery itself)
    // NB all scripts are loaded serially, but we could use a dependency
    // graph here instead
    load: function () {
        var scriptsToLoad = this.addBasePath(this.scriptsToLoadPostConfig);

        for (var i = 0; i < arguments.length; i++) {
            scriptsToLoad.push(arguments[i]);
        }

        var callback = function () {
            $.mobile.initializePage();
            $('body').css('visibility', 'visible');
        };

        this.loadScriptsWithCallback(scriptsToLoad, callback);
    },

    // utility function to load an array of script paths, appending
    // S.cacheBust to each; finally, invoke callback when all scripts
    // have finished loading
    loadScriptsWithCallback: function (scriptsToLoad, callback) {
        var scriptPath;
        var scriptsToLoadMunged = [];

        for (var i = 0; i < scriptsToLoad.length; i++) {
            scriptPath = scriptsToLoad[i] + this.cacheBust;
            scriptsToLoadMunged.push(scriptPath);
        }

        yepnope({
            load: scriptsToLoad,
            complete: callback
        });
    },

    member: function (item, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (item === arr[i]) {
                return true;
            }
        }
        return false;
    },

    // default root path to the framework; could be an absolute file:// URI
    defaultFrameworkRoot: 'web-ui-fw',

    // default framework version to load
    defaultFrameworkVersion: '0.1',

    // default theme to load
    defaultFrameworkTheme: 'default',

    frameworkVersions: ['0.1'],
    frameworkThemes: ['default']
};

/* Create custom user stylesheet */
S.css = {
    load: function () {
        var head = document.getElementsByTagName('head')[0];
        for (var i = 0; i < arguments.length; i++) {
            head.appendChild(this.makeLink(arguments[i] + S.cacheBust));
        }
    },

    makeLink : function (href) {
        var customstylesheetLink = document.createElement('link');
        customstylesheetLink.setAttribute('rel', 'stylesheet');
        customstylesheetLink.setAttribute('href', href);
        return customstylesheetLink;
    }
};

// auto-run function which loads the framework
(function () {
    domReady(function () {
        var body = document.getElementsByTagName('body')[0];
        body.style.visibility = 'hidden';

        var scriptElements,
            scriptElt,
            srcAttr,
            i,
            frameworkVersionValue,
            frameworkRootValue,
            frameworkThemeValue,
            basePath,
            stylesheetPath;

        // set some defaults
        var frameworkRoot = S.defaultFrameworkRoot;
        var frameworkVersion = S.defaultFrameworkVersion;
        var frameworkTheme = S.defaultFrameworkTheme;

        // get framework version, root and theme from the bootstrap.js <script> element
        scriptElements = document.getElementsByTagName('script');

        for (i = 0; i < scriptElements.length; i++) {
            scriptElt = scriptElements[i];
            srcAttr = scriptElt.getAttribute('src');

            if (!scriptElt || !srcAttr) { continue; }

            if (srcAttr && srcAttr.match(/bootstrap\.js/)) {
                frameworkVersionValue = scriptElt.getAttribute('data-framework-version');
                if (frameworkVersionValue) {
                    frameworkVersion = frameworkVersionValue;
                }

                frameworkRootValue = scriptElt.getAttribute('data-framework-root');
                if (frameworkRootValue) {
                    frameworkRoot = frameworkRootValue;
                }

                frameworkThemeValue = scriptElt.getAttribute('data-framework-theme');
                if (frameworkThemeValue) {
                    frameworkTheme = frameworkThemeValue;
                }
            }
        }

        // display some error messages in case theme/framework not supported;
        // NB we still try to load them anyway below, in case the developer
        // is working with their own theme structure etc.
        if (!S.member(frameworkVersion, S.frameworkVersions)) {
            console.error('Framework version "' + frameworkVersion +
                          '" is not supported');
        }
        if (!S.member(frameworkTheme, S.frameworkThemes)) {
            console.error('Framework theme "' + frameworkTheme +
                          '" is not supported');
        }

        // construct (and store) base path
        S.basePath = frameworkRoot + '/' + frameworkVersion + '/';

        // load stylesheet for the theme
        stylesheetPath = S.basePath + 'css/web-ui-fw-default-theme.css';
        S.css.load(stylesheetPath);

        // load jquery and our config.js file, turning off jqm's page init until
        // all our js is loaded; the S.load() method should be called from
        // config.js, either with no arguments or with extra js files to load;
        // once all our files are loaded, the rest of the framework (including
        // jqm) is loaded and the first page init'ed
        S.loadConfig();

        // NB application should call S.load() to finish loading the framework;
        // optionally, pass S.load() any paths to app scripts: they will
        // get loaded before the rest of the framework
    });
})();
