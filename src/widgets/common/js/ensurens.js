/*
function dumpObject(obj) {
  if (undefined === obj)
    console.log(obj);
  else {
    var isEmpty = true;
    for (key in obj) {
      console.log("  " + key);
      isEmpty = false;
    }
    if (isEmpty)
      console.log("{}");
  }
}
*/

/*
 * Ensure that the given namespace is defined. If not, define it to be an empty object.
 * This is kinda like the mkdir -p command.
 */
function ensureNS(ns) {
  var nsAr = ns.split("."),
  nsSoFar = "";

  for (var Nix in nsAr) {
    nsSoFar = nsSoFar + (Nix > 0 ? "." : "") + nsAr[Nix];
    eval (nsSoFar + " = " + nsSoFar + " || {};");
  }
}
