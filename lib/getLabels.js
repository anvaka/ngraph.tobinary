/**
 * Gets all labels (i.e. node ids) as array, sorted in the `forEachNode()` order
 */
module.exports = getLabels;

function getLabels(graph) {
  var labels = [];
  graph.forEachNode(saveNode);

  return labels;

  function saveNode(node) {
    labels.push(node.id);
  }
}
