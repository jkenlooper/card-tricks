import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
// import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-html'

export default {
  entry: 'src/main.js',
  format: 'iife',
  moduleName: 'card',
  sourceMap: true,
  plugins: [
    resolve(),
    commonjs(),
    json(),
    html({
      include: 'src/**/*.html',
      htmlMinifierOptions: {
        caseSensitive: true,
        html5: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeTagWhitespace: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        minifyJS: true
      }
    })
    // babel({
    //   exclude: 'node_modules/**'
    // })
  ],
  globals: {
    hammer: 'Hammer'
  },
  dest: 'bundle.js' // equivalent to --output
}

