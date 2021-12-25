const Arrow =
  ({ id, con }) =>
  (context) => {
    if (typeof context !== "function")
      throw new Error(`Arrow context must be a function, but was: ${JSON.stringify(context)}`);

    const sinks = [];

    const sink = (debugName) => {
      const node = { name: debugName, level: 0 };
      sinks.push(node);
      return node;
    };

    const connect = (arrow, ...sinks) => {
      const level = sinks.map((node) => node.level).reduce((a, b) => Math.max(a, b), 0) + 1;

      sinks = sinks.map((sink) => {
        if (sink.level === level - 1) return sink;
        return connect(id(), sink);
      });

      return { arrow, sinks, level };
    };

    const source = context({ sink, connect });

    // console.log("SOURCE:", util.inspect(source, { depth: null }));
    // console.log("LEVELS:", util.inspect(levels, { depth: 3 }));

    let result = source;
    for (let i = 0; i < source.level; i++) {
      // console.log("RESULT:", result);

      const indexMap = new Map();
      (i < source.level - 1 ? result.sinks : sinks).forEach((sink) => {
        if (!indexMap.has(sink)) indexMap.set(sink, indexMap.size);
      });

      // console.log("INDEX MAP:", indexMap);

      result = {
        arrow: con(
          result.arrow,
          result.sinks.map((sink) => indexMap.get(sink)),
          Array.from(indexMap.keys()).map((node) => ({ sink: node.arrow || id(), arity: node.sinks?.length || 1 }))
        ),
        sinks: result.sinks.map((sink) => sink.sinks || []).reduce((a, b) => (a.push(...b), a), []),
      };
    }

    // console.log("RESULT:", result);

    return result.arrow;
  };

export default Arrow;
