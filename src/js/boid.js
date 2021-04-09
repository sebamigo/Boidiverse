import Vector from "victor";
import * as constants from "./constants";
import {Direction} from "./direction";

export var COUNT_ID = 0;

export var Boid = function (global_position_vector, direction_vector) {
    var _this = this;

    this.id = COUNT_ID++;
    this.pos_vec = global_position_vector;
    this.direction = new Direction(direction_vector);
    this.rotation_speed = constants.BOID_DEFAULT_ROTATION_SPEED;
    this.speed_vec = new Vector(constants.BOID_DEFAULT_SPEED_X, constants.BOID_DEFAULT_SPEED_Y);

    this.color = "#000000"
    this.shape = constants.SHAPE_TRIANGLE;
}