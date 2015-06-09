'use strict';

module.exports = equal;


/**
 * equal tests two arrays/objects on strict/deep equality
 * @param  {Any} a
 * @param  {Any} b
 * @return {Boolean} true if a and b are deeply equal
 */
function equal(a, b) {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++)
      if (!equal(a[i], b[i])) return false;
    return true;
  }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var keys = Object.keys(a);
    if (!equal(keys, Object.keys(b))) return false;
    for (var i = 0; i < keys.length; i++)
      if (!equal(a[keys[i]], b[keys[i]])) return false;
    return true;
  }

  return false;
}
