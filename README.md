# Web UI Framework

## Using the repository
0. Clone the repository into a path accessible through a Web server
1. Install grunt via [node](http://nodejs.org/): As root: ```npm install -g grunt```
2. From the repository's root directory, run ```npm install```

## Running unit tests
0. Install [phantomjs](http://phantomjs.org/) 1.8.0 and make sure phantomjs is in your PATH
1. run ```JUNIT_OUTPUT=build/test-results ROOT_DOMAIN=http://localhost/nix/web-ui-fw/ grunt test``` where ```ROOT_DOMAIN``` is the root of the repository as seen through your Web server. The URL for ```ROOT_DOMAIN``` must end in a ```/```.
