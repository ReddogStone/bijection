import BijectionBase from "./bijection-base";

const named = (name) =>
    BijectionBase({
        forward: (x) => ({ [name]: x }),
        backward: (y) => y[name],
    });

export default named;
