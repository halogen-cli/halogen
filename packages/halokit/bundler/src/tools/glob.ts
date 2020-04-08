/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { Glob as nativeGlob } from 'glob';

export function glob(pattern: string, options: object) {
  return new Promise((resolve, reject) => {
    new nativeGlob(pattern, options, (error, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(files);
    });
  });
}
