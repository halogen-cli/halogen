/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { Command } from 'commander';
import * as packageJson from '../package.json';
import { bundle } from './commands';
import { cleanArgs } from './tools/argument-cleaner';

const program = new Command();

export async function halogen() {

  const cwd = process.cwd();
  const argv = process.argv;

  program
    .name('halo')
    .version(packageJson.version)
    .usage('<command> [options]');

  program
    .command('bundle [entryPoint]')
    .description(`bundle the given generic entry point, attempting to guess the compiler to use`)
    .option('-g, --globals <options>', 'particular global module names to include')
    .option('-d, --dir <path>', 'the directory to generate compiled files in')
    .action((entryPoint, cmd) =>
    bundle(cleanArgs(cmd), {
      cwd
    }, entryPoint)
  );

  program
    .command('bundle:ts [entryPoint]')
    .description(`bundle the given TypeScript entry point, generating ES and CommonJS modules.`)
    .option('-g, --globals <options>', 'particular global module names to include')
    .option('-d, --dir <path>', 'the directory to generate compiled files in')
    .action((entryPoint, cmd) =>
    bundle(cleanArgs(cmd), {
      cwd,
      bundler: 'ts'
    }, entryPoint)
  );

  program
    .command('bundle:ts-browser [entryPoint]')
    .description('bundle the given .js entryPoint')
    .option('-u, --umd <name>', 'name the module for the UMD build')
    .option('-d, --dir <path>', 'the directory to generate compiled files in')
    .option('-g, --globals <options>', 'global module names')
    .action((entryPoint, cmd) =>
      bundle(cleanArgs(cmd), {
        cwd,
        bundler: 'ts-browser'
      }, entryPoint)
    );

  program.parse(argv);

}
