import Vector from "../../lib/js/victor/index";
import {VECTOR_X} from "./constants";

export var Direction = function (direction_vector) {
    var _this = this;

    this.calculateAngle = function (direction_vector) {
        return Math.acos(direction_vector.dot(VECTOR_X) / (direction_vector.length() * VECTOR_X.length()));
    }

    this.calculateDirection = function (direction_vector) {
        return ((direction_vector.cross(VECTOR_X) < 0.0)? 1: -1);
    }

    this.setDirection_vector = function (direction_vector) {
        _this.dir_vec = direction_vector;
        _this.angle = calculateAngle(direction_vector);
        _this.direction = calculateDirection(direction_vector);
    }

    this.getDirection_vector = function () {
        return _this.dir_vec;
    }

    this.getAngle = function () {
        return _this.angle;
    }

    this.getDirection = function () {
        return _this.direction;
    }

    this.dir_vec = direction_vector;
    this.angle = _this.calculateAngle(direction_vector);
    this.direction = _this.calculateDirection(direction_vector);
}