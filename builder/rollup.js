const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

module.exports = (modules, logger, callback) => {
  modules.forEach((module, i) => {
    rollup.rollup({
      input: module.input,
      plugins: [
        resolve({
          browser: true,
          jsnext: true,
          main: true
        }),
        commonjs(),
        babel({
          exclude: 'node_modules/**'
        })
      ]
    })
    .then(bundle => {
      bundle.write({
        file: module.file,
        format: 'iife',
        sourcemap: true,
        name: module.name
      });

      if (i === modules.length - 1) {
        callback();
      }
    })
    .catch(err => logger.log(err));
  });
};
