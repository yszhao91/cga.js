export function distance(obj0, obj1) {
    var className = obj1.constructor.name;
    return obj0["distance" + className](obj1);
}

export function intersect(obj0, obj1) {
    var className = obj1.constructor.name;
    return obj0["intersect" + className](obj1);
}