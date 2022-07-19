module.exports = getLinksBuffer;

function getLinksBuffer(graph, labels) {
  var nodeMap = Object.create(null);

  labels.forEach(function(element, i) {
    // +1 to avoid 0 uncertainty
    nodeMap[element] = i + 1;
  });

  var linksCount = graph.getLinksCount();
  var buf = Buffer.alloc((labels.length + linksCount) * 4);
  var idx = 0;

  graph.forEachNode(function(node) {
    var startWritten = false;
    var start = nodeMap[node.id];
    graph.forEachLinkedNode(node.id, saveLink, true);

    function saveLink(node) {
      if (!startWritten) {
        startWritten = true;
        buf.writeInt32LE(-start, idx);
        idx += 4;
      }
      var other = nodeMap[node.id];

      buf.writeInt32LE(other, idx);
      idx += 4;
    }
  });

  return buf.slice(0, idx);
}
