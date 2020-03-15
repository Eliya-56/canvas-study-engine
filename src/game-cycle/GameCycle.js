const msInSec = 1000;

export default class GameCycle {

    constructor(gameObject, fps = 30) {
        if (typeof (gameObject.render) === "function") {
            this._gameObject = gameObject;
            this._fps = fps;
            this._frameInterval = msInSec / this._fps;
            this._stopCycle = false;
        }
        else {
            throw "Passed argument doesn't contain 'render' function";
        }
    }

    _internalFrameFunction(tFrame) {
        if(this._stopCycle) {
            this._stopCycle = false;
            return;
        }
        window.requestAnimationFrame(this._internalFrameFunction.bind(this));

        if (this._isFirstFrame) {
            this._lastTick = tFrame;
            this._isFirstFrame = false;
            this._frameCount = 0;
        }

        let msFromLastFrame = performance.now() - this._lastTick;
        if (msFromLastFrame >= this._frameInterval) {
            this._lastTick = tFrame;
            this._frameCount++;
            
            this._gameObject.render(this._frameCount, msFromLastFrame);
        }
    }

    start() {
        this._isFirstFrame = true;
        window.requestAnimationFrame(this._internalFrameFunction.bind(this));
    }

    stop() {
        this._stopCycle = true;
    }
}