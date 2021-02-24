/**
 * Defines a string dictionary.
 */
export interface IStringDictionary<T> {
    [index: string]: T;
}

/**
 * Defines a number dictionary.
 */
export interface INumberDictionary<T> {
    [index: number]: T;
}

/**
 * Defines a member that can have a value or be null.
 */
export type Nullable<T> = null | T;

/**
 * Defines a member that can have a value or be undefined.
 */
export type Undefinable<T> = undefined | T;


export function isDefined(value: any) {
    return value !== undefined && value !== null;
}


//Method
export function isUndefined(value: any): boolean {
    return value === undefined;
}

export function isFinite(value: any) {
    return typeof value == 'number' && globalThis.isFinite(value);
}

export function isString(value: any): boolean {
    return typeof value == 'string';
}