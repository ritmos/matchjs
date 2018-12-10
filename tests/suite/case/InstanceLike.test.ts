import {match} from "../../../src/index";


test("caseInstanceLike should match an instance with certain property", () => {

    const x = new ClassConstructor("yunco");

    const instanceMatches = match(x)
        .caseInstanceLike(ClassConstructor, e => e.name === "yunco", true)
        .default(false);

    expect(instanceMatches).toBeTruthy();
});

test("caseInstanceLike should not match an instance with different property value", () => {

    const x = new ClassConstructor("canelo");

    const instanceMatches = match(x)
        .caseInstanceLike(ClassConstructor, e => e.name === "yunco", true)
        .default(false);

    expect(instanceMatches).toBeFalsy();
});

// todo terminar los tests aqui

function FunctionConstructor() {
    // @ts-ignore
    this.origin = "function";
}

function AnotherFunctionConstructor() {
    // @ts-ignore
    this.origin = "another function";
}

class ClassConstructor {
    origin = "class";
    constructor(readonly name: string) {}
}

class AnotherClassConstructor {
    origin = "another class";
}