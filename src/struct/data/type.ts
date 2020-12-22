export enum IntersectType {
    None = 0,
    Parallel,
    Perpendicular,
    Collineation,
}

export enum Orientation {
    None = -1,
    Common, //共面
    Positive,
    Negative,
    Intersect,
}