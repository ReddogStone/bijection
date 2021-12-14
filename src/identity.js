const id = (x) => x;

const identity = (sink) => (connect) =>
  connect(
    {
      _debug: "ID",
      arity: { left: 1, right: 1 },
      forward: id,
      backward: id,
    },
    [sink]
  );

export default identity;
