/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

import { pascalCase } from 'change-case';

export function formatGlobals(input: string) {
  const mappings = input.split(',').map(mapping => {
    return mapping.split('=');
  });
  return mappings.reduce(
    (acc, [pkg, global]) => ({
      ...acc,
      [pkg]: global
    }), {});
}

export function formatDependenciesIntoGlobals(dependencies: object) {
  return Object.keys(dependencies).reduce((acc, key) => {
    const parts = key.split('/').map((identifier, index) => {
      if (index === 0) {
        return identifier.replace(/@/, '');
      }
      return identifier;
    });

    return {
      ...acc,
      [key]: pascalCase(parts.join(' '))
    };
  }, {});
}
