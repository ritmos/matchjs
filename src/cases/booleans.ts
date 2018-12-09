import {BaseMapper, Case} from "./base";

export class BooleanPattern<R> extends BaseMapper<R> implements Case<R> {

    constructor(readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return typeof element === "boolean";
    }
}

export class TruePattern<R> extends BooleanPattern<R> implements Case<R> {

    constructor(readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && element;
    }
}

export class FalsePattern<R> extends BooleanPattern<R> implements Case<R> {

    constructor(readonly mapper: R | ((element: any) => R)) {
        super(mapper);
    }

    matches(element: any) {
        return super.matches(element) && !element;
    }
}