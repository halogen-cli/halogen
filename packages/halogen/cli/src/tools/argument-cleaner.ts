/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { Command, Option } from "commander";

export function cleanArgs(command: Command) {
  return command.options.reduce((acc: Command, option: Option) => {
    const key = option.long
      .replace(/^--/, '')
      .split('-')
      .map((word: string, i: number) => {
        if (i === 0) {
          return word;
        }
        return word[0].toUpperCase() + word.slice(1);
      })
      .join('');
    if (typeof command[key] !== 'function') {
      return {
        ...acc,
        [key]: command[key]
      };
    }
    return acc;
  }, {});
}
