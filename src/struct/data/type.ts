export enum IntersectType {
    None = 0,
    Parallel,
    Perpendicular,
    Collineation,
}

export enum Orientation {
    None = -1,
    Positive = 1,
    Negative = 2,
    Common = 3, //共面
    Intersect = 3,
}