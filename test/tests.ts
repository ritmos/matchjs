import {match} from "../src";

class Clase {
    saludar() { return "hola"}
}

describe("blablabla", () => {
    const result = match(1)
        .catch(Clase, e => e.saludar())
        .end();

    expect(result).toBe("hello");
});