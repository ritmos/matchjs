import {match} from "../src";

class Clase {
    saludar() { return "hola"}
}

test("blablabla", () => {

    const c = new Clase();

    const result = match(c)
        .caseClass(Clase, e => e.saludar())
        .default("adios");

    expect(result).toBe("hola");
});