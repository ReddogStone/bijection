import record from "./record";

const dictionary = (schema) => {
  const keys = Object.keys(schema);

  return (connect) =>
    record(
      keys,
      ...keys.map((key) => schema[key])
    )((b, sinks) => {
      console.log("INNER:", b);

      return connect(
        {
          ...b,
          _debug: `{ ${keys
            .map((key) => {
              const nested = schema[key]((b) => b);
              console.log("NESTED:", nested);
              return `${key}: ${nested._debug || nested.name}`;
            })
            .join(", ")} }`,
        },
        sinks
      );
    });
};

export default dictionary;