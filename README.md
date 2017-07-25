neighborhood-pathfinder [![npm version](https://badge.fury.io/js/neighborhood-pathfinder.svg)](http://badge.fury.io/js/neighborhood-pathfinder) [![Build Status](https://travis-ci.org/chinedufn/neighborhood-pathfinder.svg?branch=master)](https://travis-ci.org/chinedufn/neighborhood-pathfinder)
===============

> Find a path from a start coordinate to an end coordinate in a grid using the A\* algorithm. You get to control the whether or not a neighboring grid nodes

## To Install

```sh
$ npm install --save neighborhood-pathfinder
```

## Background / Initial Motivation

I researched or tried many of the popular JavaScript pathfinding libraries, but none of them supported having walls between tiles and using values other than
`0` and `1` in order to encode different types of movement into one grid

For example.. Say we have the grid defined below.

```
0, 0, 0, 0,
1, 2, 0, 0,
0, 0, 0, 0
```

What if we want projectiles and flying creatures to be able to cross over a `2` tile but not a `1` tile, and walking creatures can't cross either?

With the libraries that I found my best bet would have been to use this as a template grid and then generate two grids from it, one for projectiles and one for walking creatures.

That wouldn't have been too much of a hassle though.. The real inspiration for this library was wanting to have "walls" or other blockers in between any two tiles, some of which blocked in one direction but not the other.

On top of this I wanted to be able to limit my search to not go outside of a certain bounds.

Specifically in my case - if a player is in the center of a map, I may not want them to be able to generate a path that goes too far outside of the current render distance.

I'm using this code in production so expect it to evolve as I run into pathing or performance edge cases.

## Benchmark

**Right now there is one benchmark for a scenario pretty specific to what I'm currently doing with this library.
We should add more. Feel free to PR one!**

```sh
npm run bench
```

### Output on my MacBook Pro Early 2015

CPU -> 3.1 Ghz Intel Core -7
Memory -> 16GB 1867 MHz DDR3

**Please do not assume that this library is fast enough for your needs until we add more benchmarks! **

```sh
# neighborhood-pathfinder [11, 11] to [63, 63] with very few obstacles 1000 times
ok ~314 ms (0 s + 314455773 ns)

# l1-path-finder [11, 11] to [63, 63] with very few obstacles 1000 times
ok ~16 ms (0 s + 15754404 ns)
```

```sh
# neighborhood-pathfinder [11, 11] to [63, 63] with very few obstacles 40000 times
ok ~12 s (11 s + 508525057 ns)

# l1-path-finder [11, 11] to [63, 63] with very few obstacles 40000 times
ok ~241 ms (0 s + 240734784 ns)
```

- [ ] Write a test to solve why running the same search twice returns null when we use `frontier.clear()`
- [ ] Look into path planning if switching to clear doesn't give us a big speed up

## Usage

```js
var exampleOpts = {
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

var path = weightedPathfinder.findPath(exampleOpts)
console.log(exampleOpts)
// [0, 0, 1, 1, 2, 2]
```

## API

### `pathfinder.findPath(options)` -> `path`

#### Options

#### options.start

```
var exampleStart = [0, 0]
```

The start coordinate within your grid

#### options.end

```
var exampleEnd = [2, 2]
```

The end coordinate of within your grid.

#### options.grid

```
var grid = [
  0, 0, 0, 0,
  0, 0, 0, 0
]
```

An array that represents your grid. You define the shape by passing in a gridWidth.

The first element is the `[0, 0]` coordinate of your grid.

TODO: Give tip on how to make the bottom left corner your `[0, 0]`

#### options.gridWidth

```
var grid = [
  0, 0, 0, 0,
  0, 0, 0, 0
]
```

If gridWidth is 4 then this is a 4x2 grid.

If gridWidth is 1 then this is a 1x8 grid.


#### options.allowDiagonal

Allow movement diagonally. If this is false we can only move north south east and west.

#### options.isNextTileTraversable

```js
// This function would make all tiles that have a value of 50
// traversable.
function (grid, currentTileIndex, nextTileIndex) {
  if (grid[nextTileIndex] === 50) {
    return true
  }
  return false
}
```

Given the current tile in the grid and the next tile, return whether or
not the current tile is able to move to the next time.

You can use this function to implement walls. You can also pass in
different functions for different entity's, allowing some entity's to
pass across tiles that might be blocked for others.

Note that this function runs on every neighboring tile that is explored,
so keep it light.

TODO: Benchmark

#### options.maxCost

The maximum cost before a neighbor will no longer be eligible to be explored.

The original tile is cost zero, and then each tile that is explored is `+1` cost
to the cost of the tile that it came from.

The cost is the number of steps that it takes to get to a tile.

#### options.maxDistance

TODO: Unimplemented

The maximum distance from the start tile that we will explore outwards
before giving up on finding it.

#### path

An array of pairs of grid coordinates.

```js
// example:
var path = [1, 0, 2, 0, 2, 1]
// Would mean start at [1, 0] -> then go to [2, 0] -> then go to [2, 1]
```

If no path was detected we return null

## TODO:

- [ ] Add comments and refactor
- [ ] Maximum distance away from start tile to explore while searching for end tile
- [ ] Usage notes
- [ ] API docs
- [ ] Benchmark
- [ ] Demo

## References

- [Red Blob Games Introduction to A\*](http://www.redblobgames.com/pathfinding/a-star/introduction.html)
  - This was how I learned how to implement A\*

## License

MIT
