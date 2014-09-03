# Release process for \<version\>

0. npm install
0. grunt test
0. Build web-ui-fw with ```grunt release```.
0. Build web-ui-fw API docs and copy the mirror to dist/api-docs.
0. ```cp -a dist/ <web-ui-fw.github.com repo path>/jqm/<version>```
0. git tag <version> and push
0. Go to the API docs repo, git tag <version> and push for the API docs as well
0. Go to the web-ui-fw.github.com repo
0. cd jqm
0. ln -sf <version> latest
0. git add jqm/<version>
0. git commit -a and push
