var assert = require('assert'),
    api = require("../"),
    v = api.internal.Visvalingam;

function testAngle(deg) {
  var rad = deg / 180 * Math.PI;
  var ax = 1,
      ay = bx = by = 0,
      cx = Math.cos(rad),
      cy = Math.sin(rad);
  var a = api.geom.triangleArea(ax, ay, bx, by, cx, cy);
  var cos = api.geom.cosine(ax, ay, bx, by, cx, cy);
  var w = v.weight(cos);
  // console.log(deg + "\t" + a.toFixed(4) + "\t" + w.toFixed(4) + "\t" + (a * w).toFixed(4));
}

describe("mapshaper-visvalingam.js", function() {

  describe("standardMetric()", function() {
    it ("uses 2D triangle area", function() {
      var coords = [0, 0, 1, 2, 4, 1];
      assert.equal(v.standardMetric.apply(null, coords),
        api.geom.triangleArea.apply(null, coords));
    })
  })

  describe("Weight tests", function() {
    for (var a=5; a<180; a+= 5) {
      testAngle(a);
    }
  })

  describe("standardMetric3D()", function() {
    it ("uses 3D triangle area", function() {
      var coords = [0, 0, 2, 1, 2, 8, 4, 1, -5];
      assert.equal(v.standardMetric3D.apply(null, coords),
        api.geom.triangleArea3D.apply(null, coords));
    })
  })

  describe("weightedMetric()", function() {
    it ("is equal to or greater than standard metric for oblique-angle triangles", function() {
      function expectGE(coords) {
        assert(v.weightedMetric.apply(null, coords) >=
          v.standardMetric.apply(null, coords));
      }
      expectGE([1, 0, 2, 5, 1, 8]);
    })

    it ("is equal to standard metric for right-angle triangles", function() {
      function expectEqual(coords) {
        assert(v.weightedMetric.apply(null, coords) ==
          v.standardMetric.apply(null, coords));
      }
      expectEqual([0, 0, 1, 1, 2, 0]);
      expectEqual([1, 0, 1, 5, 5, 5]);
    })

    it ("is less than standard metric for acute-angle triangles", function() {
      function expectLesser(coords) {
        assert.ok(v.weightedMetric.apply(null, coords) <
          v.standardMetric.apply(null, coords));
      }
      expectLesser([0, 0, 0, 3, 1, 0]);
      expectLesser([0, 0, 1, Math.sqrt(2), 2, 0]);
    })

    it ("handles collapsed triangles without freaking out", function() {
      assert.equal(v.weightedMetric.apply(null, [1, 1, 1, 1, 2, 3]), 0)
      assert.equal(v.weightedMetric.apply(null, [1, 1, 2, 3, 1, 1]), 0)
      assert.equal(v.weightedMetric.apply(null, [2, 3, 1, 1, 1, 1]), 0)
      assert.equal(v.weightedMetric.apply(null, [1, 1, 1, 1, 1, 1]), 0)
    })
  })

  describe("weightedMetric3D()", function() {
    it ("is same as weightedMetric when one dimension is axis-aligned", function() {
      assert.equal(v.weightedMetric3D(0, 0, 9, 1, 8, 9, 2, 1, 9),
          v.weightedMetric(0, 0, 1, 8, 2, 1));
      assert.equal(v.weightedMetric3D(9, 0, 0, 9, 1, 8, 9, 2, 0),
          v.weightedMetric(0, 0, 1, 8, 2, 0));
      assert.equal(v.weightedMetric3D(0, 9, 0, 1, 9, 8, 2, 9, 0),
          v.weightedMetric(0, 0, 1, 8, 2, 0));
    })
  })
})