var fs = require('fs');
var path = require('path');

var matches = [];
var outputFile = 'outputDev.txt';
fs.writeFileSync(outputFile, 'File | Snippet \n');

function inspectFile(file) {
  var regexp = /@mlp/g;
  var match;
  var contentsNewLine = fs.readFileSync(file, 'utf8');
  var contents = contentsNewLine.replace(/\r?\n|\r/g, " ").replace("  ", "");
  
  while ((match = regexp.exec(contents)) != null) {
    console.log('Match: ' + file + '| ' + contents.substr(match.index-100, 200));
    matches.push(match.index);
    fs.appendFileSync(outputFile,
      file + '| ' + contents.substr(match.index-100, 200) + '\n'
      );
  }
}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          inspectFile(file);
          results.push(file);
          next();
        }
      });
    })();
  });
};

walk('./appian-package-examples/Trader-Master-Dev/', function(err, results) {
  if (err) throw err;
  // console.log(results);
  console.log(matches);
});
