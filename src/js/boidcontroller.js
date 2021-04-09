import {Boid} from "./boid";
import Vector from "victor";
import * as drawer from "./drawer";
import * as parameter from "./parameters";
import * as misc from "./misc"
import {Boidiverse} from "./boidiverse";
import {degToRad, radToDeg} from "./misc";
import {DEBUG_MAX_CHECK_DISTANCE, DEBUG_MAX_SWARM_DISTANCE, DEBUG_TO_NEAR_DISTANCE} from "./parameters";
import {Direction} from "./direction";
import {BOID_MAX_SPEED, VECTOR_X} from "./constants";

export var Boidcontroller = function (boidiverse) {

    var _this = this;

    this.boidiverse = boidiverse;


    this.update = function (timeDelta, ctx) {
        _this.boidiverse.boidstorage.forEachBoid((c_boid) => {
            let boid = c_boid.b;
            let nearBoids = _this.boidiverse.boidstorage.getBoidsInNeighborhood(boid.id, DEBUG_MAX_CHECK_DISTANCE, ctx);
            let swarmBoids = nearBoids.filter(distant_boid => distant_boid.distance <= DEBUG_MAX_SWARM_DISTANCE);
            let toNearBoids = swarmBoids.filter(distant_boid => distant_boid.distance <= DEBUG_TO_NEAR_DISTANCE);

            //Flugrichtung bestimmen
            // -> Alignment
            _this.adjustFlightDirection(boid, swarmBoids, timeDelta);

            //Geschwindigkeit Anpassen
            // -> Separation of Boids
            _this.adjustFlightSpeed(boid, toNearBoids, timeDelta);

            //_this.moveInWaves(boid, ctx);

            //Bewegen & in grenzen bleiben
            _this.moveBoidForward(c_boid, timeDelta);
            _this.keepBoidInsideBounds(c_boid.b, _this.boidiverse.boidstorage.bounds_vec);

            //_this.keepBoidInsideBounds_bounce(c_boid.b, _this.boidiverse.boidstorage.bounds_vec, timeDelta, ctx);
        });
    }

    this.adjustFlightDirection = function (boid, boidsToAdjust, timeDelta) {
        let direction_vec_sum = new Vector(0,0);
        for (const distant_boid of boidsToAdjust) {
            direction_vec_sum.add(distant_boid.b.direction.getDirection_vector());
        }
        if(!(direction_vec_sum.x === 0 && direction_vec_sum.y === 0)) {
            _this.turnBoid(boid, direction_vec_sum, timeDelta);
        }
    }

    this.adjustFlightSpeed = function (boid, boidsToAdjust, timeDelta) {
        let centroid = new Vector(0,0);
        let destination = new Vector(0,0);
        if(boidsToAdjust.length > 0) {
            for (const distant_boid of boidsToAdjust) {
                centroid.add(distant_boid.b.pos_vec);
            }
            centroid.divide(new Vector(boidsToAdjust.length, boidsToAdjust.length));
            destination.add(boid.pos_vec).subtract(centroid);
            destination.rotate(-1 * boid.direction.getDirection() * boid.direction.getAngle());
            destination.normalize();
        }
        destination.multiply(new Vector(0.5,0.5));
        destination.add(new Vector(1,0));
        destination.normalize();
        destination.multiply(new Vector(BOID_MAX_SPEED,BOID_MAX_SPEED));

        boid.speed_vec = destination;
    }

    this.turnBoid = function (boid, direction_destination_vec, timeDelta) {
        direction_destination_vec = direction_destination_vec.clone();
        let act_direction_vec = boid.direction.getDirection_vector().clone();
        let move_angle = Math.acos(direction_destination_vec.dot(act_direction_vec) / (direction_destination_vec.length() * act_direction_vec.length()));
        let move_direction = ((direction_destination_vec.cross(act_direction_vec) < 0.0)? 1: -1);
        if(radToDeg(move_angle) > 5) {
            boid.direction.rotate(boid.rotation_speed * move_direction * timeDelta);
        }
    }
    this.moveBoidForward = function (c_boid, timeDelta) {
        let old_c_vec = c_boid.c_vec.clone();

        let move_destination = new Vector(c_boid.b.speed_vec.x * timeDelta, c_boid.b.speed_vec.y * timeDelta);
        move_destination.rotate(c_boid.b.direction.getDirection() * c_boid.b.direction.getAngle());
        c_boid.b.pos_vec.add(move_destination);

        let new_c_vec = new Vector(
            Math.floor(c_boid.b.pos_vec.x / _this.boidiverse.boidstorage.chunkSize),
            Math.floor(c_boid.b.pos_vec.y / _this.boidiverse.boidstorage.chunkSize)
        );
        old_c_vec.subtract(new_c_vec);
        if(old_c_vec.x !== 0 || old_c_vec.y !== 0) {
            _this.boidiverse.boidstorage.removeFromChunk(c_boid);
            c_boid.c_vec = new_c_vec;
            _this.boidiverse.boidstorage.pushOnChunk(c_boid);
        }
    }
    this.keepBoidInsideBounds = function (boid, bounds_vec) {
        if(boid.pos_vec.x < 0) {
            boid.pos_vec.x = bounds_vec.x;
        } else if (boid.pos_vec.x > bounds_vec.x) {
            boid.pos_vec.x = 0;
        }
        if(boid.pos_vec.y < 0) {
            boid.pos_vec.y = bounds_vec.y;
        } else if (boid.pos_vec.y > bounds_vec.y) {
            boid.pos_vec.y = 0;
        }
    }
    this.keepBoidInsideBounds_bounce = function (boid, bounds_vec, timeDelta, ctx) {

        if(_this.isInsideBounceZone(boid, bounds_vec)) {
            if(boid.bounce0_vec === undefined) {
                boid.bounce0_vec = new Vector(boid.pos_vec.x, boid.pos_vec.y  - bounds_vec.y);
                boid.bounce0_m = boid.direction.getDirection_vector().y / boid.direction.getDirection_vector().x;
            }

            let x0 = boid.bounce0_vec.x;
            let y0 = boid.bounce0_vec.y;
            let m = boid.bounce0_m;

            ctx.strokeStyle = "red";
            ctx.beginPath();
            for (let x = boid.pos_vec.x; x < boid.pos_vec.x + 500; x += 1) {
                let y = _this.bounceFormula(x, m, x0, y0) + bounds_vec.y;
                if(x === boid.pos_vec.x) {
                    ctx.moveTo(x, y);
                }else {
                    ctx.lineTo(x , y);
                }
            }
            ctx.stroke();
            ctx.strokeStyle = "black";

            let moveTo_vec = new Vector(boid.pos_vec.x + 1, _this.bounceFormula(boid.pos_vec.x + 1, m, x0, y0) + bounds_vec.y);
            moveTo_vec.subtract(boid.pos_vec);

            if(radToDeg(boid.direction.getAngle()) > 90) {
                moveTo_vec.multiplyX({x:-1});
            }


            boid.direction = new Direction(moveTo_vec);

            //_this.turnBoid(boid, moveTo_vec, timeDelta);

            boid.speed_vec = new Vector(1,0).multiply(new Vector(BOID_MAX_SPEED,BOID_MAX_SPEED));
        }
        else
        {
            if(boid.bounce0_vec !== undefined) {
                boid.bounce0_vec = undefined;
                boid.bounce0_m = undefined;
            }
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(boid.pos_vec.x, boid.pos_vec.y);
            ctx.lineTo(boid.pos_vec.x + boid.direction.getDirection_vector().x * 100, boid.pos_vec.y + boid.direction.getDirection_vector().y * 100);
            ctx.stroke();
            ctx.strokeStyle = "black";
        }



    }
    this.isInsideBounceZone = function(boid, bounds_vec) {
        return (bounds_vec.y - boid.pos_vec.y) <= 200;
    }

    this.bounceFormula = function (x, m, x0, y0) {
        let mq = Math.pow(m,2);
        let x0q = Math.pow(x0, 2);
        let y0q = Math.pow(y0, 2);
        let a = ( 0.5 * ( mq/ y0 ) );
        let b = ( (m * y0) - (mq * x0) ) / y0;
        let c = (( 0.5 * mq * x0q) + y0q - (m * x0 * y0) ) / y0;

        return ((a * Math.pow(x,2) + b * x + c));
    }
    this.moveInWaves = function (boid, ctx) {
        let y_correction = 0;
        let first = true;
        /*for (let x = 0; x < 1000; x += 10) {
            let dest = new Vector(x, Math.sin(x/20) * 20);

            dest.rotate(boid.direction.getDirection() * boid.direction.getAngle());
            //dest.add(boid.pos_vec);
            if(first) {
                first = false;
                ctx.moveTo(dest.x, dest.y);
            }
            else {
                ctx.lineTo(dest.x, dest.y);
            }
        }*/
        let dest = new Vector(boid.pos_vec.x, boid.pos_vec.y + (Math.sin(boid.pos_vec.x/20) * 20));
        dest.add(new Vector(boid.pos_vec.x + (Math.sin(boid.pos_vec.y/20) * 20), boid.pos_vec.y));
        dest.divide(new Vector(2,2));
        //dest.multiply(new Vector(1.5,1.5))
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(boid.pos_vec.x, boid.pos_vec.y);
        ctx.lineTo(dest.x, dest.y);
        ctx.stroke();
        ctx.strokeStyle = "black";
    }
}