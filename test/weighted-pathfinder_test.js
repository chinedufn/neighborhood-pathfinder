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
    gridWidth: 4,
    getNeighbors: weightedPathfinder.getOrthoganalNeighbors,
    heuristic: weightedPathfinder.orthagonalHeuristic
  }
  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 0, 2, 0, 3, 0])
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
    gridWidth: 4,
    getNeighbors: weightedPathfinder.getOrthoganalNeighbors,
    heuristic: weightedPathfinder.orthagonalHeuristic
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, null)

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
    maxCost: 2,
    getNeighbors: weightedPathfinder.getOrthoganalNeighbors,
    heuristic: weightedPathfinder.orthagonalHeuristic
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, null)

  t.end()
})

test('Diagonal movement', function (t) {
  var opts = {
    start: [0, 0],
    end: [2, 1],
    grid: [
      0, 0, 0, 0,
      0, 0, 0, 0
    ],
    gridWidth: 4,
    getNeighbors: weightedPathfinder.getOrthogonalAndDiagonalNeighbors,
    heuristic: weightedPathfinder.orthogonalAndDiagonalHeuristic
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 0, 2, 1])

  t.end()
})

test('Diagonal movement without crossing blocked tiles', function (t) {
  console.log(`ok



              `)
  var opts = {
    start: [0, 0],
    end: [2, 1],
    grid: [
      0, 0, 1, 0,
      0, 0, 0, 0
    ],
    gridWidth: 4,
    getNeighbors: weightedPathfinder.getOrthogonalAndDiagonalNeighbors,
    heuristic: weightedPathfinder.orthogonalAndDiagonalHeuristic,
    dontCrossAboveCost: 0
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 1, 2, 1])

  t.end()
})

/*
test('Control the cost function', function (t) {
  var opts = {
    start: [0, 0],
    end: [2, 1],
    grid: [
      0, 0, 1, 0,
      0, 10, 0, 0
    ],
    gridWidth: 4,
    getNeighbors: weightedPathfinder.getOrthogonalAndDiagonalNeighbors,
    heuristic: weightedPathfinder.orthogonalAndDiagonalHeuristic,
    dontCrossAboveCost: 0,
    calculateCost: function (grid, currentTileIndex, nextTileIndex) {
      return grid[nextTileIndex] === 10 ? 0 : grid[nextTileIndex]
    }
  }

  var path = weightedPathfinder.findPath(opts)

  t.deepEqual(path, [0, 0, 1, 0, 2, 1], 'Tiles with value 10 have a cost of zero')

  t.end()
})
*/
