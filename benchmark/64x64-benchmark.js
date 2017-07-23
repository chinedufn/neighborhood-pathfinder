var weightedPathfinder = require('../')

var ndarray = require('ndarray')
var createPlanner = require('l1-path-finder')

var grid = require('./64x64_fixture.js')

var bench = require('nanobench')

var numTimesToExecute = 1000
bench(`neighborhood-pathfinder [11, 11] to [63, 63] with very few obstacles ${numTimesToExecute} times`, function (b) {
  for (var i = 0; i < numTimesToExecute; i++) {
    var opts = {
      start: [11, 11],
      end: [63, 63],
      grid: grid,
      gridWidth: 64,
      gridHeight: 64
      // allowDiagonal: true,
      // dontCrossBlockedTiles: true
    }
    weightedPathfinder.findPath(opts)
  }

  b.end()
})

bench(`l1-path-finder [11, 11] to [63, 63] with very few obstacles ${numTimesToExecute} times`, function (b) {
  var maze = ndarray(grid, [64, 64])
  var planner = createPlanner(maze)
  var path = []
  for (var i = 0; i < numTimesToExecute; i++) {
    planner.search(11, 11, 63, 63, path)
  }

  b.end()
})
