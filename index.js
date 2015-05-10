var merge = require('ngraph.merge');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
module.exports = save;

function save(graph, options) {
  options = merge(options, {
    outDir: '.',
    labels: 'labels.json',
    meta: 'meta.json',
    links: 'links.bin'
  });

  fixPaths();

  var labels = getLabels(graph);
  saveLabels(labels);
  saveLinks(graph, labels);
  saveMeta();

  function fixPaths() {
    if (!fs.existsSync(options.outDir)) {
      mkdirp.sync(options.outDir);
    }
    options.labels = path.join(options.outDir, options.labels);
    options.meta = path.join(options.outDir, options.meta);
    options.links = path.join(options.outDir, options.links);
  }

  function saveMeta() {
    var meta = getMetaInfo();
    fs.writeFileSync(options.meta, JSON.stringify(meta), 'utf8');
    console.log('Meta information saved to ' + options.meta);
  }

  function getMetaInfo() {
    return {
      date: +new Date(),
      nodeCount: graph.getNodesCount(),
      linkCount: graph.getLinksCount(),
      nodeFile: options.labels,
      linkFile: options.links,
      version: require(path.join(__dirname, 'package.json')).version
    };
  }

  function saveLabels(labels) {
    fs.writeFileSync(options.labels, JSON.stringify(labels), 'utf8');
    console.log(labels.length + ' ids saved to ' + options.labels);
  }

  function getLabels(graph) {
    var labels = [];
    graph.forEachNode(saveNode);

    return labels;

    function saveNode(node) {
      labels.push(node.id);
    }
  }

  function saveLinks(graph, labels) {
    var nodeMap = Object.create(null);

    labels.forEach(function(element, i) {
      // +1 to avoid 0 uncertainty
      nodeMap[element] = i + 1;
    });

    var linksCount = graph.getLinksCount();
    var buf = new Buffer((labels.length + linksCount) * 4);
    var idx = 0;
    graph.forEachNode(function(node) {
      var startWriten = false;
      var start = nodeMap[node.id];
      graph.forEachLinkedNode(node.id, saveLink, true);

      function saveLink(node) {
        if (!startWriten) {
          startWriten = true;
          buf.writeInt32LE(-start, idx);
          idx += 4;
        }
        var other = nodeMap[node.id];

        buf.writeInt32LE(other, idx);
        idx += 4;
      }
    });
    fs.writeFileSync(options.links, buf.slice(0, idx));
    console.log(linksCount + ' links saved to ' + options.links);
  }
}
