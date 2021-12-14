const record =
  (keys, ...sinks) =>
  (connect) =>
    connect(
      {
        _debug: `{ ${keys.join(", ")} }`,
        arity: { left: 1, right: keys.length },
        forward: (x) => {
          if (typeof x !== "object") throw new Error(`Wrong input to record.forward: ${JSON.stringify(x)}`);
          const result = keys.map((key) => x[key]);

          return result.length === 1 ? result[0] : result;
        },
        backward: (y) => {
          if (keys.length === 1) y = [y];
          if (!Array.isArray(y)) throw new Error(`Wrong input to record.backward: ${JSON.stringify(y)}`);

          const res = {};
          keys.forEach((key, index) => {
            res[key] = y[index];
          });
          return res;
        },
      },
      sinks
    );

export default record;
