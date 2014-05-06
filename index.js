var map = require('map-stream');
var gutil = require('gulp-util');
var hamlc = require('haml-coffee');
var path = require('path');

module.exports = function(options) {
  if(!options) options = {};
  if(!options.ext) options.ext = '.html';

  //var htmlescape = function(input) {
    //input = input.replace('</script>', '</scr" + "ipt>');
    //input = JSON.stringify(input) + ';';
    //return input;
  //};

  //var wrapIt = function(input, options) {
      //input = options.namespace + "['" + options.name + "'] = " + input;
      //input = '\n' + input + '\n';
      //return input;
  //};

  // Map each file to this function
  function hamlStream(file, cb) {
    // Remember that contents is ALWAYS a buffer
    if (file.isNull()) return cb(null, file); // pass along
    if (file.isStream()) return cb(new Error("gulp-hamlc: Streaming not supported"));

    var basename = path.dirname(path.relative(options.basedir, file.path)) + '/' + path.basename(file.path, '.jst.hamlc')
    basename = basename.replace(/^\.\/(.*)/, "$1")
    basename = basename.replace(/\//g, ".");

    var output = hamlc.template(file.contents.toString("utf8"), basename, "window.JST", {extendScope: true})

    file.path = gutil.replaceExtension(file.path, options.ext);
    file.contents = new Buffer(output);

    cb(null, file);
  }

  // Return a stream
  return map(hamlStream);
};
