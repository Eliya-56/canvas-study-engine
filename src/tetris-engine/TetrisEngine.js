import config from "./config"
import Engine from "../Engine";
import FieldState from "./FieldState";

export default class TetrisEngine {

    constructor(parentElement) {
        this.engine = new Engine(
            parentElement,
            config.fieldWidth * config.rowCount + config.rowCount * config.fieldInterval + config.fieldInterval,
            config.fieldWidth * config.columnCount + config.columnCount * config.fieldInterval + config.fieldInterval
        );

        this._useBorders = config.defaultUseBorders;

        this._defineSizes();
        this._initFields();
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

    _initFields() {
        // Init fields state
        this.fields = new Array(this.rowCount);
        for (let i = 0; i < this.rowCount; i++) {
            this.fields[i] = new Array(this.columnCount);
            for (let j = 0; j < this.columnCount; j++) {
                this.fields[i][j] = new FieldState(false, false);
            }
        }
    }

    _buildFields() {
        for (let i = 0; i < this.rowCount; i++) {
            for (let j = 0; j < this.columnCount; j++) {
                if (this.fields[i][j].turnState) {
                    this.turnOnField(i, j);
                }
                else {
                    this.turnOffField(i, j);
                }
                if (this.fields[i][j].isHighlighted) {
                    this.highlightField(i, j);
                }
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

    set useBorders(value) {
        if (!(typeof value === "boolean")) {
            console.error(`Value must be boolean. ${value} was given`);
            return;
        }
        this._useBorders = value;
        this._buildFields();
    }

    turnOnField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        let borderColor = this._useBorders ? config.fieldBorderColor : config.fieldBackgroundColor;
        let lineWidth = this.fields[x][y].isHighlighted ? config.fullLineWidth : config.defaultLineWidth;

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, config.fieldDefaultContentColor, lineWidth);
        this.fields[x][y].turnState = true;
    }

    turnOffField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        let borderColor = this._useBorders ? config.fieldBorderColor : config.fieldBackgroundColor;
        let lineWidth = this.fields[x][y].isHighlighted ? config.fullLineWidth : config.defaultLineWidth;
 
        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, config.fieldBackgroundColor, lineWidth);
        this.fields[x][y].turnState = false;
    }

    highlightField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        let borderColor = this._useBorders ? config.fieldBorderColor : config.fieldBackgroundColor;
        let contentColor = this.fields[x][y].turnState ? config.fieldDefaultContentColor : config.fieldBackgroundColor;

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, contentColor, config.fullLineWidth);
        this.fields[x][y].isHighlighted = true;
    }

    removeHighlight(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was givven`;
        }

        let borderColor = this._useBorders ? config.fieldBorderColor : config.fieldBackgroundColor;
        let contentColor = this.fields[x][y].turnState ? config.fieldDefaultContentColor : config.fieldBackgroundColor;

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, contentColor, config.defaultLineWidth);
        this.fields[x][y].isHighlighted = false;
    }
}