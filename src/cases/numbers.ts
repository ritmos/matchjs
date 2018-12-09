import {BaseMapper, Case} from "./base";

export class NumberPattern<R> extends BaseMapper<R> implements Case<R> {

    constructor(readonly mapper: R | ((element: number) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "number";
    }
}

export class AlmostEqualPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: number, readonly mapper: R | ((element: any) => R), readonly acceptedError: number) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(this.otherElement) && AlmostEqualPattern.almostEqual(element, this.otherElement, this.acceptedError);
    }

    static almostEqual(a: number, b: number, acceptedError: number): boolean {
        return Math.abs(a - b) < acceptedError;
    }
}

export class GreaterPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && (element as number) > this.otherElement;
    }
}

export class GreaterEqualPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && (element as number) >= this.otherElement;
    }
}

export class LessPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && (element as number) < this.otherElement;
    }
}

export class LessEqualPattern<R> extends NumberPattern<R> {

    constructor(readonly otherElement: any, readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && (element as number) <= this.otherElement;
    }
}