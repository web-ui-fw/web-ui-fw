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

// LAB.js (http://labjs.com/)
(function(p){var q="string",w="head",L="body",M="script",u="readyState",j="preloaddone",x="loadtrigger",N="srcuri",E="preload",Z="complete",y="done",z="which",O="preserve",F="onreadystatechange",ba="onload",P="hasOwnProperty",bb="script/cache",Q="[object ",bw=Q+"Function]",bx=Q+"Array]",e=null,h=true,i=false,k=p.document,bc=p.location,bd=p.ActiveXObject,A=p.setTimeout,be=p.clearTimeout,R=function(a){return k.getElementsByTagName(a)},S=Object.prototype.toString,G=function(){},r={},T={},bf=/^[^?#]*\//.exec(bc.href)[0],bg=/^\w+\:\/\/\/?[^\/]+/.exec(bf)[0],by=R(M),bh=p.opera&&S.call(p.opera)==Q+"Opera]",bi=("MozAppearance"in k.documentElement.style),bj=(k.createElement(M).async===true),v={cache:!(bi||bh),order:bi||bh||bj,xhr:h,dupe:h,base:"",which:w};v[O]=i;v[E]=h;r[w]=k.head||R(w);r[L]=R(L);function B(a){return S.call(a)===bw}function U(a,b){var c=/^\w+\:\/\//,d;if(typeof a!=q)a="";if(typeof b!=q)b="";d=((/^\/\//.test(a))?bc.protocol:"")+a;d=(c.test(d)?"":b)+d;return((c.test(d)?"":(d.charAt(0)==="/"?bg:bf))+d)}function bz(a){return(U(a).indexOf(bg)===0)}function bA(a){var b,c=-1;while(b=by[++c]){if(typeof b.src==q&&a===U(b.src)&&b.type!==bb)return h}return i}function H(t,l){t=!(!t);if(l==e)l=v;var bk=i,C=t&&l[E],bl=C&&l.cache,I=C&&l.order,bm=C&&l.xhr,bB=l[O],bC=l.which,bD=l.base,bn=G,J=i,D,s=h,m={},K=[],V=e;C=bl||bm||I;function bo(a,b){if((a[u]&&a[u]!==Z&&a[u]!=="loaded")||b[y]){return i}a[ba]=a[F]=e;return h}function W(a,b,c){c=!(!c);if(!c&&!(bo(a,b)))return;b[y]=h;for(var d in m){if(m[P](d)&&!(m[d][y]))return}bk=h;bn()}function bp(a){if(B(a[x])){a[x]();a[x]=e}}function bE(a,b){if(!bo(a,b))return;b[j]=h;A(function(){r[b[z]].removeChild(a);bp(b)},0)}function bF(a,b){if(a[u]===4){a[F]=G;b[j]=h;A(function(){bp(b)},0)}}function X(b,c,d,g,f,n){var o=b[z];A(function(){if("item"in r[o]){if(!r[o][0]){A(arguments.callee,25);return}r[o]=r[o][0]}var a=k.createElement(M);if(typeof d==q)a.type=d;if(typeof g==q)a.charset=g;if(B(f)){a[ba]=a[F]=function(){f(a,b)};a.src=c;if(bj){a.async=i}}r[o].insertBefore(a,(o===w?r[o].firstChild:e));if(typeof n==q){a.text=n;W(a,b,h)}},0)}function bq(a,b,c,d){T[a[N]]=h;X(a,b,c,d,W)}function br(a,b,c,d){var g=arguments;if(s&&a[j]==e){a[j]=i;X(a,b,bb,d,bE)}else if(!s&&a[j]!=e&&!a[j]){a[x]=function(){br.apply(e,g)}}else if(!s){bq.apply(e,g)}}function bs(a,b,c,d){var g=arguments,f;if(s&&a[j]==e){a[j]=i;f=a.xhr=(bd?new bd("Microsoft.XMLHTTP"):new p.XMLHttpRequest());f[F]=function(){bF(f,a)};f.open("GET",b);f.send("")}else if(!s&&a[j]!=e&&!a[j]){a[x]=function(){bs.apply(e,g)}}else if(!s){T[a[N]]=h;X(a,b,c,d,e,a.xhr.responseText);a.xhr=e}}function bt(a){if(typeof a=="undefined"||!a)return;if(a.allowDup==e)a.allowDup=l.dupe;var b=a.src,c=a.type,d=a.charset,g=a.allowDup,f=U(b,bD),n,o=bz(f);if(typeof d!=q)d=e;g=!(!g);if(!g&&((T[f]!=e)||(s&&m[f])||bA(f))){if(m[f]!=e&&m[f][j]&&!m[f][y]&&o){W(e,m[f],h)}return}if(m[f]==e)m[f]={};n=m[f];if(n[z]==e)n[z]=bC;n[y]=i;n[N]=f;J=h;if(!I&&bm&&o)bs(n,f,c,d);else if(!I&&bl)br(n,f,c,d);else bq(n,f,c,d)}function Y(a){if(t&&!I)K.push(a);if(!t||C)a()}function bu(a){var b=[],c;for(c=-1;++c<a.length;){if(S.call(a[c])===bx)b=b.concat(bu(a[c]));else b[b.length]=a[c]}return b}D={script:function(){be(V);var a=bu(arguments),b=D,c;if(bB){for(c=-1;++c<a.length;){if(B(a[c]))a[c]=a[c]();if(c===0){Y(function(){bt((typeof a[0]==q)?{src:a[0]}:a[0])})}else b=b.script(a[c]);b=b.wait()}}else{for(c=-1;++c<a.length;){if(B(a[c]))a[c]=a[c]()}Y(function(){for(c=-1;++c<a.length;){bt((typeof a[c]==q)?{src:a[c]}:a[c])}})}V=A(function(){s=i},5);return b},wait:function(a){be(V);s=i;if(!B(a))a=G;var b=H(t||J,l),c=b.trigger,d=function(){try{a()}catch(err){}c()};delete b.trigger;var g=function(){if(J&&!bk)bn=d;else d()};if(t&&!J)K.push(g);else Y(g);return b}};if(t){D.trigger=function(){var a,b=-1;while(a=K[++b])a();K=[]}}else D.trigger=G;return D}function bv(a){var b,c={},d={"UseCachePreload":"cache","UseLocalXHR":"xhr","UsePreloading":E,"AlwaysPreserveOrder":O,"AllowDuplicates":"dupe"},g={"AppendTo":z,"BasePath":"base"};for(b in d)g[b]=d[b];c.order=!(!v.order);for(b in g){if(g[P](b)&&v[g[b]]!=e)c[g[b]]=(a[b]!=e)?a[b]:v[g[b]]}for(b in d){if(d[P](b))c[d[b]]=!(!c[d[b]])}if(!c[E])c.cache=c.order=c.xhr=i;c.which=(c.which===w||c.which===L)?c.which:w;return c}p.$LAB={setGlobalDefaults:function(a){v=bv(a)},setOptions:function(a){return H(i,bv(a))},script:function(){return H().script.apply(e,arguments)},wait:function(){return H().wait.apply(e,arguments)}};(function(a,b,c){if(k[u]==e&&k[a]){k[u]="loading";k[a](b,c=function(){k.removeEventListener(b,c,i);k[u]=Z},i)}})("addEventListener","DOMContentLoaded")})(window);

// 'S' is the framework namespace (temporary)
S = {
    loaderChain: $LAB,
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
        var numScripts;
        var lastScript;
        var scriptPath;

        numScripts = scriptsToLoad.length;
        lastScript = scriptsToLoad[numScripts - 1];

        for (var i = 0; i < numScripts - 1; i++) {
            scriptPath = scriptsToLoad[i];
            this.loaderChain.script(scriptPath + this.cacheBust).wait();
        }

        // once the last script is loaded, run the callback
        this.loaderChain.script(lastScript + this.cacheBust).wait(callback);
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
        var scriptElements,
            scriptElt,
            srcAttr,
            i,
            frameworkVersionValue,
            frameworkRootValue,
            frameworkThemeValue,
            body,
            basePath,
            stylesheetPath;

        // set some defaults
        var frameworkRoot = S.defaultFrameworkRoot;
        var frameworkVersion = S.defaultFrameworkVersion;
        var frameworkTheme = S.defaultFrameworkTheme;

        // hide the body until everything is loaded
        body = document.getElementsByTagName('body')[0];
        body.style.visibility = 'hidden';

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
