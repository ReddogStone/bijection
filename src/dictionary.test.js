import dictionary from "./dictionary";
import identity from "./identity";
import { testBijection } from "./utils/test-utils";

describe("Dictionary bijection", () => {
  testBijection(dictionary({}), {}, [], { useEqual: true });
  testBijection(dictionary({ a: identity() }), { a: 1 }, [1], { useEqual: true });
  testBijection(dictionary({ a: identity(), b: identity() }), { a: 1, b: 2 }, [1, 2], { useEqual: true });
});
