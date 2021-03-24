import * as drawer from "./drawer";
import * as parameter from "./parameters";
import {BoidStorage} from "./boidstorage";

export var Boidiverse = function () {

    var _this = this;
    this.boidstorage = new BoidStorage();

    this.init = function (canvas_width, canvas_height) {
        _this.boidstorage.init(canvas_width, canvas_height);
    }

    this.draw = function (ctx) {
        _this.boidstorage.forEachBoid((c_boid) => {
            ctx.translate(c_boid.b.pos_vec.x,c_boid.b.pos_vec.y);

            ctx.rotate(c_boid.b.direction.getDirection() * c_boid.b.direction.getAngle());

            drawer.drawShape(ctx, c_boid.b.shape);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transformation
        })
        if(parameter.DEBUG_DRAWGRID === true) {
            _this.boidstorage.drawChunkGrid(ctx);
        }
    }
}