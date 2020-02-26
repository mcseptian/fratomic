/*
 * Require the path module
 */
// const path = require('path');
const rollup = require('./rollup.js')

const paths = {
    src: ['src/js'],
    dest: ['dist/js']
}
// Test Scripts
function scripts(callback) {
    const modules = [{
      input: `${paths.src}/copy.js`,
      file: `${paths.dest}/copy.js`,
      name: 'copy'
    }, {
      input: `${paths.src}/search.js`,
      file: `${paths.dest}/search.js`,
      name: 'search'
    }, {
      input: `${paths.src}/sidebar.js`,
      file: `${paths.dest}/sidebar.js`,
      name: 'sidebar'
    }, {
      input: `${paths.src}/dom.js`,
      file: `${paths.dest}/dom.js`,
      name: 'dom'
    }];

    rollup(modules, util, callback);
  }

  