import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.min.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named'
      },
      {
        file: 'dist/bundle.min.js',
        format: 'umd',
        name: 'reactFacets',
        exports: 'named'
      }
    ],
    plugins:[
      babel({
        exclude: 'node_modules/**',
        presets:['@babel/preset-react']
      }),
      external(),
      resolve(),
      terser()
    ]
  },
  {
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/bundle.js',
        format: 'umd',
        name: 'reactFacets',
        exports: 'named'
      }
    ],
    plugins:[
      babel({
        exclude: 'node_modules/**',
        presets:['@babel/preset-react']
      }),
      external(),
      resolve()
    ]
  }
]
