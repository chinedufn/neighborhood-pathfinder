var weightedPathfinder = require('../')

var ndarray = require('ndarray')
var createPlanner = require('l1-path-finder')

var grid = require('./64x64_fixture.js')

var bench = require('nanobench')

var numTimesToExecute = 1000

var opts = {
  start: [11, 11],
  end: [63, 63],
  grid: grid,
  gridWidth: 64
  // allowDiagonal: true,
  // dontCrossBlockedTiles: true
}
bench(`neighborhood-pathfinder [11, 11] to [63, 63] with very few obstacles ${numTimesToExecute} times`, function (b) {
  for (var i = 0; i < numTimesToExecute; i++) {
    weightedPathfinder.findPath(opts)
  }

  b.end()
})

var maze = ndarray(grid, [64, 64])
var planner = createPlanner(maze)
var path = []
bench(`l1-path-finder [11, 11] to [63, 63] with very few obstacles ${numTimesToExecute} times`, function (b) {
  for (var i = 0; i < numTimesToExecute; i++) {
    path.length = 0
    planner.search(11, 11, 63, 63, path)
  }

  b.end()
})
