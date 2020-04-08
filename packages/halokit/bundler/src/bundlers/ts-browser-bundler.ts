/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { formatGlobals, formatDependenciesIntoGlobals, findPackageFolder, PartialOutput, BundleOptions, BundleInfo, BundlerInterface } from '../tools';
import { join } from 'path';
import { remove, readJSON } from 'fs-extra';
import { rollup, OutputOptions } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import TypeScript from 'typescript';
import { reporter, LogLevel } from '@halokit/reporter';

export class TSBrowserBundler implements BundlerInterface {

  bundlerName: string = 'TS UMD Library Bundler';
  bundlerVersion: string = '1.0.0';

  _entryPoint: string;
  _options: BundleOptions;
  _info: BundleInfo;

  constructor (entryPoint: string, options: BundleOptions, info: BundleInfo) {
    this._entryPoint = entryPoint;
    this._options = options;
    this._info = info;
  }

  async bundle() {
    if (!this._entryPoint) {
      this._entryPoint = join(this._info.cwd, 'index.ts');
    }

    const globals = this._options.globals ? formatGlobals(this._options.globals) : {};
    const name = this._options.umd;
    const packageFolder = await findPackageFolder(this._entryPoint);

    const outDir = join(packageFolder, this._options.dir ? this._options.dir : '');

    const outputs: Array<PartialOutput> = [
      {
        format: 'esm',
        directory: join(outDir, 'es')
      },
      {
        format: 'cjs',
        directory: join(outDir, 'cjs')
      },
      {
        format: 'umd',
        directory: join(outDir, 'umd')
      }
    ];

    await Promise.all(outputs.map(({ directory }) => remove(directory)));

    const tsEntryPoints: Array<OutputOptions> = outputs.map(({ directory, format }) => (
      {
        file: join(directory, 'index.js'),
        format
      }
    ));

    const packageJsonPath = join(packageFolder, 'package.json');
    const packageJson = await readJSON(packageJsonPath);
    const { dependencies = {} } = packageJson;

    const extensions = ['.js', '.jsx', '.ts', '.tsx'];

    const bundler = await rollup({
      input: this._entryPoint,
      external: Object.keys(dependencies),
      plugins: [
        resolve({
          extensions,
          preferBuiltins: true
        }),
        commonjs(),
        ts({
          transpiler: 'babel',
          exclude: ["**/node_modules/**/*.*"],
          typescript: TypeScript,
          tsconfig: {
            target: "ESNext",
            module: "CommonJS",
            lib: [
              "ESNext",
              "DOM"
            ],
            noImplicitReturns: true,
            noUnusedLocals: true,
            outDir: "output",
            sourceMap: true,
            strict: true,
            noFallthroughCasesInSwitch: true,
            moduleResolution: "node",
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            declaration: true,
            removeComments: true,
            baseUrl: "./packages",
            incremental: false,
            resolveJsonModule: true
          }
        })
      ]
    });

    bundler.watchFiles.forEach( (file,index) => {
      reporter.report({
        content: `File ${file.replace(this._info.cwd + '/', '')} added to queue.`,
        level: LogLevel.Info,
        print: true
      });
    });

    console.log();

    await Promise.all(
      tsEntryPoints.map(async ({ format, file }) => {
        const outputOptions: OutputOptions = { format, file };

        if (format === 'umd') {
          outputOptions.name = name;
          outputOptions.globals = {
            ...formatDependenciesIntoGlobals(dependencies),
            ...globals
          };
        }

        const { output } = await bundler.write(outputOptions);
        reporter.report({
          content: `Bundling ${format?.toUpperCase()} module...`,
          level: LogLevel.Info,
          print: true
        });
        for (const asset of output) {
          if (asset.type === 'asset') {
            reporter.report({
              content: `Asset ${asset.fileName.replace(this._info.cwd + '/', '')} created`,
              level: LogLevel.Info,
              print: true
            });
          }
        }
        reporter.report({
          content: `${format?.toUpperCase()} module bundled successfully at ${file!.replace(this._info.cwd + '/', '')}.`,
          level: LogLevel.Success,
          print: true
        });

        console.log();

        return output;
      })
    );

  }


}
