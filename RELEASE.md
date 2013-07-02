# Release process for \<version\>

0. grunt test
1. Build web-ui-fw.
2. cp -a dist/* to the repository representing http://web-ui-fw.github.com/jqm/&lt;version&gt;. This should result in the following directory structure:

    http://web-ui-fw.github.com/jqm/&lt;version&gt;/web-ui-fw.js
    http://web-ui-fw.github.com/jqm/&lt;version&gt;/web-ui-fw.css
    etc.
3. Deploy the docs.
