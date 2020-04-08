/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { reporter, LogLevel } from '@halokit/reporter';
import { halogen } from './halogen-cli';

process.on('unhandledRejection', err => {
  reporter.report({
    content: `There was an unhandled rejection during the execution of halogen:`,
    level: LogLevel.Error,
    print: true
  });
  reporter.report({
    content: `\n${err}\n`,
    level: LogLevel.Log,
    print: true
  });
});

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = parseInt(semver[0]);

if (major <= 10) {
  reporter.report({
    content: `You are currently running NodeJS v${currentNodeVersion}. \n Halogen requires NodeJS 10 or higher. Please update your version of NodeJS.`,
    level: LogLevel.Fatal,
    print: true
  });
  process.exit(1);
}

halogen().catch(error => {
  reporter.report({
    content: `There was an error during the execution of Halogen:`,
    level: LogLevel.Fatal,
    print: true
  });
  reporter.report({
    content: `\n${error.stack}\n`,
    level: LogLevel.Log,
    print: true
  });
  process.exit(1);
});
