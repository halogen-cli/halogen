/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { pathExists } from 'fs-extra';
import { dirname, join } from 'path';

export async function findPackageFolder(entryPoint: string): Promise<string> {

  let packageFolder = entryPoint;

  while (packageFolder !== '/' && dirname(packageFolder) !== '/') {
    packageFolder = dirname(packageFolder);
    const packageJsonPath = join(packageFolder, 'package.json');

    if (await pathExists(packageJsonPath)) {
      break;
    }
  }

  return packageFolder;

}
