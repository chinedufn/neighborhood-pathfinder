var defaultGetNeighbors = require('./default-get-neighbors.js')

module.exports = {
  findPath: findPath
}

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
    var neighbors = defaultGetNeighbors(current.tile, opts)

    if (current.tile[0] === opts.end[0] && current.tile[1] === opts.end[1]) {
      break
    }

    for (var i = 0; i < neighbors.length; i += 2) {
      var newCost = costSoFar[current.tile[0] + 'x' + current.tile[1]] + 1
      if (
        (
          !cameFrom[`${neighbors[i]}x${neighbors[i + 1]}`] ||
            costSoFar[neighbors[i] + 'x' + neighbors[i + 1]] > newCost
        ) &&
          (!opts.maxCost || newCost < opts.maxCost)
      ) {
        costSoFar[neighbors[i] + 'x' + neighbors[i + 1]] = newCost
        cameFrom[`${neighbors[i]}x${neighbors[i + 1]}`] = current.tile
        if (neighbors[i] === opts.end[0] && neighbors[i + 1] === opts.end[1]) {
          return calculatePath(opts.end)
        }
        frontier.push({tile: [neighbors[i], neighbors[i + 1]], cost: newCost})
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
}

function orthogonalHeuristic (start, end) {
  // Manhattan distance on a square grid
  return Math.abs(start.tile[0] - end[0]) + Math.abs(start.tile[1] - end[1]) + start.cost
}

function orthogonalAndDiagonalHeuristic (start, end) {
  return Math.max(Math.abs(start.tile[0] - end[0]), Math.abs(start.tile[1] - end[1])) +
    start.cost
}
