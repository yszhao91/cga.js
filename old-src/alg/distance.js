export function distance(obj0, obj1) {
    var className = obj1.constructor.name;
    if (!obj0["distance" + className])
    {
        console.error(obj1.constructor.name + "与" + obj2.constructor.name + "之间还没有距离算法")
        return
    }
    return obj0["distance" + className](obj1);
}

export function intersect(obj0, obj1) {
    var className = obj1.constructor.name;
    return obj0["intersect" + className](obj1);
}