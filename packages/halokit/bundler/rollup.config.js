import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import ts from '@wessberg/rollup-plugin-ts';
import TypeScript from 'typescript';

const packageFolder = path.resolve(process.cwd());
const packagePath = path.resolve(packageFolder + '/package.json');
const pkg = require(packagePath);

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'esm',
      file: path.join(packageFolder, 'dist/es/index.js')
    },
    {
      format: 'cjs',
      file: path.join(packageFolder, 'dist/lib/index.js')
    }
  ],
  external: ['@halokit/reporter', '@rollup/plugin-commonjs', 'rollup-plugin-execute', 'rollup-plugin-sass', '@rollup/plugin-node-resolve', '@rollup/plugin-json', '@wessberg/rollup-plugin-ts', 'change-case', 'fs-extra', 'glob', 'path', 'rollup', 'typescript'],
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
        declaration: true,
        removeComments: true,
        baseUrl: "./packages",
        incremental: false,
        resolveJsonModule: true
      }
    })
  ]
};
