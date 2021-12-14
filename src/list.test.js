import bijection from "./bijection";
import identity from "./identity";
import dictionary from "./dictionary";
import list from "./list";
import { testBijection } from "./utils/test-utils";

describe("List bijection", () => {
  const id = bijection(({ sink }) => identity(sink()));
  const dict = bijection(({ sink }) => dictionary({ a: sink("a"), b: sink("b") }));

  const b1 = bijection(({ sink }) => {
    const y = sink("y");
    return list(id, y);
  });
  testBijection(b1, ["foo"], ["foo"], { useEqual: true });
  testBijection(b1, ["foo", "bar"], ["foo", "bar"], { useEqual: true });

  const b2 = bijection(({ sink }) => {
    const y = sink("y");
    return list(dict, y);
  });

  testBijection(b2, [{ a: 1, b: 2 }], [[1, 2]], { useEqual: true });
  testBijection(
    b2,
    [
      { a: 1, b: 2 },
      { a: "foo", b: "bar" },
    ],
    [
      [1, 2],
      ["foo", "bar"],
    ],
    { useEqual: true }
  );
});
