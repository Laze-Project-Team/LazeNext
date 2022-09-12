export namespace Laze {
  export type Props = Record<string, unknown>;
  export type Module = {
    props: Props;
    importFunc: (props: unknown) => WebAssembly.Imports;
    initFunc: (props: unknown) => Props;
  };
  export type Modules = Record<string, Module>;
}
