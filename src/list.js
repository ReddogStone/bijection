import BijectionBase from "./bijection-base";

const list = (itemBijection) =>
  BijectionBase({
    _debug: `[ ${itemBijection._debug} ]`,
    forward: (xs) => {
      if (!Array.isArray(xs)) throw new Error(`Wrong input to list.forward: ${JSON.stringify(xs)}`);
      return xs.map((x) => itemBijection.forward(x));
    },
    backward: (ys) => {
      if (!Array.isArray(ys)) throw new Error(`Wrong input to list.forward: ${JSON.stringify(ys)}`);
      return ys.map((y) => itemBijection.backward(y));
    },
  });

export default list;
