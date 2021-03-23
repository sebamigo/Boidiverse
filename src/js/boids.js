import Victor from "../../lib/js/victor/index";

var vec = new Victor(42, 1337);

vec.add(new Victor(2,0));

console.log(vec);

var DEBUG_SHOWGRID = false;
var DEBUG_SHOWLINES = true;
var DEBUG_GENERATEDBOID_AMOUNT = 1000;

var DEBUG_CHUNKSIZE = 50;
//Distanz die bestimmt welchen boids gefolgt wird
var DEBUG_MAX_SWARM_DISTANCE = 100;
//alle Boids innerhalb dieser Distanz und außerhalb der DEBUG_MAX_SCHWARM_DISTANCE werden gemieden
var DEBUG_MAX_CHECK_DISTANCE = 125;

var DEBUG_SPEED = 0;
var DEBUG_TURN_SPEED = 50;
var BOID_IDS = 0;

var degToRad = function (deg) {
    return deg * Math.PI / 180;
}

var radToDeg = function (rad) {
    return rad * (180/Math.PI);
}

var distance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

var stayIn360Deg = function (deg) {
    return (deg>=360)?stayIn360Deg(deg-360.0):(deg<0)?stayIn360Deg(deg+360.0):deg;
}


var CanvasBoids = function (canvas) {
    this.init = function (canvas_width, canvas_height) {
        _this.cw = canvas_width;
        _this.ch = canvas_height;

        _this.canvas.width = _this.cw;
        _this.canvas.height = _this.ch;

        _this.boidiverse.chunkgrid.buildChunks(_this.cw, _this.ch);
        //_this.boidiverse.generateBoids(DEBUG_GENERATEDBOID_AMOUNT,_this.cw, _this.ch);

        _this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(new Boid(200, 200, 90)));
        //_this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(new Boid(200, 250, 90)));
        //_this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(new Boid(250, 225, 90)));

        let bob = new Boid(100, 100, 270);
        bob.id = 6;
        bob.speed_x = -10;
        _this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(bob));

        let klop = new Boid(300, 100, 270);
        klop.id = 5;
        klop.speed_x = -10;
        _this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(klop));


        let eva = new Boid(100, 300, 90);
        eva.id = 7;
        eva.speed_x = -10;
        _this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(eva));

        let basti = new Boid(300, 300, 90);
        basti.id = 8;
        basti.speed_x = -10;
        _this.boidiverse.addChunkedBoid(_this.boidiverse.chunkBoid(basti));


        this.loop();
    };

    var _this = this;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.stop = false;
    this.cw = 0;
    this.ch = 0;

    this.boidiverse = new Boidiverse();

    this.loop = function () {

        var lastTime;
        var requiredElapsed=1000/60;

        var loopIt = function(now){
            if (_this.stop) {
                return;
            }
            requestAnimationFrame(loopIt);

            if(!lastTime){lastTime=now;}
            var elapsed=now-lastTime;



            if(elapsed>requiredElapsed){
                var timedelta = (elapsed/1000);
                _this.updateBounds();
                _this.clearCanvas();
                _this.updateBoidiverse(timedelta);
                _this.drawBoidiverse();
                lastTime=now;
            }
        };
        loopIt();
    };

    this.updateBounds = function () {
        if(window.innerWidth !== _this.cw || window.innerHeight !== _this.ch) {
            _this.cw = window.innerWidth;
            _this.ch = window.innerHeight;

            _this.canvas.width = _this.cw;
            _this.canvas.height = _this.ch;

            _this.boidiverse.chunkgrid.buildChunks(_this.cw, _this.ch);
        }
    }

    this.clearCanvas = function () {
        _this.ctx.globalCompositeOperation = 'destination-over';
        _this.ctx.clearRect(0, 0, _this.cw, _this.ch); // clear canvas
    };

    _this.keepBoidInsideBounds = function (chunkedBoid) {
        if(chunkedBoid.boid.x < 0)
        {
            chunkedBoid.boid.x = _this.cw;
        } else if (chunkedBoid.boid.x > _this.cw) {
            chunkedBoid.boid.x = 0;
        }
        if(chunkedBoid.boid.y < 0)
        {
            chunkedBoid.boid.y = _this.ch;
        } else if (chunkedBoid.boid.y > _this.ch) {
            chunkedBoid.boid.y = 0;
        }
    }
    this.updateBoidiverse = function (timeDelta) {
        _this.boidiverse.forEachBoid((chunkedBoid) => {
            let nearBoids = _this.boidiverse.getNearbyChunkedBoids(chunkedBoid, DEBUG_MAX_CHECK_DISTANCE);
            let swarmBoids = nearBoids.filter(chunkedBoidWithDis => chunkedBoidWithDis.distance <= DEBUG_MAX_SWARM_DISTANCE);
            let nonSwarmBoids = nearBoids.filter(chunkedBoidWithDis => !swarmBoids.includes(chunkedBoidWithDis));

            //Boid main direction alignment
            let angleSum = chunkedBoid.boid.dir;
            let count = 1;

            //Goal direction alignment
            if(chunkedBoid.boid.goalDir !== undefined) {
                angleSum += stayIn360Deg(chunkedBoid.boid.goalDir) * chunkedBoid.boid.goalDir_weight;
                count += chunkedBoid.boid.goalDir_weight;
            }

            //Swarm direction alignment
            //Goal: form a swarm with all nearby boids
            var maxDebuglinesPerBoid = {num: 10};
            for (const distanedChunkedBoid of swarmBoids) {
                _this.drawDebugLines(chunkedBoid.boid.x,chunkedBoid.boid.y,distanedChunkedBoid.chunkedBoid.boid.x ,distanedChunkedBoid.chunkedBoid.boid.y, maxDebuglinesPerBoid);

                angleSum += stayIn360Deg(distanedChunkedBoid.chunkedBoid.boid.dir);
            }
            count += swarmBoids.length;

            //NonSwarm seperation
            //Goal: move away from all boids that are not part of the swarm
            if(nonSwarmBoids.length > 0) {
                let centroid_x = 0;
                let centroid_y = 0;

                maxDebuglinesPerBoid = {num: 10};
                _this.ctx.strokeStyle = "red";
                for (const distanedChunkedBoid of nonSwarmBoids) {
                    _this.drawDebugLines(chunkedBoid.boid.x,chunkedBoid.boid.y,distanedChunkedBoid.chunkedBoid.boid.x ,distanedChunkedBoid.chunkedBoid.boid.y, maxDebuglinesPerBoid);
                    centroid_x += distanedChunkedBoid.chunkedBoid.boid.x;
                    centroid_y += distanedChunkedBoid.chunkedBoid.boid.y;
                }
                _this.ctx.strokeStyle = "black";
                centroid_x = centroid_x/nonSwarmBoids.length;
                centroid_y = centroid_y/nonSwarmBoids.length;

                let akt_dir_x = Math.sin(degToRad(chunkedBoid.boid.dir) - (0.5 * Math.PI));
                let akt_dir_y = - Math.cos(degToRad(chunkedBoid.boid.dir) - (0.5 * Math.PI));

                let moveVector_x = (centroid_x - chunkedBoid.boid.x) * -1;
                let moveVector_y = (centroid_y - chunkedBoid.boid.y) * -1;

                let moveVector_angle = radToDeg(Math.acos((akt_dir_x * moveVector_x + akt_dir_y * moveVector_y) / (Math.sqrt(Math.pow(akt_dir_x, 2) + Math.pow(akt_dir_y, 2)) * Math.sqrt(Math.pow(moveVector_x, 2) + Math.pow(moveVector_y, 2)))));
                let direction = ( ( ( Math.atan(akt_dir_y/akt_dir_x) - Math.atan(moveVector_y/moveVector_x) ) > 0 ) ? 1 : -1);

                if(direction === -1) {
                    moveVector_angle = 360 - moveVector_angle;
                }

                if(chunkedBoid.boid.id === 5) {
                    console.log("akt_dir: " +akt_dir_x +" "+akt_dir_y);
                    console.log("test: " + moveVector_angle);
                    console.log("test direc: " +direction);
                }

                angleSum += (moveVector_angle - chunkedBoid.boid.dir);
                count += 1;

                if(chunkedBoid.boid.id === 5 || chunkedBoid.boid.id === 6) {
                    _this.drawDebugLines(chunkedBoid.boid.x,chunkedBoid.boid.y,chunkedBoid.boid.x+moveVector_x,chunkedBoid.boid.y+moveVector_y, {num:1}, true);
                }
            }

            let desired_direction = angleSum/count;

            // turn the Boid towards the desired direction
            _this.boidiverse.turnBoidTo(chunkedBoid, desired_direction, timeDelta);

            // move Boid forward and keep the Boid inside the canvas Bounds
            _this.boidiverse.moveBoidForward(chunkedBoid,timeDelta);
            _this.keepBoidInsideBounds(chunkedBoid);
        });
    }

    this.drawDebugLines = function (x1, y1, x2, y2, maxDebuglinesPerBoid, important = false) {
        if((DEBUG_SHOWLINES || important) && maxDebuglinesPerBoid.num > 0) {
            _this.ctx.lineWidth = 0.1;
            _this.ctx.beginPath();
            _this.ctx.moveTo(x1, y1);
            _this.ctx.lineTo(x2, y2);
            _this.ctx.stroke();
            _this.ctx.lineWidth = 1;
            maxDebuglinesPerBoid.num--;
        }
    }

    this.drawBoidiverse = function () {
        _this.boidiverse.forEachBoid((chunkedBoid) => {
            _this.ctx.translate(chunkedBoid.boid.x,chunkedBoid.boid.y);
            _this.ctx.rotate(degToRad(chunkedBoid.boid.dir))

            switch (chunkedBoid.boid.shape) {
                case "triangle":
                    //_this.ctx.fillStyle = chunkedBoid.boid.color;
                    _this.drawTriangleShape(_this.ctx);
                    //_this.ctx.fillStyle = "#000000";
                    break;
            }
            _this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transformation
        })
        if(DEBUG_SHOWGRID === true) {
            _this.boidiverse.chunkgrid.drawChunkGrid(_this.ctx);
        }

    }

    this.drawTriangleShape = function (ctx) {
        ctx.beginPath();
        ctx.moveTo(-6.25, 0);
        ctx.lineTo(0, -3.125);
        ctx.lineTo(0, 3.125);
        ctx.fill();
    }
}

var Boidiverse = function () {
    this.init = function () {
    }
    var _this = this;
    this.chunkedBoids = new Map();
    console.log(this.chunkedBoids);
    this.chunkgrid = new ChunkGrid();

    this.forEachBoid = function (chunkedBoidFunction) {
        for (var chunkedBoid of _this.chunkedBoids.values()) {
            chunkedBoidFunction(chunkedBoid);
        }

        /*for (let x = 0; x < _this.chunkgrid.chunks.length; x++) {
            for (let y = 0; y < _this.chunkgrid.chunks[x].length; y++) {
                for (let i = 0; i < _this.chunkgrid.chunks[x][y].length; i++) {
                    boidFunction(_this.chunkgrid.chunks[x][y][i]);
                }
            }
        }*/
    }

    this.chunkBoid = function (boidToChunk) {
        return {
            boid: boidToChunk,
            grid_x: Math.floor(boidToChunk.x / _this.chunkgrid.chunkSize),
            grid_y: Math.floor(boidToChunk.y / _this.chunkgrid.chunkSize)
        };
    }

    this.addChunkedBoid = function (chunkedBoid) {
        _this.chunkedBoids.set(chunkedBoid.boid.id, chunkedBoid);
        _this.chunkgrid.pushOnChunk(chunkedBoid.boid.id, chunkedBoid.grid_x, chunkedBoid.grid_y);
    }

    this.removeChunkedBoid = function (chunkedBoid) {
        _this.chunkedBoids.delete(chunkedBoid.boid.id);
        _this.chunkgrid.removeFromChunk(chunkedBoid.boid.id, chunkedBoid.grid_x, chunkedBoid.grid_y);
    }

    this.generateBoids = function (amount, max_width, max_height) {
        for (let i = 0; i < amount; i++) {
            let b = new Boid(Math.random() * max_width ,Math.random() * max_height ,Math.random() * 360);
            b.speed_x = DEBUG_SPEED;
            var rand = Math.random();
            /*b.goalDir_weight = Math.random() * 10;
            if(rand <= 0.125) {
                b.goalDir = 0;
                b.color = "#ff0000"
            } else if(rand <= 0.25) {
                b.goalDir = 90;
                b.color = "#0037ff"
            } else {
                b.goalDir_weight = 0;
            }*/

            _this.addChunkedBoid(_this.chunkBoid(b));
        }
    }

    this.moveBoidForward = function (chunkedBoid, timeDelta) {
        let old_grid_x = chunkedBoid.grid_x;
        let old_grid_y = chunkedBoid.grid_y;

        chunkedBoid.boid.moveForward(timeDelta);

        chunkedBoid.grid_x = Math.floor(chunkedBoid.boid.x/_this.chunkgrid.chunkSize);
        chunkedBoid.grid_y = Math.floor(chunkedBoid.boid.y/_this.chunkgrid.chunkSize);

        if(old_grid_x !== chunkedBoid.grid_x || old_grid_y !== chunkedBoid.grid_y) {
            _this.chunkgrid.removeFromChunk(chunkedBoid.boid.id, old_grid_x, old_grid_y);
            _this.chunkgrid.pushOnChunk(chunkedBoid.boid.id, chunkedBoid.grid_x, chunkedBoid.grid_y);
        }
    }
    this.turnBoidTo = function (chunkedBoid, new_dir, timeDelta) {
        let wa360 = 360 - (chunkedBoid.boid.dir - new_dir);
        let wa0 = (chunkedBoid.boid.dir - new_dir);

        if(chunkedBoid.boid.id === 5 && wa360 !== 360) {
            console.log(wa360 +" vs "+ wa0);
        }

        let direction;
        var direction_wa;
        if(wa360 < wa0)
        {
            direction = -1;
            direction_wa = wa360;
        } else {
            direction = 1;
            direction_wa = wa0;
        }

        if(chunkedBoid.boid.id === 5 && wa360 !== 360) {
            console.log("direction: " + direction);
            console.log("wa: "+ direction_wa);
        }

        if(Math.abs(direction_wa) >= 5) {
            //chunkedBoid.boid.dir = chunkedBoid.boid.dir + ((DEBUG_TURN_SPEED * (dir_dis / Math.abs(dir_dis) * timeDelta)));
            chunkedBoid.boid.turnTo(((DEBUG_TURN_SPEED * direction * timeDelta)));
        }
    }

    this.getNearbyChunkedBoids = function (chunkedBoid, maxDistance) {
        let arr = [];
        let overflow = Math.ceil(maxDistance/_this.chunkgrid.chunkSize);
        for (let x = 0 - (overflow - 1); x <= 2 + (overflow - 1); x++) {
            for (let y = 0 - (overflow - 1); y <= 2 + (overflow - 1); y++) {
                let c_x = (chunkedBoid.grid_x - 1) + x;
                let c_y = (chunkedBoid.grid_y - 1) + y;
                if(c_x >= 0 && c_x < _this.chunkgrid.chunks.length && c_y >= 0 && c_y < _this.chunkgrid.chunks[c_x].length)
                {
                    for (const boidId of _this.chunkgrid.chunks[c_x][c_y]) {
                        if(boidId !== chunkedBoid.boid.id) {
                            let boid_comp = _this.chunkedBoids.get(boidId);
                            let dis = distance(chunkedBoid.boid.x, chunkedBoid.boid.y,boid_comp.boid.x, boid_comp.boid.y);
                            if (dis <= maxDistance) {
                                arr.push({chunkedBoid: boid_comp, distance: dis});
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }
}

var ChunkGrid = function () {
    this.init = function () {

    }

    var _this = this;
    this.chunks = [];
    this.chunkSize = DEBUG_CHUNKSIZE;

    this.buildChunks = function (canvas_width, canvas_height) {
        _this.chunks = [];
        for (let x = 0; x < canvas_width/_this.chunkSize; x++) {
            let y_line = [];
            for (let y = 0; y < canvas_height/_this.chunkSize; y++) {
                y_line.push([]);
            }
            _this.chunks.push(y_line);
        }
        console.log(_this.chunks);
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

    this.removeFromChunk = function (positionable, grid_x, grid_y) {

        if(_this.chunks[grid_x] === undefined || _this.chunks[grid_x][grid_y] === undefined) {
        } else
        {
            let b_index = _this.chunks[grid_x][grid_y].findIndex((e) => e.id === positionable.id);
            if(b_index > -1) {
                _this.chunks[grid_x][grid_y].splice(b_index, 1);
            }
        }
    }

    this.pushOnChunk = function (positionable, grid_x, grid_y) {

        if(_this.chunks[grid_x] === undefined || _this.chunks[grid_x][grid_y] === undefined) {
        }
        else {
            _this.chunks[grid_x][grid_y].push(positionable);
        }
    }

    this.updateChunk = function () {

    }
}

var Boid = function (x, y, dir) {

    this.init = function () {
    }
    var _this = this;
    this.id = BOID_IDS++;
    this.x = x;
    this.y = y;

    this.speed_x = 0;
    this.speed_y = 0;


    this.goalDir = undefined;
    this.goalDir_weight = undefined;

    this.dir = stayIn360Deg(dir);

    this.color = "#000000";
    this.shape = "triangle";

    this.moveForward = function (timeDelta) {
        let dis_x = timeDelta * _this.speed_x;
        let dis_y = timeDelta * _this.speed_y;
        let bs_x = Math.cos(degToRad(_this.dir)) * dis_x +  -Math.sin(degToRad(_this.dir)) * dis_y;

        let bs_y = Math.sin(degToRad(_this.dir)) * dis_x +   Math.cos(degToRad(_this.dir)) * dis_y;

        _this.x = _this.x + bs_x;
        _this.y = _this.y + bs_y;
    }

    this.turnTo = function (dir) {
        _this.dir = (_this.dir + dir);
    }

}

var Point = function (x, y) {
}

var init = function () {
    let boids_div = document.getElementById("boids-js");
    var can = document.createElement("canvas");
    can.id = "boids-js-canvas";

    boids_div.appendChild(can);

    var cb = new CanvasBoids(can);
    cb.init(window.innerWidth, window.innerHeight);
}

init();

