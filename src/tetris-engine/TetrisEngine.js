import config from "./config"
import Engine from "../Engine";

export default class TetrisEngine {

    constructor(parentElement) {
        this.engine = new Engine(
            parentElement,
            config.fieldWidth * config.rowCount + config.rowCount * config.fieldInterval + config.fieldInterval,
            config.fieldWidth * config.columnCount + config.columnCount * config.fieldInterval + config.fieldInterval
        );

        this._defineSizes();
        this._buildFields();
    }

    _defineSizes() {
        Object.defineProperty(this, "rowCount", {
            value: config.rowCount,
            enumerable: true
        });
        Object.defineProperty(this, "columnCount", {
            value: config.columnCount,
            enumerable: true
        });
    }

    _buildFields() {
        // Init fields state
        this.fields = new Array(this.rowCount);
        for (let i = 0; i < this.rowCount; i++) {
            this.fields[i] = new Array(this.columnCount);
        }
        
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.columnCount; j++) {
                this.turnOffField(i, j);
                this.fields[i][j] = false;
            }
        }
    }

    _isValidCoordinates(x, y) {
        if (x < 0 || x > this.rowCount - 1) {
            return false;
        }

        if (y < 0 || y > this.columnCount - 1) {
            return false;
        }

        return true;
    }

    _drawField(x, y, borderColor, contentColor, lineWidth = config.defaultLineWidth) {
        this.engine.drawFillRectangle(
            x * (config.fieldWidth + config.fieldInterval) + config.fieldInterval,
            y * (config.fieldWidth + config.fieldInterval) + config.fieldInterval,
            config.fieldWidth,
            config.fieldWidth,
            contentColor,
            lineWidth
        );

        // Width of border line isn't included in rect
        // Shift start point by lineWidth value and reduce rect width and heigh for 2 * lineWidth beacuse of first shift
        this.engine.drawStrokeRectangle(
            x * (config.fieldWidth + config.fieldInterval) + config.fieldInterval + lineWidth,
            y * (config.fieldWidth + config.fieldInterval) + config.fieldInterval + lineWidth,
            config.fieldWidth - 2 * lineWidth,
            config.fieldWidth - 2 * lineWidth,
            borderColor,
            lineWidth
        );
    }

    _clearFieldBeforeDraw(x, y) {
        this._drawField(x, y, config.fieldBackgroundColor, config.fieldBackgroundColor);
    }

    turnOnField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, config.fieldBorderColor, config.fieldDefaultContentColor);
        this.fields[x][y] = true;
    }

    turnOffField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, config.fieldBorderColor, config.fieldBackgroundColor);
        this.fields[x][y] = false;
    }

    highLightField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, config.fieldBorderColor, config.fieldBackgroundColor, config.fullLineWidth);
    }
}