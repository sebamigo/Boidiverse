import Vector from "victor";
import {VECTOR_X} from "./constants";

export var Direction = function (direction_vector) {
    var _this = this;

    this.calculateAngle = function (direction_vector) {
        return Math.acos(direction_vector.dot(VECTOR_X) / (direction_vector.length() * VECTOR_X.length()));
    }

    this.calculateDirection = function (direction_vector) {
        return ((direction_vector.cross(VECTOR_X) < 0.0)? 1: -1);
    }

    this.update = function () {
        _this.angle = _this.calculateAngle(_this.dir_vec);
        _this.direction = _this.calculateDirection(_this.dir_vec);
    }

    this.setDirection_vector = function (direction_vector) {
        _this.dir_vec = direction_vector;
        _this.update();
    }

    this.rotate = function (angle) {
        _this.dir_vec.rotateDeg(angle);
        _this.update();
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
    _this.update();
}