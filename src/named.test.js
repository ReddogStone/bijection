import named from "./named";
import { testBijection } from "./utils/test-utils";

describe("Named bijection", () => {
    testBijection(named("a"), undefined, { a: undefined }, { useEqual: true });
    testBijection(named("a"), 10, { a: 10 }, { useEqual: true });
    testBijection(named("a"), { b: 1 }, { a: { b: 1 } }, { useEqual: true });
});

const obj = {
    meta: {
        author: {
            name: "Elshad",
            email: "shirinov.elshad@gmail.com",
        },
    },
    data: [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
        { a: 5, b: 6, special: true },
    ],
};

// ->

const res = [
    { a: 1, b: 2, author: "elshad_shirinov.elshad@gmail.com" },
    { a: 3, b: 4, author: "elshad_shirinov.elshad@gmail.com" },
    { sum: 11, author: "elshad_shirinov.elshad@gmail.com" },
];
