import BijectionBase from "./bijection-base";
import Arrow from "./arrow";
import identity from "./identity";

const bijectionArrow = Arrow({
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

    return BijectionBase({
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
    });
  },
});

const bijection = (context) =>
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

    return wrap(res);
  });

bijection.parallel = (itemBijections) =>
  BijectionBase({
    _debug: itemBijections.map((b) => b._debug).join(" &&& "),
    forward: (xs) => {
      if (!Array.isArray(xs))
        throw new Error(`bijection.parallel.forward expects an array, but got: ${JSON.stringify(xs)}`);

      return itemBijections.map((b, i) => b.forward(xs[i]));
    },
    backward: (ys) => {
      if (!Array.isArray(ys) || ys.length !== itemBijections.length)
        throw new Error(`bijection.parallel.backward expects an array, but got: ${JSON.stringify(ys)}`);

      return itemBijections.map((b, i) => b.forward(ys[i]));
    },
  });

export default bijection;
