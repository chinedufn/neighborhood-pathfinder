// TODO: After we have benchmarks see if we can find or make a faster implementation for our needs
var createHeap = require('simple-heap')
var frontier = createHeap(64 * 64)

module.exports = {
  findPath: findPath
}

var path
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

var globalEstimateDistance

/**
 * Use the A* search algorithm to find a path between start and end coordinate
 */
function findPath (opts) {
  var cameFrom = {}
  var startIndexInGrid = (opts.start[0] % opts.gridWidth) + (opts.start[1] * opts.gridWidth)
  var endTileIndexInGrid = (opts.end[0] % opts.gridWidth) + (opts.end[1] * opts.gridWidth)
  var costSoFar = {}
  var estimatedDistanceFromEnd = {}
  costSoFar[startIndexInGrid] = 0
  cameFrom[startIndexInGrid] = -1
  var path

  if (opts.allowDiagonal) {
    globalEstimateDistance = estimateDiagonalDistance
  } else {
    globalEstimateDistance = estimateNonDiagonalDistance
  }

  frontier.clear()
  frontier.put(startIndexInGrid, 0)
  estimatedDistanceFromEnd[startIndexInGrid] = globalEstimateDistance(opts.start[0], opts.start[1], opts.end)

  var currentTileIndex = frontier.pop()
  while (true) {
    // If the frontier is empty and we haven't yet found a path then there
    // is no valid path and we return null
    if (currentTileIndex === -1) {
      return null
    }

    // TODO: Just use tileX and tileY direct
    var current = {
      tileX: currentTileIndex % opts.gridWidth,
      tileY: Math.floor(currentTileIndex / opts.gridWidth)
    }
    if (currentTileIndex === endTileIndexInGrid) {
      break
    }

    for (var j = 0; j < 8; j += 2) {
      if (isNeighbor(current.tileX + cycle[j], current.tileY + cycle[j + 1], opts, currentTileIndex)) {
        path = addToFrontier(current.tileX + cycle[j], current.tileY + cycle[j + 1], current, costSoFar, cameFrom, opts, frontier, endTileIndexInGrid)
        if (path) { return path }
      }
    }

    if (opts.allowDiagonal) {
      for (var k = 8; k < 16; k += 2) {
        if (isNeighbor(current.tileX + cycle[k], current.tileY + cycle[k + 1], opts, currentTileIndex) && isDiagonalTile(current, currentTileIndex, opts, cycle[k], cycle[k + 1])) {
          path = addToFrontier(current.tileX + cycle[k], current.tileY + cycle[k + 1], current, costSoFar, cameFrom, opts, frontier, endTileIndexInGrid)
          if (path) { return path }
        }
      }
    }

    currentTileIndex = frontier.pop()
  }
}

function isNeighbor (x, y, opts, currentTileIndex) {
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

function addToFrontier (x, y, current, costSoFar, cameFrom, opts, frontier, endTileIndexInGrid) {
  var currentTileIndexInGrid = (current.tileX % opts.gridWidth) + (current.tileY * opts.gridWidth)
  var newCost = costSoFar[currentTileIndexInGrid] + 1
  var estimatedDistanceFromEnd = globalEstimateDistance(x, y, opts.end)
  var potentialNeighborIndexInGrid = (x % opts.gridWidth) + (y * opts.gridWidth)
  if (
    (
      (!cameFrom[potentialNeighborIndexInGrid] && cameFrom[potentialNeighborIndexInGrid] !== 0) ||
        costSoFar[potentialNeighborIndexInGrid] > newCost
    ) &&
      (!opts.maxCost || newCost < opts.maxCost)
  ) {
    costSoFar[potentialNeighborIndexInGrid] = newCost
    cameFrom[potentialNeighborIndexInGrid] = currentTileIndexInGrid
    if (potentialNeighborIndexInGrid === endTileIndexInGrid) {
      return calculatePath(cameFrom, opts, endTileIndexInGrid)
    }
    frontier.put(potentialNeighborIndexInGrid, newCost + estimatedDistanceFromEnd)
  }
}

function estimateNonDiagonalDistance (startX, startY, end) {
  // Manhattan distance on a square grid
  return Math.abs(startX - end[0]) + Math.abs(startY - end[1])
}

function estimateDiagonalDistance (startX, startY, end) {
  return Math.max(Math.abs(startX - end[0]), Math.abs(startY - end[1]))
}

function defaultIsNextTileTraversable (grid, currentTileIndex, nextTileIndex) {
  return !grid[nextTileIndex]
}

function calculatePath (cameFrom, opts, endTileIndex) {
  path = []
  var slot = 0
  while (endTileIndex !== -1) {
    // Push y (Since we're reversing we start backwards)
    path[slot] = Math.floor(endTileIndex / opts.gridWidth)
    // Push x
    path[slot + 1] = endTileIndex % opts.gridWidth
    endTileIndex = cameFrom[endTileIndex]
    slot += 2
  }

  // TODO: No reverse. Know the length ahead of time and write to array backwards [pref]
  return path.reverse()
}

function isDiagonalTile (current, currentTileIndex, opts, offsetX, offsetY) {
  var firstCrossedTileIndex = ((current.tileX) % opts.gridWidth) + ((current.tileY + offsetY) * opts.gridWidth)
  var secondCrossedTileIndex = ((current.tileX + offsetX) % opts.gridWidth) + ((current.tileY) * opts.gridWidth)
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
