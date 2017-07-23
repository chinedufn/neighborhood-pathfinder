var weightedPathfinder = require('../')
var grid = require('./64x64_fixture.js')

var opts = {
  start: [11, 11],
  end: [63, 63],
  grid: grid,
  gridWidth: 64,
  allowDiagonal: true,
  dontCrossBlockedTiles: true
}
var path = weightedPathfinder.findPath(opts)
console.log(path)
