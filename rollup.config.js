import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import path from 'path';
import pkg from './package.json' assert { type: 'json' };

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: false,
    },
    {
      file: pkg.unpkg,
      format: 'iife',
      sourcemap: false,
      name: 'OpenIMSDK',
    },
  ],
  plugins: [
    alias({
      entries: [{ find: '@', replacement: (path.dirname, 'src') }],
    }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser(),
  ],
};
