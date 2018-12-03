export function match<R>(element: any): Matcher<R> {
    return new MatcherImpl<R>(element);
}

export interface Matcher<R> {
    caseInstance<T extends Class | Function>(constructor: T, mapper: (element: T extends Class ? InstanceType<T> : any) => R): Matcher<R>;
    caseInstance<T extends Class | Function>(constructor: T, mapper: R): Matcher<R>;
    caseInstanceLike<T extends Class | Function>(type: T, test: (element: T extends Class ? InstanceType<T> : any) => boolean, mapper: (element: T extends Class ? InstanceType<T> : any) => R): Matcher<R>;
    caseInstanceLike<T extends Class | Function>(type: T, test: (element: T extends Class ? InstanceType<T> : any) => boolean, mapper: R): Matcher<R>;
    caseTrue(mapper: () => R) : Matcher<R>;
    caseTrue(mapper: R) : Matcher<R>;
    caseFalse(mapper: () => R) : Matcher<R>;
    caseFalse(mapper: R) : Matcher<R>;
    // caseArray??
    // caseCustomPattern
    caseObject(mapper: (element: object) => R): Matcher<R>;
    caseObject(mapper: R): Matcher<R>;
    caseObjectLike<O extends object>(other: O, mapper: (element: O) => R): Matcher<R>;
    caseObjectLike<O extends object>(other: O, mapper: R): Matcher<R>;
    caseObjectWith(keys: string[], mapper: (element: any) => R): Matcher<R>;
    caseObjectWith(keys: string[], mapper: R): Matcher<R>;
    caseNumber(mapper: (element: number) => R): Matcher<R>;
    caseNumber(mapper: R): Matcher<R>;
    caseString(mapper: (element: string) => R): Matcher<R>;
    caseString(mapper: R): Matcher<R>;
    caseBoolean(mapper: (element: boolean) => R): Matcher<R>;
    caseBoolean(mapper: R): Matcher<R>;
    caseEqual(otherElement: any, mapper: () => R): Matcher<R>;
    caseEqual(otherElement: any, mapper: R): Matcher<R>;
    caseAlmostEqual(otherElement: number, mapper: () => R, acceptedError?: number): Matcher<R>;
    caseAlmostEqual(otherElement: number, mapper: R, acceptedError?: number): Matcher<R>;
    caseGreater(otherElement: number, mapper: () => R): Matcher<R>;
    caseGreater(otherElement: number, mapper: R): Matcher<R>;
    caseLower(otherElement: number, mapper: () => R): Matcher<R>;
    caseLower(otherElement: number, mapper: R): Matcher<R>;
    caseNull(mapper: () => R | R): Matcher<R>;
    caseNull(mapper: R): Matcher<R>;
    default(mapper: () => R): R;
    default(mapper: R): R;
}

class StaticMatcherConstructor<R> {

}

interface Class {
    new(...args: any[]): Class;
}

type Instance<T> =
    T extends Class ? InstanceType<T> : any;


class MatcherImpl<R> implements Matcher<R>{

    readonly patterns: Pattern<R>[] = [];

    constructor(readonly element: any) {}

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

    default(mapper: R | (() => R)): R {
        return new CaseResolver<R>(this.element, this.patterns, mapper).resolve();
    }
}

class CaseResolver<R> {

    readonly defaultMapper: BaseMapper<R>;

    constructor(
        readonly element: any,
        readonly patterns: Pattern<R>[],
        defaultValue: R | (() => R)
    ) {
        this.defaultMapper = new BaseMapper<R>(defaultValue);
    }

    resolve(): R {

        for (let i = 0; i < this.patterns.length; i++) {

            const pattern = this.patterns[i];

            if (pattern.matches(this.element))
                return pattern.map(this.element);
        }

        return this.defaultMapper.map(this.element);
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

class StringPattern<R> extends BaseMapper<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: string) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "string";
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