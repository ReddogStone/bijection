const BijectionMethods = {
  connect(other) {
    if (this.arity.right !== other.arity.left)
      throw new Error(`Arities don't match: ${this.arity.right} !== ${other.arity.left}`);

    return {
      _debug: `${this._debug} >>> ${other._debug}`,
      arity: { left: this.arity.left, right: other.arity.right },
      forward: (x) => other.forward(this.forward(x)),
      backward: (y) => this.backward(other.backward(y)),
    };
  },
  invert() {
    const {
      arity: { left, right },
      forward,
      backward,
    } = this;
    return {
      _debug: `INV(${this._debug})`,
      arity: { left: right, right: left },
      forward: (x) => backward(x),
      backward: (y) => forward(y),
    };
  },
};

const BijectionBase = ({ forward, backward, arity, _debug }) =>
  Object.create(BijectionMethods, {
    _debug: { value: _debug, enumerable: true },
    arity: { value: arity },
    forward: { value: forward },
    backward: { value: backward },
  });

export default BijectionBase;
