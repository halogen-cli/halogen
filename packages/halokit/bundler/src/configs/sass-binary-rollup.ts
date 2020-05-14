/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

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
// @ts-ignore
import sass from 'rollup-plugin-sass';
import execute from 'rollup-plugin-execute';

export function buildBinarySassOptions(
  input: string,
  dependencies: Array<string>,
  extensions: Array<string>,
  binaryLocation: string
): RollupOptions {
  return {
    input: input,
    external: dependencies,
    plugins: [
      sass(),
      resolve({
        extensions,
        preferBuiltins: true
      }),
      commonjs(),
      sass({
        // If you specify true, the plugin will insert compiled CSS into <head/> tag.
        insert: true,
        // Filename to write all styles
        output: 'bundle.sass',
        processor(code: any) {
          return {
            css: '.body {}',
            foo: 'foo',
            bar: 'bar'
          };
        }
      }),
      execute(`chmod +x ${binaryLocation}`)
    ]
  };
}
