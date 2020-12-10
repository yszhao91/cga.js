function divide(points) {
    var half = ~~(points.orderedByX.length * 0.5),
        leftByX = _.slice(points.orderedByX, 0, half),
        leftByY = getPointsOrderedByY(-Infinity, points.orderedByX[half].x, points.orderedByY), // O(n)
        rightByX = _.slice(points.orderedByX, half),
        rightByY = getPointsOrderedByY(points.orderedByX[half].x, Infinity, points.orderedByY); // O(n)

    return {
        left: { orderedByX: leftByX, orderedByY: leftByY },
        right: { orderedByX: rightByX, orderedByY: rightByY }
    };
}

function divide(points) {
    points.sort((a, b) => a.x - b.x);
    let half = ~~(points.length * 0.5);
    let leftByX = slice(0, half)
    let rightByX = slice(half)
    return {
        left: leftByX,
        right: rightByY
    };
}
function baseCase(points) {
    var combinations;

    if (points.length === 2) 
        return points; 

    combinations = [
        [points[0], points[1]],
        [points[0], points[2]],
        [points[1], points[2]]
    ];

    return _.minBy(combinations, getDistance);
}

export function closestPairPoints(points) {

    if (points.length <= 3)


}
