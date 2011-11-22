/*
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 * 
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 */

// Debugging functions
//
// To add a rudimentary console to a page, add the following HTML. Change it to fit your needs, but do not change the IDs
// of the two divs, nor their relationship to each other (#console is immediately inside #consoleContainer).
//   <div id="consoleContainer" style="width: 480px; height: 200px; border: 1px solid black;" data-scroll="y">
//    <div id="console"></div>
//   </div>
// To log to this console, do
//   myConsoleLog("some string");
// This will also send the string to console.log();

/*
function dumpObject(obj) {
  var str;
  if (undefined === obj) {
    console.log(obj);
    str = "undefined";
  }
  else {
    var isEmpty = true;
    for (key in obj) {
      str += " " + key + "\n";
      console.log("  " + key);
      isEmpty = false;
    }
    if (isEmpty) {
      str = "{}";
      console.log("{}");
    }
  }
  return str;
}

function stackTrace() {
  var callstack = [];
  var isCallstackPopulated = false;
  try {
    i.dont.exist+=0; //doesn't exist- that's the point
  } catch(e) {
    if (e.stack) { //Firefox
      var lines = e.stack.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          callstack.push(lines[i]);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
    else if (window.opera && e.message) { //Opera
      var lines = e.message.split('\n');
      for (var i=0, len=lines.length; i<len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          var entry = lines[i];
          //Append next line also since it has the file info
          if (lines[i+1]) {
            entry += ' at ' + lines[i+1];
            i++;
          }
          callstack.push(entry);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
  }
  if (!isCallstackPopulated) { //IE and Safari
    var currentFunction = arguments.callee.caller;
    while (currentFunction) {
      var fn = currentFunction.toString();
      var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
      callstack.push(fn);
      currentFunction = currentFunction.caller;
    }
  }
  return callstack;
}

function myConsoleLog(str) {
  console.log(str);
  $("#console").append(str + "<br/>\n");
  if ($("#consoleContainer").data()["scrollview"] !== undefined)
    $("#consoleContainer").scrollview("scrollTo", 0, -Math.max(0, $("#console").height() - $("#consoleContainer").height()));
}
*/

// Ensure that the given namespace is defined. If not, define it to be an empty object.
// This is kinda like the mkdir -p command.

function ensureNS(ns) {
    var nsAr = ns.split("."),
    nsSoFar = "";

    for (var Nix in nsAr) {
        nsSoFar = nsSoFar + (Nix > 0 ? "." : "") + nsAr[Nix];
        eval (nsSoFar + " = " + nsSoFar + " || {};");
    }
}
