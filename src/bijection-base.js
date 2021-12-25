const BijectionMethods = {
  connect(other) {
    return BijectionBase({
      _debug: `${this._debug} >>> ${other._debug}`,
      forward: (x) => other.forward(this.forward(x)),
      backward: (y) => this.backward(other.backward(y)),
    });
  },
  invert() {
    return BijectionBase({
      _debug: `INV(${this._debug})`,
      forward: (x) => this.backward(x),
      backward: (y) => this.forward(y),
    });
  },
  and(other) {
    return BijectionBase({
      _debug: `${this._debug} &&& ${other._debug}`,
      forward: (xs) => {
        if (!Array.isArray(xs) || xs.length !== 2)
          throw new Error(`BijectionBase::and::forward expects a pair of inputs, but got: ${JSON.stringify(xs)}`);

        const [x1, x2] = xs;
        return [this.forward(x1), other.forward(x2)];
      },
      backward: (ys) => {
        if (!Array.isArray(ys) || ys.length !== 2)
          throw new Error(`BijectionBase::and::backward expects a pair of inputs, but got: ${JSON.stringify(ys)}`);

        const [y1, y2] = ys;
        return [this.backward(y1), other.backward(y2)];
      },
    });
  },
};

const BijectionBase = ({ forward, backward, _debug }) =>
  Object.create(BijectionMethods, {
    _debug: { value: _debug, enumerable: true },
    forward: { value: forward },
    backward: { value: backward },
  });

export default BijectionBase;
