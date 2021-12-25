import BijectionBase from "./bijection-base";

const id = (x) => x;

const identity = () =>
  BijectionBase({
    _debug: "ID",
    forward: id,
    backward: id,
  });

export default identity;
