import BijectionBase from "./bijection-base";

const destructure = (keys) =>
  BijectionBase({
    _debug: `{ ${keys.join(", ")} }`,
    forward: (x) => {
      if (typeof x !== "object") throw new Error(`Wrong input to destructure.forward: ${JSON.stringify(x)}`);

      const rest = { ...x };
      const result = keys.map((key) => {
        delete rest[key];
        return x[key];
      });
      return [...result, rest];
    },
    backward: (y) => {
      if (!Array.isArray(y)) throw new Error(`Wrong input to destructure.backward: ${JSON.stringify(y)}`);

      const res = { ...y[keys.length] };
      keys.forEach((key, index) => {
        res[key] = y[index];
      });
      return res;
    },
  });

export default destructure;
