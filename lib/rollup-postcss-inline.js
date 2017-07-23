'use strict';

var path = require('path')
var rollupPluginutils = require('rollup-pluginutils')
var postcss = require('postcss')

function cwd(file) {
  return path.join(process.cwd(), file);
}

var index = function (options) {
  if ( options === void 0 ) options = {};

  var filter = rollupPluginutils.createFilter(options.include, options.exclude);
  var extensions = options.extensions || ['.css', '.sss'];
  var getExport = options.getExport || function () {};

  return {
    transform: function transform(code, id) {
      if (!filter(id)) {
        return null;
      }
      if (extensions.indexOf(path.extname(id)) === -1) {
        return null;
      }
      var opts = {
        from: options.from ? cwd(options.from) : id,
        to: options.to ? cwd(options.to) : id,
        map: {
          inline: false,
          annotation: false
        },
        parser: options.parser
      };

      return Promise.resolve()
        .then(function () {
          if (options.preprocessor) {
            return options.preprocessor(code, id);
          }
          return {code: code};
        })
        .then(function (input) {
          if (input.map && input.map.mappings) {
            opts.map.prev = input.map;
          }
          return postcss(options.plugins || [])
            .process(input.code.replace(/\/\*[@#][\s\t]+sourceMappingURL=.*?\*\/$/mg, ''), opts)
            .then(function (result) {
              var code;
              var map;
                code = "export default " + JSON.stringify(result.css)
                map = options.sourceMap && result.map ?
              JSON.parse(result.map) :
              {mappings: ''};

              return {code: code, map: map};
            });
        });
    }
  };
};

export default index
