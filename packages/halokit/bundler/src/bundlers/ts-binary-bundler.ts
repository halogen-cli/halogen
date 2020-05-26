/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import {
  findPackageFolder,
  BundleOptions,
  BundleInfo,
  BundlerInterface
} from '../tools';
import { join } from 'path';
import { remove, readJSON } from 'fs-extra';
import { rollup, OutputOptions } from 'rollup';
import { reporter, LogLevel } from '@halokit/reporter';
import { buildBinaryTSOptions } from '../configs';

export class TSBinaryBundler implements BundlerInterface {
  bundlerName: string = 'TS Binary Bundler';
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
      this._entryPoint = join(this._info.cwd, 'index.ts');
    }

    const packageFolder = await findPackageFolder(this._entryPoint);

    const outDir = join(
      packageFolder,
      this._options.dir ? this._options.dir : 'bin'
    );

    const packageJsonPath = join(packageFolder, 'package.json');
    const packageJson = await readJSON(packageJsonPath);
    const { dependencies, name } = packageJson;

    let binaryName = this._options.binary
      ? this._options.binary
      : name.replace('@', '').replace('/', '-');
    binaryName = binaryName + '.js';

    const outputLocation = join(outDir, binaryName);

    const tsEntryPoints: OutputOptions = {
      format: 'cjs',
      file: outputLocation,
      banner: '#!/usr/bin/env node'
    };

    if (outDir !== packageFolder) {
      await remove(outDir);
    }

    const extensions = ['.js', '.ts'];

    const bundler = await rollup(
      buildBinaryTSOptions(
        this._entryPoint,
        Object.keys(dependencies),
        extensions,
        outputLocation
      )
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

    const { output } = await bundler.write(tsEntryPoints);

    reporter.report({
      content: `Bundling CJS executable...`,
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
      content: `CJS executable bundled successfully at ${tsEntryPoints.file!.replace(
        this._info.cwd + '/',
        ''
      )}.`,
      level: LogLevel.Success,
      print: true
    });

    console.log();
  }
}
