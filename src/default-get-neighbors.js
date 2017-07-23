module.exports = defaultGetNeighbors

function defaultGetNeighbors (currentTile, opts) {
  var lowestRow = 0
  var highestRow = opts.grid.length / opts.gridWidth - 1
  var lowestColumn = 0
  var highestColumn = opts.gridWidth - 1

  var acceptedIndices = {}
  var currentTileIndex = (currentTile[0] % opts.gridWidth) + (currentTile[1] * opts.gridWidth)

  var potentialNeighbors = [
    // Above
    currentTile[0], currentTile[1] + 1,
    // Below
    currentTile[0], currentTile[1] - 1,
    // Left
    currentTile[0] - 1, currentTile[1],
    // Right
    currentTile[0] + 1, currentTile[1]
  ]

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

  function pushDiagonalTile (offsetX, offsetY) {
    var firstCrossedTileIndex = ((currentTile[0]) % opts.gridWidth) + ((currentTile[1] + offsetY) * opts.gridWidth)
    var secondCrossedTileIndex = ((currentTile[0] + offsetX) % opts.gridWidth) + ((currentTile[1]) * opts.gridWidth)
    if (!opts.dontCrossBlockedTiles) {
      potentialNeighbors.push(currentTile[0] + offsetX)
      potentialNeighbors.push(currentTile[1] + offsetY)
    } else if (
      (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, firstCrossedTileIndex) &&
      (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, secondCrossedTileIndex)
    ) {
      potentialNeighbors.push(currentTile[0] + offsetX)
      potentialNeighbors.push(currentTile[1] + offsetY)
    }
  }

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
                  (opts.isNextTileTraversable || defaultIsNextTileTraversable)(opts.grid, currentTileIndex, potentialNeighborIndexInGrid)
        )
    ) {
      acceptedIndices[index] = true
      return true
    }
  })
}

function defaultIsNextTileTraversable (grid, currentTileIndex, nextTileIndex) {
  return !grid[nextTileIndex]
}
