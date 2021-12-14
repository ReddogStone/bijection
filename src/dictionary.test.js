import bijection from "./bijection";
import dictionary from "./dictionary";
import { testBijection } from "./utils/test-utils";

describe("Dictionary bijection", () => {
  const b1 = bijection(({ sink }) => {
    const name = sink("name");
    const email = sink("email");

    return dictionary({
      meta: dictionary({
        author: dictionary({ name, email }),
      }),
      name,
    });
  });

  // Forward direction: right-to-left
  //
  //            |<----------------------------------------------------------|
  // name <---- *                                                           |
  //            |<---|                                                      . <-- record('meta', 'authorName')
  //                 . <- record('name', 'email') --> record('author') <----|
  // email <---------|

  testBijection(
    b1,
    {
      meta: { author: { name: "Some guy", email: "some@guy.com" } },
      name: "Some guy",
    },
    ["Some guy", "some@guy.com"],
    { useEqual: true }
  );

  const b2 = bijection(({ sink }) => {
    const a = sink("a");
    const b = sink("b");
    return dictionary({ a, b });
  });
  testBijection(b2, { a: 1, b: 2 }, [1, 2], { useEqual: true });

  const b3 = b2.invert();
  testBijection(b3, [1, 2], { a: 1, b: 2 }, { useEqual: true });

  const b4 = bijection(({ sink }) => {
    const x = sink("x");
    const y = sink("y");
    return dictionary({ x, y });
  });
  testBijection(b2.connect(b4.invert()), { a: 1, b: 2 }, { x: 1, y: 2 }, { useEqual: true });

  const b5 = bijection(({ sink }) => {
    const x = sink("x");
    const y = sink("y");
    return dictionary({ x, y, p: dictionary({ x, y }) });
  });
  testBijection(b5, { x: 1, y: 2, p: { x: 1, y: 2 } }, [1, 2], { useEqual: true });
  it(`${b5._debug}: { x: 1, y: 2, p: { x: 100, y: 100 } } -> error`, () => {
    b5.forward({ x: 1, y: 2, p: { x: 100, y: 100 } });
  });
});
