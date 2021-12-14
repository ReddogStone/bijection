import bijection from "./bijection";
import record from "./record";
import { testBijection } from "./utils/test-utils";

describe("Record bijection", () => {
  testBijection(
    bijection(({ sink }) => {
      const a = sink("a");
      const b = sink("b");

      return record(["a", "b"], a, b);
    }),
    { a: 1, b: 2 },
    [1, 2],
    { useEqual: true }
  );

  testBijection(
    bijection(({ sink }) => {
      const a = sink("a");
      const c = sink("c");

      return record(["a", "b"], a, record(["c"], c));
    }),
    { a: 1, b: { c: 2 } },
    [1, 2],
    { useEqual: true }
  );
});
