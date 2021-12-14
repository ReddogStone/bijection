import bijection from "./bijection";
import list from "./list";
import dictionary from "./dictionary";
import { string, number, boolean, undef } from "./type-check";
import { testBijection } from "./utils/test-utils";

describe("Undefined check bijection", () => {
  const b = bijection(({ sink }) => undef(sink()));

  testBijection(b, undefined, undefined);

  it("'foo' -> error", () => {
    expect(() => {
      b.forward("foo");
    }).toThrow();
  });
  it("1 -> error", () => {
    expect(() => {
      b.forward(1);
    }).toThrow();
  });
});

describe("String check bijection", () => {
  const b = bijection(({ sink }) => string(sink()));

  testBijection(b, "foo", "foo");

  it("1 -> error", () => {
    expect(() => {
      b.forward(1);
    }).toThrow();
  });
  it("undefined -> error", () => {
    expect(() => {
      b.forward(undefined);
    }).toThrow();
  });
});

describe("Number check bijection", () => {
  const b = bijection(({ sink }) => number(sink()));

  testBijection(b, 1337, 1337);

  it("'foo' -> error", () => {
    expect(() => {
      b.forward("foo");
    }).toThrow();
  });
  it("undefined -> error", () => {
    expect(() => {
      b.forward(undefined);
    }).toThrow();
  });
});

describe("Boolean check bijection", () => {
  const b = bijection(({ sink }) => boolean(sink()));

  testBijection(b, true, true);
  testBijection(b, false, false);

  it("'foo' -> error", () => {
    expect(() => {
      b.forward("foo");
    }).toThrow();
  });
  it("undefined -> error", () => {
    expect(() => {
      b.forward(undefined);
    }).toThrow();
  });
});

describe("Complex check bijection", () => {
  const b = bijection(({ sink }) => {
    const orderId = sink("orderId");
    const totalPrice = sink("price");
    const currency = sink("currency");
    const items = sink("items");

    return dictionary({
      order: dictionary({
        id: string(orderId),
      }),
      price: dictionary({
        total: number(totalPrice),
        cur: string(currency),
      }),
      items: list(
        bijection(({ sink }) => {
          const itemId = sink("itemId");
          const price = sink("price");
          return dictionary({ id: string(itemId), price: number(price) });
        }),
        items
      ),
    });
  });

  testBijection(
    b,
    {
      order: {
        id: "00001",
      },
      price: {
        total: 1000,
        cur: "EUR",
      },
      items: [
        {
          id: "00001-1",
          price: 500,
        },
        {
          id: "00001-2",
          price: 300,
        },
        {
          id: "00001-3",
          price: 200,
        },
      ],
    },
    [
      "00001",
      1000,
      "EUR",
      [
        ["00001-1", 500],
        ["00001-2", 300],
        ["00001-3", 200],
      ],
    ],
    { useEqual: true }
  );
});
