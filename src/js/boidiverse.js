import {Boid} from "./boid";
import Vector from "../../lib/js/victor/index";
import * as drawer from "./drawer";
import * as parameter from "./parameters";
import * as misc from "./misc"

export var Boidiverse = function () {

    var _this = this;
    this.boids = new Map();

    this.forEachBoid = function (iterateFunction) {
        _this.boids.forEach(iterateFunction);
    }

    this.draw = function (ctx) {
        _this.forEachBoid((boid) => {
            ctx.translate(boid.pos_vec.x,boid.pos_vec.y);

            ctx.rotate(boid.direction.getDirection() * boid.direction.getAngle());

            drawer.drawShape(ctx, boid.shape);
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transformation
        })
        if(parameter.DEBUG_DRAWGRID === true) {
            //_this.boidiverse.chunkgrid.drawChunkGrid(_this.ctx);
        }
    }

}