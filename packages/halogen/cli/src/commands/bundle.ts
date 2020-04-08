/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { reporter, LogLevel, termIO } from '@halokit/reporter';
import { BundleOptions, BundleInfo, bundlers } from '@halokit/bundler';
import { extname, join } from 'path';
import { pathExists } from 'fs-extra';

export async function bundle(options: BundleOptions, info: BundleInfo, entryPoint?: string) {

  const { cwd } = info;
  let bundlerType;

  if(!entryPoint) {
    if(info.bundler) {
      entryPoint = 'index.' + info.bundler.substr(0, 2);
      if (!await pathExists(entryPoint)) {
        entryPoint = 'src/index.' + info.bundler.substr(0, 2);
        console.log(entryPoint);
        if (!await pathExists(entryPoint)) {
          reporter.report({
            content: termIO.formatter.bold.cyanBright(`halogen :: Bundler Utility`),
            level: LogLevel.Log,
            print: true
          });
          reporter.report({
            content: `No valid index entry points could be automatically found.`,
            level: LogLevel.Fatal,
            print: true
          });
          reporter.report({
            content: `Try running the command again specifying an entry point manually.`,
            level: LogLevel.Info,
            print: true
          });
          process.exit(1);
        }
      }
    } else {
      if (await pathExists('index.ts')) {
        entryPoint = 'index.ts';
      } else if (await pathExists('src/index.ts')) {
        entryPoint = 'src/index.ts';
      } else if (await pathExists('index.js')) {
        entryPoint = 'index.js';
      } else if (await pathExists('src/index.js')) {
        entryPoint = 'src/index.js';
      } else {
        reporter.report({
          content: termIO.formatter.bold.cyanBright(`halogen :: Bundler Utility`),
          level: LogLevel.Log,
          print: true
        });
        reporter.report({
          content: `No valid index entry points could be automatically found.`,
          level: LogLevel.Fatal,
          print: true
        });
        reporter.report({
          content: `Try running the command again specifying an entry point manually.`,
          level: LogLevel.Info,
          print: true
        });
        process.exit(1);
      }
    }
  }

  if (!await pathExists(entryPoint)) {
    reporter.report({
      content: termIO.formatter.bold.cyanBright(`halogen :: Bundler Utility`),
      level: LogLevel.Log,
      print: true
    });
    reporter.report({
      content: `The provided entry point could not be found.`,
      level: LogLevel.Fatal,
      print: true
    });
    reporter.report({
      content: `Check that the provided path exists and try running the command again.`,
      level: LogLevel.Info,
      print: true
    });
    process.exit(1);
  };

  if (!info.bundler) {
    const extension = extname(entryPoint);
    bundlerType = extension.replace(/\./g, "");;

    if (!bundlers.has(bundlerType)) {
      reporter.report({
        content: `'${extension}' files are currently not supported by the halogen bundler.`,
        level: LogLevel.Fatal,
        print: true
      });
      process.exit(1);
    }

  } else {
    bundlerType = info.bundler;
  }

  try {
    const BundlerClass = bundlers.get(bundlerType)!;
    const bundler = new BundlerClass(join(cwd, entryPoint), options, info);

    const title = `\nhalogen :: ${bundler.bundlerName} v${bundler.bundlerVersion}\n`;
    reporter.report({
      content: termIO.formatter.bold.cyanBright(title),
      level: LogLevel.Log,
      print: true
    });

    reporter.report({
      content: `Seeking files...`,
      level: LogLevel.Info,
      print: true
    });

    await bundler.bundle();
  } catch (error) {
    reporter.report({
      content: `There was an unexpected error while bundling '${entryPoint}'. More information:'`,
      level: LogLevel.Fatal,
      print: true
    });
    reporter.report({
      content: `\n${error.stack}\n`,
      level: LogLevel.Log,
      print: true
    });
    process.exit(1);
  }

  reporter.report({
    content: `All modules were bundled successfully. 🎉`,
    level: LogLevel.Success,
    print: true
  });

}
