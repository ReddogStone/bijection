const BijectionMethods = {};

const BijectionBase = ({ forward, backward }) =>
    Object.create(BijectionMethods, {
        forward: { value: forward },
        backward: { value: backward },
    });

export default BijectionBase;
