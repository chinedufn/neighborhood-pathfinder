module.exports = {
  getNeighbors: getOrthoganalNeighbors,
  heuristic: heuristic
}

function getOrthoganalNeighbors (tile, opts) {
  var lowestRow = 0
  var highestRow = opts.grid.length / opts.gridWidth - 1
  var lowestColumn = 0
  var highestColumn = opts.gridWidth - 1

  var acceptedIndices = {}

  var potentialNeighbors = [
    tile[0], tile[1] + 1,
    tile[0], tile[1] - 1,
    tile[0] - 1, tile[1],
    tile[0] + 1, tile[1]
  ]
  return potentialNeighbors
  .filter(function (potentialNeighbor, index) {
    // If this is an off number index and the even number index
    // right before it was accepted then this tile is accepted
    if (index % 2) {
      return acceptedIndices[index - 1]
    }

    var potentialNeighborIndexInGrid = (potentialNeighbor % opts.gridWidth) + (potentialNeighbors[index + 1] * opts.gridWidth)
    if (
      // If this is an off number index and the even number index
      // right before it was accepted then this tile is accepted
      (index % 2 && acceptedIndices[index - 1]) ||
        (
          // Potential neighbor is within the corners of the opts.grid
          potentialNeighbor >= lowestColumn &&
            potentialNeighbors[index + 1] >= lowestRow &&
              potentialNeighbor <= highestColumn &&
                potentialNeighbors[index + 1] <= highestRow &&
                  // Value of potentialNeighbor is equal to zero
                  opts.grid[potentialNeighborIndexInGrid] === 0
        )
    ) {
      acceptedIndices[index] = true
      return true
    }
  })
}

function heuristic (a, b) {
  // Manhattan distance on a square grid
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + a.cost
}
