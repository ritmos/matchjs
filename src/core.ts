export function match(element: any): MatcherConstructor {
    return new MatcherConstructor(element);
}


interface Class {
    new(...args: any[]): Class;
}


type Instance<T> =
    T extends Class ? InstanceType<T> : any;


class MatcherConstructor {

    constructor(private readonly element: any) {}

    enforceReturnType<R>() {
        return new Matcher<R>(this.element);
    }

    caseInstance<R, T extends Class | Function>(constructor: T, mapper: R | ((element: Instance<T>) => R)): Matcher<R> {
        return new Matcher(this.element, new InstancePattern(constructor, mapper));
    }

    caseInstanceLike<R, T extends Class | Function>(type: T, test: (element: Instance<T>) => boolean, mapper: R | ((element: Instance<T>) => (R))): Matcher<R> {
        return new Matcher(this.element, new InstanceLikePattern(type, test, mapper));
    }

    caseTrue<R>(mapper: R | (() => R)): Matcher<R> {
        return new Matcher(this.element, new TruePattern(mapper));
    }

    caseFalse<R>(mapper: R | (() => R)): Matcher<R> {
        return new Matcher(this.element, new FalsePattern(mapper));
    }

    caseBoolean<R>(mapper: R | ((element: boolean) => R)): Matcher<R> {
        return new Matcher(this.element, new BooleanPattern(mapper));
    }

    caseEqual<R>(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        return new Matcher(this.element, new EqualPattern(otherElement, mapper));
    }

    caseAlmostEqual<R>(otherElement: number, mapper: R | (() => R), acceptedError: number = 0.00000000001): Matcher<R> {
        return new Matcher(this.element, new AlmostEqualPattern(otherElement, mapper, acceptedError));
    }

    caseGreater<R>(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        return new Matcher(this.element, new GreaterPattern(otherElement, mapper));
    }

    caseLower<R>(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        return new Matcher(this.element, new LowerPattern(otherElement, mapper));
    }

    caseNull<R>(mapper: R | (() => R)): Matcher<R> {
        return new Matcher(this.element, new NullPattern(mapper));
    }

    caseNumber<R>(mapper: R | ((element: number) => R)): Matcher<R> {
        return new Matcher(this.element, new NumberPattern(mapper));
    }

    caseObject<R>(mapper: R | ((element: object) => R)): Matcher<R> {
        return new Matcher(this.element, new ObjectPattern(mapper));
    }

    caseObjectLike<R, O extends object>(other: O, mapper: R | ((element: O) => R)): Matcher<R> {
        return new Matcher(this.element, new ObjectLikePattern(other, mapper));
    }

    // todo change maper element type with a type that contains the checked keys
    caseObjectWith<R, K extends Array<string>>(keys: K, mapper: R | ((element: Record<number, keyof K>) => R)): Matcher<R> {
        return new Matcher(this.element, new ObjectWithPattern(keys, mapper));
    }

    caseString<R>(mapper: R | ((element: string) => R)): Matcher<R> {
        return new Matcher(this.element, new StringPattern(mapper));
    }

    caseStringLike<R>(test: RegExp, mapper: R | ((element: RegExpExecArray) => R)): Matcher<R> {
        return new Matcher(this.element, new StringLikePattern(test, mapper));
    }

    caseEmptyString<R>(mapper: R | ((element: string) => R)): Matcher<R> {
        return new Matcher(this.element, new EmptyStringPattern(mapper));
    }
}


class Matcher<R> {

    private readonly patterns: Pattern<R>[] = [];

    constructor(private readonly element: any, startingPattern?: Pattern<R>) {

        if (startingPattern != null)
            this.patterns.push(startingPattern);

    }

    caseInstance<T extends Class | Function>(constructor: T, mapper: R | ((element: Instance<T>) => R)): Matcher<R> {
        this.patterns.push(new InstancePattern(constructor, mapper));
        return this;
    }

    caseInstanceLike<T extends Class | Function>(type: T, test: (element: Instance<T>) => boolean, mapper: R | ((element: Instance<T>) => (R))): Matcher<R> {
        this.patterns.push(new InstanceLikePattern(type, test, mapper));
        return this;
    }

    caseTrue(mapper: R | (() => R)): Matcher<R> {
        this.patterns.push(new TruePattern(mapper));
        return this;
    }

    caseFalse(mapper: R | (() => R)): Matcher<R> {
        this.patterns.push(new FalsePattern(mapper));
        return this;
    }

    caseBoolean(mapper: R | ((element: boolean) => R)): Matcher<R> {
        this.patterns.push(new BooleanPattern(mapper));
        return this;
    }

    caseEqual(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        this.patterns.push(new EqualPattern(otherElement, mapper));
        return this;
    }

    caseAlmostEqual(otherElement: number, mapper: R | (() => R), acceptedError: number = 0.00000000001): Matcher<R> {
        this.patterns.push(new AlmostEqualPattern(otherElement, mapper, acceptedError));
        return this;
    }

    caseGreater(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        this.patterns.push(new GreaterPattern(otherElement, mapper));
        return this;
    }

    caseLower(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        this.patterns.push(new LowerPattern(otherElement, mapper));
        return this;
    }

    caseNull(mapper: R | (() => R)): Matcher<R> {
        this.patterns.push(new NullPattern(mapper));
        return this;
    }

    caseNumber(mapper: R | ((element: number) => R)): Matcher<R> {
        this.patterns.push(new NumberPattern(mapper));
        return this;
    }

    caseObject(mapper: R | ((element: object) => R)): Matcher<R> {
        this.patterns.push(new ObjectPattern(mapper));
        return this;
    }

    caseObjectLike<O extends object>(other: O, mapper: R | ((element: O) => R)): Matcher<R> {
        this.patterns.push(new ObjectLikePattern(other, mapper));
        return this;
    }

    // todo change maper element type with a type that contains the checked keys
    caseObjectWith<K extends Array<string>>(keys: K, mapper: R | ((element: Record<number, keyof K>) => R)): Matcher<R> {
        this.patterns.push(new ObjectWithPattern(keys, mapper));
        return this;
    }

    caseString(mapper: R | ((element: string) => R)): Matcher<R> {
        this.patterns.push(new StringPattern(mapper));
        return this;
    }

    caseStringLike(test: RegExp, mapper: R | ((element: RegExpExecArray) => R)): Matcher<R> {
        this.patterns.push(new StringLikePattern(test, mapper));
        return this;
    }

    caseEmptyString(mapper: R | ((element: string) => R)): Matcher<R> {
        this.patterns.push(new EmptyStringPattern(mapper));
        return this;
    }

    default(mapper: R | (() => R)): R {

        for (let i = 0; i < this.patterns.length; i++) {

            const pattern = this.patterns[i];

            if (pattern.matches(this.element))
                return pattern.map(this.element);
        }

        return new BaseMapper<R>(mapper).map(this.element);
    }
}


interface Pattern<R> {
    matches(element: any): boolean;
    map(element: any): R;
}

class BaseMapper<R> {

    constructor(readonly mapper: any) {}

    map(element: any): R {
        return typeof this.mapper === "function" ?
            this.mapper(element) : this.mapper;
    }
}

class InstancePattern<T extends Class | Function, R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly constructor: T, readonly mapper: R | ( (element: Instance<T>) => R) ) {
        super(mapper);
    }

    matches(element: any): boolean {
        return element instanceof this.constructor;
    }
}

class InstanceLikePattern<T extends Class | Function, R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly constructor: T, readonly test: (element: Instance<T>) => boolean, mapper: R | ( (element: Instance<T>) => R) ) {
        super(mapper);
    }

    matches(element: any): boolean {
        return element instanceof this.constructor && this.test(element);
    }
}

class EqualPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return element === this.otherElement;
    }
}

class EmptyStringPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: string) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "string" && element.length === 0;
    }
}

class StringPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: string) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "string";
    }
}

class StringLikePattern<R> implements Pattern<R> {

    constructor(readonly test: RegExp, readonly mapper: R | ( (match: RegExpExecArray) => R)) {}

    matches(element: any) {
        return typeof element === "string" && this.test.exec(element) != null;
    }

    map(element: any): R {
        if (typeof this.mapper !== "function")
            return this.mapper;

        const match = this.test.exec(element);

        return (this.mapper as Function)(match);
    }
}

class NumberPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: number) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "number";
    }
}

class AlmostEqualPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: number, readonly mapper: R | ( (element: any) => R), readonly acceptedError: number) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(this.otherElement) && AlmostEqualPattern.almostEqual(element, this.otherElement, this.acceptedError);
    }

    static almostEqual(a: number, b: number, acceptedError: number): boolean {
        return Math.abs(a - b) < acceptedError;
    }
}

class GreaterPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && (element as number) > this.otherElement;
    }
}

class LowerPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && (element as number) < this.otherElement;
    }
}

class BooleanPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "boolean";
    }
}

class TruePattern<R> extends BooleanPattern<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && element;
    }
}

class FalsePattern<R> extends BooleanPattern<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && !element;
    }
}

class ObjectPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: object) => R)) {
        super(mapper);
    }

    matches(element: any): boolean {
        return typeof element === "object";
    }
}

class ObjectLikePattern<R, X> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly other: X, readonly mapper: R | ( (element: X) => R)) {
        super(mapper);
    }

    matches(element: any): boolean {
        return typeof element === "object" && ObjectLikePattern.isLike(element, this.other)
    }

    static isLike(element: any, other: any): boolean {
        const otherKeys = Object.keys(other);
        for (let i = 0; i < otherKeys.length; i++) {
            const key = otherKeys[i];
            if (element[key] !== other[key])
                return false;
        }
        return true;
    }
}

class ObjectWithPattern<R, K extends Array<string>> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly keys: K, readonly mapper: R | ( (element: Record<number, keyof K>) => R)) {
        super(mapper);
    }

    matches(element: any): boolean {
        return typeof element === "object" && ObjectWithPattern.contains(element, this.keys)
    }

    static contains(element: any, keys: string[]): boolean {
        return keys.every(key => element[key] !== undefined)
    }
}

class NullPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: object) => R)) {
        super(mapper);
    }

    // null or undefined are both matched
    matches(element: any): boolean {
        return element == null;
    }
}

/*
los pattern de number que se llamen number+cosa
numbergreater
numberalmostequal
para que sea mas descriptivo

hacer comparador de cadenas, empty, mas larga, mas corta, igual tamaño, alfabeticamente antes, alfabeticamente despues


operaciones de listas (arrays)
vacio, mayor que, menor que, igual tamaño, iguales elementos ...


dates? pero sin volverse loco
 */