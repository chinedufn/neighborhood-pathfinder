var weightedPathfinder = require('../')
var test = require('tape')

test('Finds path if path exists', function (t) {
  var opts = {
    start: [0, 0],
    end: [3, 0],
    grid: [
      0, 0, 0, 0,
      0, 0, 0, 0
    ],
    gridWidth: 4
  }
  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 0, 2, 0, 3, 0], 'Finds a basic path')
  t.end()
})

test('Aborts if no path from start to end exists', function (t) {
  var opts = {
    start: [0, 0],
    end: [3, 0],
    grid: [
      0, 1, 0, 0,
      1, 0, 0, 0
    ],
    gridWidth: 4
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, null, 'No path exists')

  t.end()
})

// You might use this to completely rule out a path if the movement
// cost is too great
test('Abort if all possible paths exceed maximum cost', function (t) {
  var opts = {
    start: [0, 0],
    end: [3, 0],
    grid: [
      0, 0, 0, 0,
      0, 0, 0, 0
    ],
    gridWidth: 4,
    maxCost: 2
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, null, 'Abort when path exceeds maximum number of steps')

  t.end()
})

test('Diagonal movement', function (t) {
  var opts = {
    start: [0, 0],
    end: [2, 1],
    grid: [
      0, 0, 0, 0,
      1, 1, 0, 0
    ],
    gridWidth: 4,
    allowDiagonal: true
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 0, 2, 1], 'Move diagonally')

  t.end()
})

test('Diagonal movement without crossing blocked tiles', function (t) {
  var opts = {
    start: [0, 0],
    end: [2, 1],
    grid: [
      0, 0, 1, 0,
      0, 0, 0, 0
    ],
    gridWidth: 4,
    allowDiagonal: true,
    dontCrossBlockedTiles: true
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 1, 2, 1], 'Move diagonal without crossing any blocked tiles')

  t.end()
})

test('Control the isTraversable function', function (t) {
  var opts = {
    start: [0, 0],
    end: [2, 2],
    grid: [
      0, 0, 1, 0,
      0, 10, 0, 0,
      0, 0, 0, 0
    ],
    gridWidth: 4,
    allowDiagonal: true,
    isNextTileTraversable: function (grid, currentTileIndex, nextTileIndex) {
      return !grid[nextTileIndex] || grid[nextTileIndex] === 10
    }
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 1, 2, 2], 'Tiles with value 10 have a cost of zero')

  t.end()
})
