import * as constants from "./constants";
import * as shapes from "./shapes";

export var drawShape = function (ctx, shape) {
    switch (shape) {
        case constants.SHAPE_TRIANGLE:
            shapes.triangle(ctx);
            break;
        default:
            console.log("Shape is not defined!");
            break;
    }
}