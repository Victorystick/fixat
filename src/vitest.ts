import { beforeEach } from "vitest";
import { ExportsOf, LooseImports } from "./fixture";
import { setup } from "./testing";

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
