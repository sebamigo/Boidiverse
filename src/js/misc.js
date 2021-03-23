export var degToRad = function (deg) {
    return deg * Math.PI / 180;
}

export var radToDeg = function (rad) {
    return rad * (180/Math.PI);
}

export var distance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}