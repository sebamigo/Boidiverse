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
        var requiredElapsed=0;
        let totalFrames = 0;
        let startTime;


        var loopIt = function(now){
            if(startTime === undefined) {
                startTime = now;
            }
            if (_this.stop) { return; }

            requestAnimationFrame(loopIt);

            if (!lastTime) { lastTime = now; }
            var elapsed=now-lastTime;

            if(elapsed>requiredElapsed) {
                var timedelta = (elapsed/1000);
                _this.updateBounds();
                _this.clearCanvas();
                //TODO
                _this.boidcontroller.update(timedelta, _this.ctx);
                _this.boidiverse.draw(_this.ctx);
                lastTime=now;

                let fps = (totalFrames) / ((now - startTime)/1000);
                //console.log(totalFrames + " " + now + " "+startTime)

                totalFrames++;

                _this.drawFPS(_this.ctx, fps);
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

    this.drawFPS = function (ctx, fps) {
        ctx.fillText("fps: "+ Math.round(fps), 5, 30);
    }
    
}