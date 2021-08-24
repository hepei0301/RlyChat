import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

const external = (id) => !id.startsWith('.') && !id.startsWith('/');

const input = 'src/index.ts';

export default {
  input,
  external,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    copy({
      targets: [
        { src: 'src/assets', dest: 'lib/assets' }
      ],
    }),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs(),
  ],
};
