import { ExportsOf, Fixture, LooseImports } from "./fixture";

class DefaultMap<K, V> extends Map<K, V> {
  constructor(private readonly makeDefault: (key: K) => V) {
    super();
  }

  get(key: K): V {
    if (!this.has(key)) {
      this.set(key, this.makeDefault(key));
    }
    return super.get(key)!;
  }
}

export function setup<Imports extends LooseImports>(imports: Imports): ExportsOf<Imports> {
  const cache = new DefaultMap<Fixture, unknown>(({ factory, imports }) => factory(get(imports)));

  function get<Imports extends LooseImports>(imports: Imports): ExportsOf<Imports> {
    const exports: { [key: string]: unknown } = {};
    for (const [key, value] of Object.entries(imports)) {
      exports[key] = cache.get(value);
    }
    return exports as ExportsOf<Imports>;
  }

  return get(imports);
}

/**
 * Sets up test state within a test.
 */
export function testing<Imports extends LooseImports>(imports: Imports): ExportsOf<Imports> {
  const values: { [key: string]: unknown } = {};

  beforeEach(() => {
    Object.assign(values, setup(imports));
  });

  return values as ExportsOf<Imports>;
}
