export interface LooseImports {
  [key: string]: Fixture;
}

export interface Fixture<Exports = unknown> {
  imports: LooseImports;
  factory: (args: object) => Exports;
}

type ExportOf<M> = M extends Fixture<infer T> ? T : never;

export type ExportsOf<Imports> = {
  [Key in keyof Imports]: ExportOf<Imports[Key]>;
};

const NO_IMPORTS = Object.freeze({});

/**
 * Declares a piece of test state with dependencies.
 */
export function fixture<Exports>(factory: () => Exports): Fixture<Exports>;
export function fixture<Imports extends LooseImports, Exports>(
  imports: Imports,
  factory: (args: ExportsOf<Imports>) => Exports
): Fixture<Exports>;
export function fixture<Imports extends LooseImports, Exports>(
  imports: (Imports | (() => Exports)),
  factory?: (args: ExportsOf<Imports>) => Exports
): Fixture<Exports> {
  if (typeof imports === 'function') return fixture(NO_IMPORTS, imports);

  return Object.freeze({
    imports: Object.freeze(imports),
    factory: factory as (args: unknown) => Exports,
  });
}
