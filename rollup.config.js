import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
// import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-html'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

// Modified rollup-plugin-postcss to store the css in a var
import rollupPostcssInline from './lib/rollup-postcss-inline.js'

import postcssImport from 'postcss-import'
import postcssCustomProperties from 'postcss-custom-properties'
import postcssCustomMedia from 'postcss-custom-media'
import postcssCalc from 'postcss-calc'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import cssnano from 'cssnano'

const PRODUCTION = process.env.ENV === 'production'

let config = {
  entry: 'src/app.js',
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
    }),
    rollupPostcssInline({
      plugins: [
        postcssImport(),
        postcssCustomProperties(),
        postcssCustomMedia(),
        postcssCalc(),
        autoprefixer(),
        postcssUrl(),
        cssnano()
      ],
      sourceMap: true,
      extract: true
    })
  ],
  globals: {
    hammer: 'Hammer'
  },
  dest: 'dist/app.js'
}

if (PRODUCTION) {
  config.plugins.push(uglify({}, minify))
}

export default config
