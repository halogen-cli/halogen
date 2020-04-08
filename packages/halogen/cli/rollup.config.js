import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import ts from '@wessberg/rollup-plugin-ts';
import execute from 'rollup-plugin-execute';
import TypeScript from 'typescript';

const packageFolder = path.resolve(process.cwd());
const packagePath = path.resolve(packageFolder + '/package.json');
const pkg = require(packagePath);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'cjs',
      file: path.join(packageFolder, 'bin/halogen.js'),
      banner: '#!/usr/bin/env node'
    }
  ],
  external: ['@halokit/reporter', '@halokit/bundler', 'path', 'commander', 'fs-extra'],
  plugins: [
    resolve({
      extensions,
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    ts({
      transpiler: 'babel',
      exclude: ["**/node_modules/**/*.*"],
      typescript: TypeScript,
      tsconfig: {
        target: "ESNext",
        module: "CommonJS",
        lib: [
          "ESNext",
          "DOM"
        ],
        noImplicitReturns: true,
        noUnusedLocals: true,
        outDir: "output",
        sourceMap: true,
        strict: true,
        noFallthroughCasesInSwitch: true,
        moduleResolution: "node",
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        declaration: false,
        removeComments: true,
        baseUrl: "./packages",
        incremental: false,
        resolveJsonModule: true
      }
    }),
    execute('chmod +x bin/halogen.js')
  ]
};
