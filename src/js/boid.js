import Vector from "../../lib/js/victor/index";
import * as constants from "./constants";
import {Direction} from "./direction";

export var Boid = function (global_position_vector, direction_vector) {
    var _this = this;

    this.chunk_pos_vec = 0;
    this.pos_vec = global_position_vector;
    this.direction = new Direction(direction_vector);
    this.speed_vec = new Vector(constants.BOID_DEFAULT_SPEED_X, constants.BOID_DEFAULT_SPEED_Y);

    this.color = "#000000"
    this.shape = constants.SHAPE_TRIANGLE;
}