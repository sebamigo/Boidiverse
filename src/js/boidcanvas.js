import {Boidiverse} from "./boidiverse";
import {Boidcontroller} from "./boidcontroller";

export var Boidcanvas = function (canvas_element) {

    this.init = function (canvas_size) {
        _this.canvas.width = canvas_size.x;
        _this.canvas.height = canvas_size.y;
        _this.boidiverse = new Boidiverse();
        _this.boidiverse.init(canvas_size.x,canvas_size.y);
        _this.boidcontroller = new Boidcontroller(_this.boidiverse);

        _this.loop();
    }

    var _this = this;
    this.canvas = canvas_element;
    this.ctx = this.canvas.getContext("2d");
    this.stop = false;

    this.loop = function () {
        var lastTime;
        var requiredElapsed=1000/60;

        var loopIt = function(now){
            if (_this.stop) { return; }

            requestAnimationFrame(loopIt);

            if (!lastTime) { lastTime = now; }
            var elapsed=now-lastTime;

            if(elapsed>requiredElapsed){
                var timedelta = (elapsed/1000);
                _this.updateBounds();
                _this.clearCanvas();
                //TODO
                _this.boidcontroller.update(timedelta);
                _this.boidiverse.draw(_this.ctx);
                lastTime=now;
            }
        };
        loopIt();
    }

    this.updateBounds = function () {
        let w = window.innerWidth;
        let h = window.innerHeight;
        if(w !== _this.canvas.width || h !== _this.canvas.height) {
            _this.canvas.width = w;
            _this.canvas.height = h;
            _this.boidiverse.boidstorage.buildChunks(w, h);
        }
    }

    this.clearCanvas = function () {
        _this.ctx.globalCompositeOperation = 'destination-over';
        _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height); // clear canvas
    };
    
}