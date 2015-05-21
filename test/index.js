var test = require('tap').test;
var createGraph = require('ngraph.graph');

test('it can get labels', function(t) {
  var graph = createGraph();
  graph.addLink('hello', 'world');
  var labels = require('../lib/getLabels.js')(graph);
  t.equals(labels.length, 2, 'two labels saved');
  t.ok(labels[0] === 'hello' || labels[0] === 'world', 'first label is here');
  t.ok(labels[1] === 'hello' || labels[1] === 'world', 'second label is here');
  t.ok(labels[0] !== labels[1], 'both label are valid');

  t.end();
});

test('it can get buffer', function(t) {
  var graph = createGraph();
  graph.addLink('hello', 'world');
  var labels = require('../lib/getLabels.js')(graph);
  var buffer = require('../lib/getLinksBuffer.js')(graph, labels);
  t.equals(buffer.length / 4, 2, 'Only two records in the buffer');
  var from = buffer.readInt32LE(0);
  t.ok(from < 0, 'First node is the source');
  t.equals(labels[-from - 1], 'hello');
  var to = buffer.readInt32LE(4);
  t.ok(to > 0, 'Second node is the destination');
  t.equals(labels[to - 1], 'world');

  t.end();
});
