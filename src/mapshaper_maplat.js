/* @requires
mapshaper-segment-intersection
mapshaper-path-utils
*/

api.internal = internal;
this.mapshaper = api;

// Expose internal objects for testing
utils.extend(api.internal, {
  ArcCollection: ArcCollection,
  ArcIter: ArcIter
});

if (typeof define === "function" && define.amd) {
    //define("mapshaper", api);
    define([], function() {
        return api;
    });
} else if (typeof module === "object" && module.exports) {
    module.exports = api;
}