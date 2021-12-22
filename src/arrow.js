import util from "util";

const arrow =
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

const BijectionBase = (b) => ({
  _isBijection: true,
  ...b,
});
BijectionBase.isBijection = (b) => !!b._isBijection;

const invert = (b) =>
  BijectionBase({
    _debug: `INV ${b._debug}`,
    forward: b.backward,
    backward: b.forward,
  });

const id = (x) => x;
const identity = () =>
  BijectionBase({
    _debug: "ID",
    forward: id,
    backward: id,
  });

const destructure = (...keys) =>
  BijectionBase({
    _debug: `{ ${keys.join(", ")} }`,
    forward: (x) => {
      if (typeof x !== "object") throw new Error(`Wrong input to destructure.forward: ${JSON.stringify(x)}`);

      const rest = { ...x };
      return [
        ...keys.map((key) => {
          delete rest[key];
          return x[key];
        }),
        rest,
      ];
    },
    backward: (...ys) => {
      const result = { ...ys[keys.length] };
      keys.forEach((key, index) => {
        result[key] = ys[index];
      });
      return result;
    },
  });

const isType = (typeName) => {
  const checkType = (x) => {
    if (typeof x !== typeName) throw new Error(`Expected "${typeName}", but got: ${JSON.stringify(x)}`);
    return x;
  };

  return BijectionBase({ forward: checkType, backward: checkType });
};

const bijectionArrow = arrow({
  id: identity,
  con: (source, backwardMapping, sinks) => {
    // console.log("CON:", source, backwardMapping, sinks);

    const forwardMapping = new Map();
    backwardMapping.forEach((sinkIndex, inputIndex) => {
      const sink = sinks[sinkIndex].sink;
      const mergeGroup = forwardMapping.get(sink) || [];
      mergeGroup.push(inputIndex);
      forwardMapping.set(sink, mergeGroup);
    });

    // console.log("FORWARD MAPPING:", forwardMapping);

    return {
      forward: (x) => {
        const outputs = source.forward(x);
        // console.log("OUTS:", outputs);

        const result = sinks
          .map(({ sink, arity }) => {
            const outputGroupIndices = forwardMapping.get(sink);
            if (!outputGroupIndices) throw new Error(`A sink is not connected!`);

            const outputGroup = outputGroupIndices.map((index) => outputs[index]);
            // console.log("OUTPUT GROUP:", outputGroup);

            const input = outputGroup.reduce((a, b) => {
              if (a !== b)
                throw new Error(`Outputs that have to be merged are not all equal: ${JSON.stringify(outputGroup)}`);
              return a;
            });

            // console.log("PASS TO SINK:", sink, input, sink.forward(input));

            const output = sink.forward(input);
            return arity === 1 ? [output] : output.slice(0, arity);
          })
          .reduce((a, b) => (a.push(...b), a), []);
        // console.log("RES:", result);

        return result;
      },
      backward: (...ys) => {
        // console.log("BACKWARD:", ys, backwardMapping);

        let inputIndex = 0;
        const outputs = sinks.map(({ sink, arity }) => {
          // console.log("PASS:", sink, ys.slice(inputIndex, inputIndex + arity));
          const result = sink.backward(...ys.slice(inputIndex, inputIndex + arity));
          inputIndex += arity;
          return result;
        });

        // console.log("OUTPUTS:", outputs);

        const result = source.backward(...backwardMapping.map((i) => outputs[i]));
        // console.log("RES:", result);

        return result;
      },
    };
  },
});

const niceBijection = (context) =>
  bijectionArrow(({ sink, connect }) => {
    const nodes = new Set();

    const wrap = (b) => {
      if (nodes.has(b)) return b;
      if (typeof b === "object")
        return connect(destructure(...Object.keys(b)), ...Object.keys(b).map((key) => wrap(b[key])));

      throw new Error(`Unknown construct: ${JSON.stringify(b)}`);
    };

    const res = context({
      sink: (...args) => {
        const node = sink(...args);
        nodes.add(node);
        return node;
      },
      string: (arg) => {
        const node = connect(isType("string"), arg);
        nodes.add(node);
        return node;
      },
      number: (arg) => {
        const node = connect(isType("number"), arg);
        nodes.add(node);
        return node;
      },
      boolean: (arg) => {
        const node = connect(isType("boolean"), arg);
        nodes.add(node);
        return node;
      },
    });

    console.log("RES:", res);

    return wrap(res);
  });

// const b = bijectionArrow(({ sink, connect }) => {
//   const a = sink("a");
//   const b = sink("b");

//   return connect(destructure("a", "b"), a, connect(destructure("c", "d"), b, b));
// });

const b = niceBijection(({ sink, string, number, boolean }) => {
  const x = sink("x");
  const y = sink("y");
  const z = sink("z");
  return {
    a: string(x),
    b: {
      c: number(y),
      d: boolean(z),
    },
  };
});

let r = b.forward({ a: "Bla", b: { c: 2, d: true }, x: 5, y: 6 });
console.log("F:", r);
console.log("B:", b.backward(...r));
