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
import ts from '@wessberg/rollup-plugin-ts';
import TypeScript from 'typescript';

export function buildTSOptions(
  input: string,
  dependencies: Array<string>,
  extensions: Array<string>
): RollupOptions {
  return {
    input: input,
    external: Object.keys(dependencies),
    plugins: [
      resolve({
        extensions,
        preferBuiltins: true
      }),
      commonjs(),
      ts({
        transpiler: 'babel',
        exclude: ['**/node_modules/**/*.*'],
        typescript: TypeScript,
        tsconfig: {
          target: 'ESNext',
          module: 'CommonJS',
          lib: ['ESNext', 'DOM'],
          noImplicitReturns: true,
          noUnusedLocals: true,
          outDir: 'output',
          sourceMap: true,
          strict: true,
          noFallthroughCasesInSwitch: true,
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          declaration: true,
          removeComments: true,
          baseUrl: './packages',
          incremental: false,
          resolveJsonModule: true
        }
      })
    ]
  };
}
