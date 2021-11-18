export enum IntersectType {
    None = 0,
    Parallel,
    Perpendicular,
    Collineation,
}

export enum Orientation {
    None = -1,
    Common = 0, //共面
    Intersect = 0,
    Positive,
    Negative,
}