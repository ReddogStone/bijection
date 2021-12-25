import identity from "./identity";
import dictionary from "./dictionary";
import list from "./list";
import { testBijection } from "./utils/test-utils";

describe("List bijection", () => {
  const b1 = list(identity());
  testBijection(b1, ["foo"], ["foo"], { useEqual: true });
  testBijection(b1, ["foo", "bar"], ["foo", "bar"], { useEqual: true });

  testBijection(
    list(dictionary({ a: identity(), b: identity() })),
    [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ],
    [
      [1, 2],
      [3, 4],
    ],
    { useEqual: true }
  );
});
