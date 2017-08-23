import resolve from 'rollup-plugin-node-resolve'
// import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import html from 'rollup-plugin-html'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
// import rollupUnassert from 'rollup-plugin-unassert'

// Modified rollup-plugin-postcss to store the css in a var
import rollupPostcssInline from './lib/rollup-postcss-inline.js'

// import postcss from 'rollup-plugin-postcss'

import postcssImport from 'postcss-import'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCalc from 'postcss-calc'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import cssnano from 'cssnano'

// Minify built code for prodcution
const PRODUCTION = process.env.ENV === 'production'

// Handle different builds.
// - Component uses style tag for CSS in shadow DOM.
// - App CSS is extracted into a file.
const BUILD = process.env.BUILD
const builds = ['index', 'test']

// All web components in this library use the crdtrx namespace in their tag
// name (crdtrx-card, crdtrx-pile, etc.).
const moduleName = 'crdtrx'

if (builds.indexOf(BUILD) === -1) {
  console.error('no build is defined!')
}

let config = {
  entry: 'src/index.js',
  format: 'es', // Switch to iife for the example dist
  moduleName: moduleName,
  sourceMap: true,
  plugins: [
    // rollupUnassert(),
    resolve({jsnext: true}),
    // replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
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
  ],
  globals: {
    hammer: 'Hammer',
    HTMLElement: 'HTMLElement'
  },
  dest: `dist/${moduleName}.js`
}

let cssPlugins = [
  postcssImport(),
  postcssCustomProperties(),
  postcssCustomMedia(),
  postcssCalc(),
  autoprefixer(),
  postcssUrl()
]
if (PRODUCTION) {
  cssPlugins.push(cssnano())
}

if (BUILD === 'index') {
  config.plugins.push(rollupPostcssInline({
    plugins: cssPlugins,
    sourceMap: true,
    extract: true
  }))
}

if (PRODUCTION) {
  config.plugins.push(uglify({}, minify))
}

export default config
