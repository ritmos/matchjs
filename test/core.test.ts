import {match} from "../src";

class Clase {
    saludar() { return "hola"}
}

function Cosa() {

}

test("blablabla", () => {

    const c = new Clase();

    const result = match(c)
        .caseClass(Clase, e => e.saludar())
        .default("adios");

    expect(result).toBe("hola");
});


test("asfsafas", () => {

    const superhero = {
        name: "Daniel",
        power: "Strength",
        favouriteFood: "Chorizo"
    };

    const result = match(superhero)
        .caseObjectLike({power: "Strength"}, true)
        .default(false);

    expect(result).toBeTruthy();
});

test("sfdadf", () => {

    const superhero = {
        name: "Daniel",
        power: "Strength",
        favouriteFood: "Chorizo"
    };

    const result = match(superhero)
        .caseObjectWith(["power"], element => element.power)
        .default("No powers");

    expect(result).toBe("Strength");
});

