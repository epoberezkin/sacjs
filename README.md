# sacjs
Generic n-way [Set Associative Cache](http://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Memory/set.html) for node.js.

[![Build Status](https://travis-ci.org/epoberezkin/sacjs.svg?branch=master)](https://travis-ci.org/epoberezkin/sacjs)
[![npm version](https://badge.fury.io/js/sacjs.svg)](https://www.npmjs.com/package/sacjs)
[![Coverage Status](https://coveralls.io/repos/epoberezkin/sacjs/badge.svg?branch=master&service=github)](https://coveralls.io/github/epoberezkin/sacjs?branch=master)


## Install

```
npm install sacjs
```


## Usage

```JavaScript
var Cache = require('sacjs');

var cache = new Cache({ assoc: 4, size: 10000, algorithm: 'lru' });

cache.put(key, data);

// ...

var data = cache.get(key);

// ...

cache.del(key);

// ...

cache.clear();
```

`key` used to store data in the cache can be any scalar or object/array. You can supply `serialize` option that will be used to convert keys to strings, otherwise [json-stable-stringify](https://github.com/substack/json-stable-stringify) will be used. Serialized keys are hashed using [Dan Bernstein's algorithm](http://www.cse.yorku.ca/~oz/hash.html#djb2).


## Options

Options object is passed to cache constructor.

- _assoc_ - cache associativity level (the number of slots per set). For any given key an item can be stored in any of the slots in the set. Higher associativity improves hit ratio but reduces cache performance.

- _size_ - cache size (the number of sets of slots the cache will store). The total number of items the cache can store is `assoc * size`

- _algorithm_ - eviction algorithm. Can be:
    - 'lru' (least recently used)
    - 'mru' (most recently used)
    - 'lfu' (least frequently used)
    - 'mfu' (most frequently used)
    - object with three functions: `created`, `accessed` (passed the slot) and `evict` (passed the set - the hash of slots). Implementations of eviction algorithms are in `algorithms.js` and `cache.spec.js`.

- _serialize_ - custom key serialization algorithm. Should return the same string for the same key every time it is called. By default, [json-stable-stringify](https://github.com/substack/json-stable-stringify) is used. Pass `false` to skip serializing (if all keys are strings or numbers).


## Cache statistics

Cache usage statistics are available in `stat` property of the cache instance. The `stat` object has the following properties:

- misses - the number of misses
- hits - the number of hits
- stored - the number of items that were stored in free slots
- replaced - the number of item that were replaced (different value for the same key)
- evicted - the number of items that were evicted
