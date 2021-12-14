import bijection from "./bijection";
import identity from "./identity";
import { testBijection, testNotBijection } from "./utils/test-utils";

describe("Identity bijection", () => {
  const id = bijection(({ sink }) => {
    const a = sink("a");
    return identity(a);
  });

  testBijection(id, undefined, undefined);
  testBijection(id, null, null);
  testBijection(id, 1, 1);
  testBijection(id, "1", "1");

  testNotBijection(id, undefined, null);
  testNotBijection(id, undefined, 0);
  testNotBijection(id, 0, "0");
  testNotBijection(id, {}, {});
  testNotBijection(id, 1, 2);
});
