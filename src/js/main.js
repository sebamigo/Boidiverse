import Vector from "../../lib/js/victor/index";
import {Boid} from "./boid";
import {Boidcanvas} from "./boidcanvas";

let boids_div = document.getElementById("boids-js");
let can = document.createElement("canvas");
can.id = "boids-js-canvas";
boids_div.appendChild(can);

var cb = new Boidcanvas(can);
cb.init(new Vector(window.innerWidth, window.innerHeight))

var b = new Boid(new Vector(100,100), new Vector(0,0));
cb.boidiverse.boidstorage.addBoid(b);
console.log(b);

let i = 0;
for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
        var d = new Boid(new Vector(100 + 10*x,100 + 10*y), new Vector(x,y))
        cb.boidiverse.boidstorage.addBoid(d);
        console.log(d);
    }
}

cb.boidiverse.boidstorage.removeBoid(30);
cb.boidiverse.boidstorage.removeBoid(32);