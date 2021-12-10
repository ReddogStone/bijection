export const testBijection = (
    b,
    r,
    l,
    { useEqual = false, negate = false } = {}
) => {
    const predicate = useEqual ? "toEqual" : "toBe";

    it(`${JSON.stringify(r)} -${negate ? "!" : ""}> ${JSON.stringify(
        l
    )}`, () => {
        let res = expect(b.forward(r));
        if (negate) res = res.not;
        res[predicate](l);
    });
    it(`${JSON.stringify(r)} <${negate ? "!" : ""}- ${JSON.stringify(
        l
    )}`, () => {
        let res = expect(b.backward(l));
        if (negate) res = res.not;
        res[predicate](r);
    });
};

export const testNotBijection = (b, r, l, options) =>
    testBijection(b, r, l, { ...options, negate: true });
