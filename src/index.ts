
export function match<R>(element: any): Matcher<R> {

}

export interface Matcher<R> {
    catch<T extends ClassType>(type: T, mapper: (element: InstanceType<T>) => R): Matcher<R>;
    catch<T extends ClassType>(type: T, mapper: R): Matcher<R>;
    catchObject(mapper: (element: object) => R): Matcher<R>;
    catchObject(mapper: R): Matcher<R>;
    catchNumber(mapper: (element: number) => R | R): Matcher<R>;
    catchNumber(mapper: R): Matcher<R>;
    catchString(mapper: (element: string) => R | R): Matcher<R>;
    catchString(mapper: R): Matcher<R>;
    catchBoolean(mapper: (element: boolean) => R | R): Matcher<R>;
    catchBoolean(mapper: R): Matcher<R>;
    catchEquals(otherElement: any, mapper: () => R | R): Matcher<R>;
    catchEquals(otherElement: any, mapper: R): Matcher<R>;
    catchNull(mapper: () => R | R): Matcher<R>;
    catchNull(mapper: R): Matcher<R>;
    default(mapper: () => R | R): Matcher<R>;
    default(mapper: R): Matcher<R>;
    end(): R;
}

interface ClassType {
    new(...args: any[]);
}

class MatcherImpl<R> implements Matcher<R>{

    readonly patterns: Pattern<R>[] = [];

    catch<T extends ClassType>(type: T, mapper: (element: InstanceType<T>) => (R)): Matcher<R> {
        this.patterns.push(new TypePattern(type, mapper));
    }

    catchBoolean(mapper: (element: boolean) => (R)): Matcher<R> {
        return undefined;
    }

    catchEquals(otherElement: any, mapper: () => (R)): Matcher<R> {
        return undefined;
    }

    catchNull(mapper: () => (R)): Matcher<R> {
        return undefined;
    }

    catchNumber(mapper: (element: number) => (R)): Matcher<R> {
        return undefined;
    }

    catchObject(mapper: (element: object) => (R)): Matcher<R> {
        return undefined;
    }

    catchString(mapper: (element: string) => (R)): Matcher<R> {
        return undefined;
    }

    default(mapper: () => (R)): Matcher<R> {
        return undefined;
    }

    end(): R {
        return undefined;
    }








}



interface Pattern<R> {
    matches(element: any): boolean;
    map(element: any): R;
}

class TypePattern<T extends ClassType, R> implements Pattern<R> {

    constructor(readonly type: T, readonly mapper: (element: T) => R | R) {}

    matches(element: any): boolean {
        return element instanceof this.type;
    }

    map(element: T) {
        return typeof this.mapper === "function" ?
            this.mapper(element) : this.mapper;
    }

}

class Mapp