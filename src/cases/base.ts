export interface Case<R> {
    matches(pattern: any): boolean;

    map(element: any): R;
}

export class BaseMapper<R> {

    constructor(readonly mapper: any) {
    }

    map(element: any): R {
        return typeof this.mapper === "function" ?
            this.mapper(element) : this.mapper;
    }
}