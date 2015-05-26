# ngraph.tobinary

Serialize ngraph.graph to binary format

# usage

``` js
// let's say you have ngraph.graph instance:
var graph = require('ngraph.generators').grid(10000, 10000);
var save = require('ngraph.tobinary');
save(graph);
```

This will produce three new files:

* `meta.json` - information about graph (e.g. number of edges/links, file names, serializer version, etc.)
* `labels.json` - a json file with array of node identifiers.
* `links.bin` - a binary file with compressed information about the graph.
See more details in the `links.bin format` section below


# links.bin format

This file stores entire graph. Each record in the file is Int32 written in little-endian
notation. Let's consider the following example:

`labels.json` content:

```
['a', 'b', 'c', 'd']
```

`links.bin` content (in numerical view, spaces are just for formatting):

```
-1 2 3 -2 4
```

The negative 1 identifies the first "source" node of the graph, and denotes 1 based index
of the element in the `labels.json` file. So in this case it is node `a`.

Following positive integers `2` and `3` mean that `a` is connected to `labels[2 - 1]`
and `labels[3 - 1]`. That is nodes `b` and `c` correspondingly.

Then we see `-2`. This means that there are no more connections for the node `a`,
and we should consider node `labels[2 - 1]` as the next "source" node. Subsequent
positive integers show connections for the node `b`. It is node `d` (`labels[4 - 1]`).

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.tobinary
```

# license

MIT
