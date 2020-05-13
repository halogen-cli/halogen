/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { RollupOptions } from 'rollup';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export function buildEMOptions(
  input: string,
  dependencies: Array<string>,
  extensions: Array<string>
): RollupOptions {
  return {
    input: input,
    external: dependencies,
    plugins: [
      json(),
      resolve({
        extensions,
        preferBuiltins: true
      }),
      commonjs(),
      babel({
        exclude: ['**/node_modules/**/*.*'],
        externalHelpers: true,
        runtimeHelpers: true,
        babelrc: false
        //presets: [['env', { modules: false }]]
      })
    ]
  };
}
