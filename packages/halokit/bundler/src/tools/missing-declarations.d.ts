/// <reference types="node" />

declare module 'rollup-plugin-execute' {
  export default function execute(
    commands: string | Array<string>,
    sync?: boolean
  ): Plugin;
}
