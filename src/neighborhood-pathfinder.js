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
  cameFrom[`${opts.start[0]}x${opts.start[1]}`] = []
  var costSoFar = {}
  costSoFar[`${opts.start[0]}x${opts.start[1]}`] = 0

  // TODO: After we have benchmarks see if we can find or make a faster implementation for our needs
  var Heap = require('heap')
  var frontier = new Heap(function (a, b) {
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

    if (current.tile[0] === opts.end[0] && current.tile[1] === opts.end[1]) {
      break
    }

    var lowestRow = 0
    var highestRow = opts.grid.length / opts.gridWidth - 1
    var lowestColumn = 0
    var highestColumn = opts.gridWidth - 1

    var acceptedIndices = {}
    var currentTileIndex = (currentTile[0] % opts.gridWidth) + (currentTile[1] * opts.gridWidth)

    function isNeighbor (x, y) {
      var potentialNeighborIndexInGrid = (x % opts.gridWidth) + (y * opts.gridWidth)
      if (
          (
            // Potential neighbor is within the corners of the opts.grid
            x >= lowestColumn &&
              y >= lowestRow &&
                x <= highestColumn &&
                  y <= highestRow &&
                    // Value of potentialNeighbor is equal to zero
                    (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, potentialNeighborIndexInGrid)
          )
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

    var potentialNeighbors = []
    if (opts.allowDiagonal) {
      // Upper right
      pushDiagonalTile(1, 1)
      // Lower Right
      pushDiagonalTile(1, -1)
      // Lower left
      pushDiagonalTile(-1, -1)
      // Upper left
      pushDiagonalTile(-1, 1)
    }

    var neighbors = potentialNeighbors
    .filter(function (potentialNeighbor, index) {
      // If this is an off number index and the even number index
      // right before it was accepted then this tile is accepted
      if (index % 2) {
        return acceptedIndices[index - 1]
      }

      if (
        // If this is an off number index and the even number index
        // right before it was accepted then this tile is accepted
        (index % 2 && acceptedIndices[index - 1]) ||
          (
            isNeighbor(potentialNeighbor, potentialNeighbors[index + 1])
          )
      ) {
        acceptedIndices[index] = true
        return true
      }
    })

    for (var i = 0; i < neighbors.length; i += 2) {
      var path = addToFrontier(neighbors[i], neighbors[i + 1])
      if (path) { return path }
    }

    function addToFrontier (x, y) {
      var newCost = costSoFar[current.tile[0] + 'x' + current.tile[1]] + 1
      if (
        (
          !cameFrom[x + 'x' + y] ||
            costSoFar[x + 'x' + y] > newCost
        ) &&
          (!opts.maxCost || newCost < opts.maxCost)
      ) {
        costSoFar[x + 'x' + y] = newCost
        cameFrom[x + 'x' + y] = current.tile
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
      // TODO: Make it so that we don't need this check
      if (endTile.length > 0) {
        // Pushing them backwards since we're reversing
        // TODO: If nodeSource is an array we will know the length and won't need to reverse
        path.push(endTile[1])
        path.push(endTile[0])
      }
      endTile = cameFrom[endTile[0] + 'x' + endTile[1]]
    }

    return path.reverse()
  }

  function pushDiagonalTile (offsetX, offsetY) {
    if (isDiagonalTile(offsetX, offsetY)) {
      potentialNeighbors.push(currentTile[0] + offsetX)
      potentialNeighbors.push(currentTile[1] + offsetY)
    }
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
