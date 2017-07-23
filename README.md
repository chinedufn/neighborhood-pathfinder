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

## Usage

```js
```

## API

### `pathfinder.findPath(options)` -> `path`

#### Options

#### path

An array of pairs of grid coordinates.

```
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

## See Also

- [load-collada-dae](https://github.com/chinedufn/load-collada-dae)
- [skeletal-animation-system](https://github.com/chinedufn/skeletal-animation-system)
- [wavefront-obj-parser](https://github.com/chinedufn/wavefront-obj-parser)

## Credits

- [Ben Houston](https://clara.io/user/bhouston) for the [3d male figure model](https://clara.io/view/d49ee603-8e6c-4720-bd20-9e3d7b13978a/webgl)

## License

MIT
