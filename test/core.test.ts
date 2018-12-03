import {match} from "../src/core";

class Clase {
    saludar() { return "hola"}
}


function tuple<T extends string[]>(...a: T) :T{
    return a;
}


function f<T extends Array<keyof any>>(props:T): Record<T[number], any> {

    return null!;
}



test("blablabla", () => {

    const c = new Clase();

    const keys = ["a", "b"];

    const b = tuple("a", "b");
    const bb = f(b);




    const result = match(c)
        .caseObjectWith(keys, e => e)
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

