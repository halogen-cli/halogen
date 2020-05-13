/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import {
  findPackageFolder,
  PartialOutput,
  BundleOptions,
  BundleInfo,
  BundlerInterface
} from '../tools';
import { join } from 'path';
import { remove, readJSON } from 'fs-extra';
import { rollup, OutputOptions } from 'rollup';
import { reporter, LogLevel } from '@halokit/reporter';
import { buildEMOptions } from '../configs';

export class EMBundler implements BundlerInterface {
  bundlerName: string = 'EM Library Bundler';
  bundlerVersion: string = '1.0.0';

  _entryPoint: string;
  _options: BundleOptions;
  _info: BundleInfo;

  constructor(entryPoint: string, options: BundleOptions, info: BundleInfo) {
    this._entryPoint = entryPoint;
    this._options = options;
    this._info = info;
  }

  async bundle() {
    if (!this._entryPoint) {
      this._entryPoint = join(this._info.cwd, 'index.js');
    }

    const packageFolder = await findPackageFolder(this._entryPoint);

    const outDir = join(
      packageFolder,
      this._options.dir ? this._options.dir : ''
    );

    const outputs: Array<PartialOutput> = [
      {
        format: 'cjs',
        directory: join(outDir, 'cjs')
      }
    ];

    await Promise.all(outputs.map(({ directory }) => remove(directory)));

    const emEntryPoints: Array<OutputOptions> = outputs.map(
      ({ directory, format }) => ({
        file: join(directory, 'index.js'),
        format
      })
    );

    const packageJsonPath = join(packageFolder, 'package.json');
    const packageJson = await readJSON(packageJsonPath);
    const { dependencies = {} } = packageJson;

    const extensions = ['.js', '.jsx', '.es6', '.es', '.mjs'];

    const bundler = await rollup(
      buildEMOptions(this._entryPoint, Object.keys(dependencies), extensions)
    );

    bundler.watchFiles.forEach((file, index) => {
      reporter.report({
        content: `File ${file.replace(
          this._info.cwd + '/',
          ''
        )} added to queue.`,
        level: LogLevel.Info,
        print: true
      });
    });

    console.log();

    await Promise.all(
      emEntryPoints.map(async ({ format, file }) => {
        const outputOptions: OutputOptions = { format, file };
        const { output } = await bundler.write(outputOptions);
        reporter.report({
          content: `Bundling ${format?.toUpperCase()} module...`,
          level: LogLevel.Info,
          print: true
        });
        for (const asset of output) {
          if (asset.type === 'asset') {
            reporter.report({
              content: `Asset ${asset.fileName.replace(
                this._info.cwd + '/',
                ''
              )} created`,
              level: LogLevel.Info,
              print: true
            });
          }
        }
        reporter.report({
          content: `${format?.toUpperCase()} module bundled successfully at ${file!.replace(
            this._info.cwd + '/',
            ''
          )}.`,
          level: LogLevel.Success,
          print: true
        });

        console.log();

        return output;
      })
    );
  }
}
