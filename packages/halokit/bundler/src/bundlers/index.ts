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
import { EMBundler } from './em-bundler';
import { EMBrowserBundler } from './em-browser-bundler';
import { EMBinaryBundler } from './em-binary-bundler';

export const bundlers = new Map([
  ['ts', TSBundler],
  ['ts-browser', TSBrowserBundler],
  ['ts-binary', TSBinaryBundler],
  ['js', EMBundler],
  ['js-browser', EMBrowserBundler],
  ['js-binary', EMBinaryBundler]
]);
