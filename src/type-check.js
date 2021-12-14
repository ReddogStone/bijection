const makeTypeOfCheck = (typeValue) => (sink) => (connect) => {
  return connect(
    {
      _debug: `IS ${typeValue}`,
      arity: { left: 1, right: 1 },
      forward: (x) => {
        if (typeof x !== typeValue) throw new Error(`Type mismatch - expected: "${typeValue}", actual: "${typeof x}"`);
        return x;
      },
      backward: (y) => {
        if (typeof y !== typeValue) throw new Error(`Type mismatch - expected: "${typeValue}", actual: "${typeof y}"`);
        return y;
      },
    },
    [sink]
  );
};

export const string = makeTypeOfCheck("string");
export const number = makeTypeOfCheck("number");
export const boolean = makeTypeOfCheck("boolean");
export const undef = makeTypeOfCheck("undefined");
