/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import chalk, { Chalk } from 'chalk';
import stripAnsi from 'strip-ansi';

export class TerminalIO {
  formatter: Chalk;
  strip: (string: string) => string;
  stderr: NodeJS.WritableStream;
  stdin: NodeJS.ReadableStream;
  stdout: NodeJS.WritableStream;

  constructor({
    stderr = process.stderr,
    stdin = process.stdin,
    stdout = process.stdout
  } = {}) {
    this.formatter = chalk;
    this.strip = stripAnsi;
    this.stderr = stderr;
    this.stdin = stdin;
    this.stdout = stdout;
  }

  /**
   * Prints the specified item to the console.
   * This function is just a pass-through.
   *
   * @param item the item to log.
   */
  /* istanbul ignore next */
  print(item: any) {
    console.log(item);
  }
}

export const termIO = new TerminalIO();
