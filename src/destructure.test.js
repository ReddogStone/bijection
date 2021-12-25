import destructure from "./destructure";
import { testBijection } from "./utils/test-utils";

describe("Destructure bijection", () => {
  testBijection(destructure(["a", "b"]), { a: 1, b: 2 }, [1, 2, {}], { useEqual: true });
  testBijection(destructure([]), { a: 1 }, [{ a: 1 }], { useEqual: true });
  testBijection(destructure(["a", "b"]), { a: 1, b: 2, c: 3, d: 4 }, [1, 2, { c: 3, d: 4 }], { useEqual: true });
});
