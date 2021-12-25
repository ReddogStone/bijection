import destructure from "./destructure";
import bijection from "./bijection";
import BijectionBase from "./bijection-base";

const dictionary = (schema) => {
  const keys = Object.keys(schema);
  const bijections = keys.map((key) => schema[key]);

  const result = destructure(keys).connect(bijection.parallel(bijections));
  return BijectionBase({
    _debug: `{ ${keys.map((key) => `${key}: ${schema[key]._debug}`).join(", ")} }`,
    forward: result.forward,
    backward: result.backward,
  });
};

export default dictionary;
