import Vector from "victor";
import {DEBUG_CHUNKSIZE} from "./parameters";
import {distance, radToDeg} from "./misc";
import * as parameter from "./parameters";

export var BoidStorage = function () {
    var _this = this;

    this.boids = new Map();

    this.chunks = [];
    this.chunkSize = DEBUG_CHUNKSIZE;
    _this.bounds_vec = new Vector(0,0);

    this.init = function (canvas_width, canvas_height) {
        _this.bounds_vec = new Vector(canvas_width, canvas_height);
        _this.buildChunks(canvas_width, canvas_height);
    }

    this.buildChunks = function (canvas_width, canvas_height) {
        _this.bounds_vec = new Vector(canvas_width, canvas_height);
        _this.chunks = [];
        for (let x = 0; x < canvas_width/_this.chunkSize; x++) {
            let y_line = [];
            for (let y = 0; y < canvas_height/_this.chunkSize; y++) {
                y_line.push([]);
            }
            _this.chunks.push(y_line);
        }
        _this.forEachBoid(_this.pushOnChunk);
        console.log(_this.chunks);
    }


    this.addBoid = function (boid) {
        let chunk_vec = new Vector(
            Math.floor(boid.pos_vec.x / _this.chunkSize),
            Math.floor(boid.pos_vec.y / _this.chunkSize)
        );
        let c_boid = {b: boid, c_vec: chunk_vec};

        _this.boids.set(boid.id, c_boid);
        _this.pushOnChunk(c_boid);
    }

    this.removeBoid = function (boid_id) {
        let c_boid = _this.boids.get(boid_id);
        _this.boids.delete(c_boid.b.id);
        _this.removeFromChunk(c_boid);
    }

    //TODO: change c_boid to boid!!
    this.forEachBoid = function (iterateFunction) {
        _this.boids.forEach(iterateFunction);
    }

    this.getBoidsInNeighborhood = function (boid_id, maxDistance, ctx) {
        let c_boid = _this.boids.get(boid_id);

        let arr = [];
        let overflow = Math.ceil(maxDistance/_this.chunkSize);
        for (let x = 0 - (overflow - 1); x <= 2 + (overflow - 1); x++) {
            for (let y = 0 - (overflow - 1); y <= 2 + (overflow - 1); y++) {
                let c_x = (c_boid.c_vec.x - 1) + x;
                let c_y = (c_boid.c_vec.y - 1) + y;
                if(c_x >= 0 && c_x < _this.chunks.length && c_y >= 0 && c_y < _this.chunks[c_x].length)
                {
                    for (const comp_boid_id of _this.chunks[c_x][c_y]) {
                        if(comp_boid_id !== c_boid.b.id) {
                            let comp_c_boid = _this.boids.get(comp_boid_id);
                            let dis = distance(c_boid.b.pos_vec.x, c_boid.b.pos_vec.y,comp_c_boid.b.pos_vec.x, comp_c_boid.b.pos_vec.y);
                            let rel_pos = comp_c_boid.b.pos_vec.clone().subtract(c_boid.b.pos_vec);
                            let angle = Math.acos(rel_pos.dot(c_boid.b.direction.getDirection_vector()) / (rel_pos.length() * c_boid.b.direction.getDirection_vector().length()));
                            if (dis <= maxDistance && radToDeg(angle) <= 140) {
                                arr.push({b: comp_c_boid.b, distance: dis});

                                /*if(c_boid.b.id === 0 && comp_c_boid.b.id === 5) {
                                    console.log(rel_pos);
                                    console.log(radToDeg(angle));
                                }*/

                                if(false && c_boid.b.id === 0) {
                                    ctx.strokeStyle = "green";
                                    ctx.beginPath();
                                    ctx.moveTo(c_boid.b.pos_vec.x, c_boid.b.pos_vec.y);
                                    ctx.lineTo(comp_c_boid.b.pos_vec.x, comp_c_boid.b.pos_vec.y);
                                    ctx.stroke();
                                    ctx.strokeStyle = "black";
                                }
                            }
                            else
                            {
                                if(false && c_boid.b.id === 0) {
                                    ctx.strokeStyle = "red";
                                    ctx.beginPath();
                                    ctx.moveTo(c_boid.b.pos_vec.x, c_boid.b.pos_vec.y);
                                    ctx.lineTo(comp_c_boid.b.pos_vec.x, comp_c_boid.b.pos_vec.y);
                                    ctx.stroke();
                                    ctx.strokeStyle = "black";
                                }
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }

    this.removeFromChunk = function (c_boid) {

        if(_this.chunks[c_boid.c_vec.x] === undefined || _this.chunks[c_boid.c_vec.x][c_boid.c_vec.y] === undefined) {
        } else
        {
            let b_index = _this.chunks[c_boid.c_vec.x][c_boid.c_vec.y].findIndex((e) => e === c_boid.b.id);
            if(b_index > -1) {
                _this.chunks[c_boid.c_vec.x][c_boid.c_vec.y].splice(b_index, 1);
            }
        }
    }

    this.pushOnChunk = function (c_boid) {

        if(_this.chunks[c_boid.c_vec.x] === undefined || _this.chunks[c_boid.c_vec.x][c_boid.c_vec.y] === undefined) {
        }
        else {
            _this.chunks[c_boid.c_vec.x][c_boid.c_vec.y].push(c_boid.b.id);
        }
    }

    this.drawChunkGrid = function (ctx) {
        for (let x = 0; x < _this.chunks.length; x++) {
            for (let y = 0; y < _this.chunks[x].length; y++) {
                ctx.translate(_this.chunkSize * x, _this.chunkSize * y);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, _this.chunkSize);
                ctx.lineTo(_this.chunkSize, _this.chunkSize);
                ctx.lineTo(_this.chunkSize, 0);
                ctx.stroke();

                ctx.fillText("c: "+ _this.chunks[x][y].length, 5, 15);

                ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transformation
            }
        }

    }
}