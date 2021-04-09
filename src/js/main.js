import Vector from "victor";
import {Boid} from "./boid";
import {Boidcanvas} from "./boidcanvas";
import {radToDeg} from "./misc";

let boids_div = document.getElementById("boids-js");
let can = document.createElement("canvas");
can.id = "boids-js-canvas";
boids_div.appendChild(can);

var cb = new Boidcanvas(can);
cb.init(new Vector(window.innerWidth, window.innerHeight))

var b = new Boid(new Vector(400,500), new Vector(-1,2));
console.log(b);
var c = new Boid(new Vector(400,600-10), new Vector(-4,1));
console.log(c);
var d = new Boid(new Vector(400+60,600-10), new Vector(-4,1));
console.log(d);

var e = new Boid(new Vector(400+35,600+55), new Vector(-4,1));
console.log(e);

var f = new Boid(new Vector(400+35,600+15), new Vector(-4,1));
console.log(f);

var g = new Boid(new Vector(400-10,600+25), new Vector(-4,1));
console.log(g);

cb.boidiverse.boidstorage.addBoid(b);/*
cb.boidiverse.boidstorage.addBoid(c);
cb.boidiverse.boidstorage.addBoid(d);
cb.boidiverse.boidstorage.addBoid(e);
cb.boidiverse.boidstorage.addBoid(f);
cb.boidiverse.boidstorage.addBoid(g);
/*
cb.boidiverse.boidstorage.addBoid(b);
cb.boidiverse.boidstorage.addBoid(c);
cb.boidiverse.boidstorage.addBoid(d);*//*
for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
        var d = new Boid(new Vector(500 + 10*x,400 + 10*y), new Vector(x,y))
        cb.boidiverse.boidstorage.addBoid(d);
    }
}
/*
for (let s_num = 0; s_num < 5; s_num++) {
    let swarm_pos = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    let swarm_direction = (Math.random()<=0.5)?-1:1;
    let swarm_size = Math.random() * 200;
    for (let i = 0; i < swarm_size; i++) {
        cb.boidiverse.boidstorage.addBoid(new Boid(swarm_pos.clone(), new Vector(swarm_direction, Math.random()-0.5).normalize()));
    }
}
*/

/*
for (let i = 0; i < 500; i++) {
    cb.boidiverse.boidstorage.addBoid(new Boid(new Vector(Math.random()*window.innerWidth, Math.random()*window.innerHeight), new Vector(Math.random()*2-1,Math.random()*2-1).normalize()));
}

var spawnSwarm = function (swarm_pos, swarm_direction, swarm_size) {
    for (let i = 0; i < swarm_size; i++) {
        cb.boidiverse.boidstorage.addBoid(new Boid(swarm_pos.clone().add(new Vector((Math.random()-0.5) * 100,(Math.random()-0.5)*100)), new Vector(swarm_direction, Math.random()*2-1).normalize()));
    }
}
/*
for (let i = 0; i < 4; i++) {
    let swarm_pos = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    let swarm_direction = Math.random()*2 - 1;
    let swarm_size = Math.random() * 200;
    spawnSwarm(swarm_pos, swarm_direction,swarm_size);
}

/*
let b = new Boid(new Vector(400,380), new Vector(1, 1));
cb.boidiverse.boidstorage.addBoid(b);/*
let bb = new Boid(new Vector(400,420), new Vector(1, 0.25));
cb.boidiverse.boidstorage.addBoid(bb);

console.log(b)
console.log(radToDeg(b.direction.getAngle()) + " " + b.direction.getDirection())
console.log(bb)
console.log(radToDeg(bb.direction.getAngle()) + " " + bb.direction.getDirection())*/