const list = (itemBijection, sink) => (connect) => {
  return connect(
    {
      _debug: `[ ${itemBijection._debug} ]`,
      arity: { left: 1, right: 1 },
      forward: (xs) => {
        if (!Array.isArray(xs)) throw new Error(`Wrong input to list.forward: ${JSON.stringify(xs)}`);
        return xs.map((x) => itemBijection.forward(x));
      },
      backward: (ys) => {
        if (!Array.isArray(ys)) throw new Error(`Wrong input to list.forward: ${JSON.stringify(ys)}`);
        return ys.map((y) => itemBijection.backward(y));
      },
    },
    [sink]
  );
};

export default list;
