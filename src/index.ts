
export function match<R>(element: any): Matcher<R> {
    return new MatcherImpl<R>(element);
}

export interface Matcher<R> {
    caseClass<T extends ClassType>(type: T, mapper: (element: InstanceType<T>) => R): Matcher<R>;
    caseClass<T extends ClassType>(type: T, mapper: R): Matcher<R>;
    caseObject(mapper: (element: object) => R): Matcher<R>;
    caseObject(mapper: R): Matcher<R>;
    caseNumber(mapper: (element: number) => R): Matcher<R>;
    caseNumber(mapper: R): Matcher<R>;
    caseString(mapper: (element: string) => R): Matcher<R>;
    caseString(mapper: R): Matcher<R>;
    caseBoolean(mapper: (element: boolean) => R): Matcher<R>;
    caseBoolean(mapper: R): Matcher<R>;
    caseEquals(otherElement: any, mapper: () => R): Matcher<R>;
    caseEquals(otherElement: any, mapper: R): Matcher<R>;
    caseNull(mapper: () => R | R): Matcher<R>;
    caseNull(mapper: R): Matcher<R>;
    default(mapper: () => R): R;
    default(mapper: R): R;
}

interface ClassType {
    new(...args: any[]);
}

class MatcherImpl<R> implements Matcher<R>{

    readonly patterns: Pattern<R>[] = [];

    constructor(readonly element: any) {}

    caseClass<T extends ClassType>(type: T, mapper: R | ((element: InstanceType<T>) => (R))): Matcher<R> {
        this.patterns.push(new TypePattern(type, mapper));
        return this;
    }

    caseBoolean(mapper: R | ((element: boolean) => R)): Matcher<R> {
        return undefined;
    }

    caseEquals(otherElement: any, mapper: R | (() => R)): Matcher<R> {
        return undefined;
    }

    caseNull(mapper: R | (() => R)): Matcher<R> {
        return undefined;
    }

    caseNumber(mapper: R | ((element: number) => R)): Matcher<R> {
        return undefined;
    }

    caseObject(mapper: R | ((element: object) => R)): Matcher<R> {
        this.patterns.push(new ObjectPattern(mapper));
        return this;
    }

    caseString(mapper: R | ((element: string) => R)): Matcher<R> {
        return undefined;
    }

    default(mapper: R | (() => R)): R {
        this.patterns.push(new DefaultPattern(mapper));
        return this.mapWithMatchingCase();
    }

    mapWithMatchingCase(): R {
        for (let i = 0; i < this.patterns.length; i++) {

            const pattern = this.patterns[i];

            if (pattern.matches(this.element))
                return pattern.map(this.element);
        }
    }








}



interface Pattern<R> {
    matches(element: any): boolean;
    map(element: any): R;
}

class BasePattern<R> {

    constructor(readonly mapper: any) {}

    map(element: object): R {
        return typeof this.mapper === "function" ?
            this.mapper(element) : this.mapper;
    }
}

class TypePattern<T extends ClassType, R> extends BasePattern<R> implements Pattern<R> {

    constructor(readonly type: T, readonly mapper: R | ( (element: T) => R) ) {
        super(mapper);
    }

    matches(element: any): boolean {
        return element instanceof this.type;
    }
}

class ObjectPattern<R> extends BasePattern<R> implements Pattern<R> {
    
    constructor(readonly mapper: R | ( (element: object) => R)) {
        super(mapper);
    }

    matches(element: any): boolean {
        return typeof element === "object";
    }
}

class DefaultPattern<R> extends BasePattern<R> implements Pattern<R> {

    constructor(readonly mapper: R | ( (element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return true;
    }
}