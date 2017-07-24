import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import html from 'rollup-plugin-html'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'
// import execute from 'rollup-plugin-execute'

// Modified rollup-plugin-postcss to store the css in a var
import rollupPostcssInline from './lib/rollup-postcss-inline.js'

import postcss from 'rollup-plugin-postcss'

import postcssImport from 'postcss-import'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCalc from 'postcss-calc'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import cssnano from 'cssnano'

// Minify built code for prodcution
const PRODUCTION = process.env.ENV === 'production'

// Handle different builds (components inline their CSS while the app CSS is
// extracted into a file)
const BUILD = process.env.BUILD
const builds = ['app', 'component']

if (builds.indexOf(BUILD) === -1) {
  console.error('no build is defined!')
}

let config = {
  entry: `src/${BUILD}.js`,
  format: 'iife',
  moduleName: 'app',
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
  ],
  globals: {
    hammer: 'Hammer',
    HTMLElement: 'HTMLElement'
  },
  dest: `dist/${BUILD}.js`
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

switch (BUILD) {
  case 'app':
    config.plugins.push(postcss({
      plugins: cssPlugins,
      sourceMap: true,
      extract: true
    }))
    break
  case 'component':
    config.plugins.push(rollupPostcssInline({
      plugins: cssPlugins,
      sourceMap: true,
      extract: true
    }))
    break
}

if (PRODUCTION) {
  config.plugins.push(uglify({}, minify))
}

export default config