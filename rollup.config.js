import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';

import pkg from './package.json';

const name = 'tester'
  , input = 'src/index.ts'
  , extensions = ['.js', '.jsx', '.ts', '.tsx']
  , babelConfig = {
    ...babelrc({ addExternalHelpersPlugin: false }),
    exclude: 'node_modules/**',
    extensions,
  }
  , external = [
    'react',
    'react-proptypes',
    'enzyme',
  ]
  , plugins = [
    resolve({ extensions }),
    babel(babelConfig),
    commonjs(),
  ]
  ;


export default [
  // browser-friendly UMD build
  {
    input,
    output: { file: pkg.browser, format: 'umd', name, sourcemap: true },
    external,
    plugins,
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    external: [...external, 'ms'],
    input,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
    plugins,
  },
];
