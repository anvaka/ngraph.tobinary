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

  var labels = require('./lib/getLabels.js')(graph);
  saveLabels(labels);

  var linksBuffer = require('./lib/getLinksBuffer.js')(graph, labels);
  fs.writeFileSync(options.links, linksBuffer);
  console.log(graph.getLinksCount() + ' links saved to ' + options.links);

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
}
