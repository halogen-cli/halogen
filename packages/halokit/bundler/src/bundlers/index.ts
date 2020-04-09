/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { TSBundler } from './ts-bundler';
import { TSBrowserBundler } from './ts-browser-bundler';
import { TSBinaryBundler } from './ts-binary-bundler';

export const bundlers = new Map([
  ['ts', TSBundler],
  ['ts-browser', TSBrowserBundler],
  ['ts-binary', TSBinaryBundler]
]);
