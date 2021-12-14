import BijectionBase from "./bijection-base";

export default function bijection(context) {
  const sinks = [];

  const sink = (name) => {
    const result = { name };
    sinks.push(result);
    return () => result;
  };

  const connect = (bijection, sinks) => ({
    b: bijection,
    sinks: sinks.map((sink) => sink(connect)),
  });

  const source = context({ sink })(connect);

  // console.log("SOURCE:", source);

  const forward = (sinkMap, node, x) => {
    // console.log("FORWARD:", node, x);

    if (sinkMap.has(node)) {
      const sinkValues = sinkMap.get(node);
      sinkValues.push(x);
      return;
    }

    const result = node.b.forward(x);
    const arity = node.b.arity.right;
    const results = arity === 1 ? [result] : result;

    node.sinks.forEach((sink, i) => {
      forward(sinkMap, sink, results[i]);
    });
  };

  const backward = (node, valueMap) => {
    // console.log("BACKWARD:", node, valueMap);

    if (valueMap.has(node)) return valueMap.get(node);

    let inputs = node.sinks.map((sink) => backward(sink, valueMap));
    inputs = node.b.arity.right === 1 ? inputs[0] : inputs;
    const value = node.b.backward(inputs);

    valueMap.set(node, value);

    return value;
  };

  return BijectionBase({
    _debug: source.b._debug,
    arity: { left: 1, right: sinks.length },
    forward: (x) => {
      const sinkMap = new Map(sinks.map((sink) => [sink, []]));
      forward(sinkMap, source, x);

      const result = sinks.map((sink) => {
        const results = sinkMap.get(sink);

        if (results.length === 0) throw new Error(`No result has been produced for sink "${sink.name}"`);

        return results.reduce((total, current) => {
          if (total !== current)
            throw new Error(
              `Not all results of bijection "${source.b._debug}" for sink "${sink.name}" are equal: ${JSON.stringify(
                results
              )}`
            );
          return total;
        });
      });

      return result.length === 1 ? result[0] : result;
    },
    backward: (y) => {
      const valueMap = new Map();
      const arity = source.b.arity.right;
      const values = arity === 1 ? [y] : y;

      values.forEach((value, index) => {
        valueMap.set(sinks[index], value);
      });

      return backward(source, valueMap);
    },
  });
}
