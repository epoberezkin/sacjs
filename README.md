# sacjs
Generic n-way [Set Associative Cache](http://www.cs.umd.edu/class/sum2003/cmsc311/Notes/Memory/set.html) for node.js.


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

- assoc - cache associativity level (the number of slots per set). For any given key an item can be stored in any of the slots in the set. Higher associativity improves hit ratio but reduces cache performance.

- size - cache size (the number of sets of slots the cache will store). The total number of items the cache can store is `assoc * size`

- algorithm - eviction algorithm. Can be either 'lru' (least recently used), 'mru' (most recently used), 'lfu' (least frequently used), 'mfu' (most frequently used) or an object with three functions: `created`, `accessed` (passed slot) and evict (passed the set - the hash of slots). Implementations of eviction algorithms are in `algorithms.js` and `cache.spec.js`.

- serialize - custom key serialization algorithm. Should return the same string for the same key every time it is called.


## Cache statistics

Cache usage statistics are available in `stat` property of the cache instance. The `stat` object has the following properties:

- misses - the number of misses
- hits - the number of hits
- stored - the number of items that were stored in free slots
- replaced - the number of item that were replaced (different value for the same key)
- evicted - the number of items that were evicted
