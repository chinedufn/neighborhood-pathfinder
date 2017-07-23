module.exports = {
  findPath: findPath
}

var cycle = [
  // Above
  0, 1,
  // Below
  0, -1,
  // Left
  -1, 0,
  // Right
  1, 0,
  // Upper right
  1, 1,
  // Lower Right
  1, -1,
  // Lower left
  -1, -1,
  // Upper left
  -1, 1
]

/**
 * Use the A* search algorithm to find a path between start and end coordinate
 */
function findPath (opts) {
  var cameFrom = {}
  var startIndexInGrid = (opts.start[0] % opts.gridWidth) + (opts.start[1] * opts.gridWidth)
  var endTileIndexInGrid = (opts.end[0] % opts.gridWidth) + (opts.end[1] * opts.gridWidth)
  cameFrom[startIndexInGrid] = []
  var costSoFar = {}
  costSoFar[startIndexInGrid] = 0

  // TODO: After we have benchmarks see if we can find or make a faster implementation for our needs
  var Heap = require('heap')
  var frontier = new Heap(function heuristic (a, b) {
    if (opts.allowDiagonal) {
      return orthogonalAndDiagonalHeuristic(a, opts.end) - orthogonalAndDiagonalHeuristic(b, opts.end)
    } else {
      return orthogonalHeuristic(a, opts.end) - orthogonalHeuristic(b, opts.end)
    }
  })
  frontier.push({
    cost: 0,
    tile: opts.start
  })

  var current = frontier.pop()
  while (true) {
    // If the frontier is empty and we haven't yet found a path then there
    // is no valid path and we return null
    if (!current) {
      return null
    }

    var currentTile = current.tile
    var currentTileIndex = (currentTile[0] % opts.gridWidth) + (currentTile[1] * opts.gridWidth)

    if (currentTileIndex === endTileIndexInGrid) {
      break
    }

    function isNeighbor (x, y) {
      var potentialNeighborIndexInGrid = (x % opts.gridWidth) + (y * opts.gridWidth)
      if (
        // Potential neighbor is within the corners of the opts.grid
        potentialNeighborIndexInGrid > -1 && potentialNeighborIndexInGrid < opts.grid.length &&
          // Value of potentialNeighbor is equal to zero
          (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, potentialNeighborIndexInGrid)
      ) {
        return true
      }
    }

    for (var j = 0; j < 8; j += 2) {
      if (isNeighbor(currentTile[0] + cycle[j], currentTile[1] + cycle[j + 1])) {
        var path = addToFrontier(currentTile[0] + cycle[j], currentTile[1] + cycle[j + 1])
        if (path) { return path }
      }
    }

    if (opts.allowDiagonal) {
      for (var j = 8; j < 16; j += 2) {
        if (isNeighbor(currentTile[0] + cycle[j], currentTile[1] + cycle[j + 1]) && isDiagonalTile(cycle[j], cycle[j + 1])) {
          var path = addToFrontier(currentTile[0] + cycle[j], currentTile[1] + cycle[j + 1])
          if (path) { return path }
        }
      }
    }

    function addToFrontier (x, y) {
      var currentTileIndexInGrid = (currentTile[0] % opts.gridWidth) + (currentTile[1] * opts.gridWidth)
      var newCost = costSoFar[currentTileIndexInGrid] + 1
      var potentialNeighborIndexInGrid = (x % opts.gridWidth) + (y * opts.gridWidth)
      if (
        (
          !cameFrom[potentialNeighborIndexInGrid] ||
            costSoFar[potentialNeighborIndexInGrid] > newCost
        ) &&
          (!opts.maxCost || newCost < opts.maxCost)
      ) {
        costSoFar[potentialNeighborIndexInGrid] = newCost
        cameFrom[potentialNeighborIndexInGrid] = current.tile
        if (x === opts.end[0] && y === opts.end[1]) {
          return calculatePath(opts.end)
        }
        frontier.push({tile: [x, y], cost: newCost})
      }
    }

    current = frontier.pop()
  }

  function calculatePath (endTile) {
    var path = []
    while (endTile) {
      var endTileIndexInGrid = (endTile[0] % opts.gridWidth) + (endTile[1] * opts.gridWidth)
      // TODO: Make it so that we don't need this check
      if (endTile.length > 0) {
        // Pushing them backwards since we're reversing
        // TODO: If nodeSource is an array we will know the length and won't need to reverse
        path.push(endTile[1])
        path.push(endTile[0])
      }
      endTile = cameFrom[endTileIndexInGrid]
    }

    return path.reverse()
  }

  function isDiagonalTile (offsetX, offsetY) {
    var firstCrossedTileIndex = ((currentTile[0]) % opts.gridWidth) + ((currentTile[1] + offsetY) * opts.gridWidth)
    var secondCrossedTileIndex = ((currentTile[0] + offsetX) % opts.gridWidth) + ((currentTile[1]) * opts.gridWidth)
    if (
      !opts.dontCrossBlockedTiles ||
      (
        (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, firstCrossedTileIndex) &&
          (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, secondCrossedTileIndex)
      )
    ) {
      return true
    }
  }
}

function orthogonalHeuristic (start, end) {
  // Manhattan distance on a square grid
  return Math.abs(start.tile[0] - end[0]) + Math.abs(start.tile[1] - end[1]) + start.cost
}

function orthogonalAndDiagonalHeuristic (start, end) {
  return Math.max(Math.abs(start.tile[0] - end[0]), Math.abs(start.tile[1] - end[1])) +
    start.cost
}

function defaultIsNextTileTraversable (grid, currentTileIndex, nextTileIndex) {
  return !grid[nextTileIndex]
}
