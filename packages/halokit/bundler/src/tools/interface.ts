/**
 * @license
 * Copyright © DragonSpark Technologies - 2020. All Rights Reserved.
 *
 * This source code is licensed under the Apache-2.0 license found
 * in the LICENSE file in the root directory of this source tree.
 */

export interface PartialOutput {
  format: 'esm' | 'cjs' | 'amd' | 'es' | 'iife' | 'system' | 'umd' | 'commonjs' | 'module' | 'systemjs' | undefined,
  directory: string
}

export interface BundleOptions {
  umd?: string,
  globals?: string,
  output?: string,
  dir?: string
}

export interface BundleInfo {
  cwd: string
  bundler?: string
}

export interface BundlerInterface {
  bundlerName: string,
  bundlerVersion: string,
  bundle: () => Promise<void>;
}
