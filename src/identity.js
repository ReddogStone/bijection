import BijectionBase from "./bijection-base";

const id = (x) => x;

const identity = () => BijectionBase({ forward: id, backward: id });

export default identity;
