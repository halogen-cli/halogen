/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { RollupOptions } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import execute from 'rollup-plugin-execute';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';

export function buildBinaryEMOptions(
  input: string,
  dependencies: Array<string>,
  extensions: Array<string>,
  binaryLocation: string
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
        babelHelpers: 'bundled'
      }),
      execute(`chmod +x ${binaryLocation}`)
    ]
  };
}
