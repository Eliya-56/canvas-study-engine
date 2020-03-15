import config from "./config"
import Engine from "../Engine";
import FieldState from "./FieldState";

export default class TetrisEngine {

    constructor(parentElement, rowCount = config.rowCount, columnCount = config.columnCount) {
        this.engine = new Engine(
            parentElement,
            config.fieldWidth * rowCount
            + rowCount * config.fieldInterval
            + config.fieldInterval
            + 2 * config.mainBorderWidth,
            config.fieldWidth * columnCount
            + columnCount * config.fieldInterval
            + config.fieldInterval
            + config.headerHeight
            + 2 * config.mainBorderWidth
        );

        this._useBorders = config.defaultUseBorders;

        this._defineSizes(rowCount, columnCount);
        this._initFields();
        this._drawMainBorder();
        this._buildFields();
        this._startListenKeyboard(parentElement);
    }

    _startListenKeyboard(parentElement) {
        parentElement.addEventListener('keydown', this._keyboardHandler.bind(this));
    }

    _keyboardHandler(event) {
        if (typeof (this._keyboardCustomHandler) === "function") {
            event.preventDefault();
            this._keyboardCustomHandler(
                {
                    keyCode: event.keyCode,
                    key: event.key
                }
            );
        }
    }

    _defineSizes(rowCount, columnCount) {
        Object.defineProperty(this, "rowCount", {
            value: rowCount,
            enumerable: true
        });
        Object.defineProperty(this, "columnCount", {
            value: columnCount,
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

    _drawMainBorder() {
        this.engine.drawStrokeRectangle(
            0,
            0,
            this.engine.canvas.width,
            this.engine.canvas.height,
            config.fieldBorderColor,
            config.mainBorderWidth
        )
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
            x * (config.fieldWidth + config.fieldInterval) + config.fieldInterval + config.mainBorderWidth,
            y * (config.fieldWidth + config.fieldInterval) + config.fieldInterval + config.headerHeight + config.mainBorderWidth,
            config.fieldWidth,
            config.fieldWidth,
            contentColor,
            lineWidth
        );

        // Width of border line isn't included in rect
        // Shift start point by lineWidth value and reduce rect width and heigh for 2 * lineWidth beacuse of first shift
        this.engine.drawStrokeRectangle(
            x * (config.fieldWidth + config.fieldInterval) + config.fieldInterval + lineWidth + config.mainBorderWidth,
            y * (config.fieldWidth + config.fieldInterval) + config.fieldInterval + lineWidth + config.headerHeight + config.mainBorderWidth,
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

    set keyboardHandler(value) {
        this._keyboardCustomHandler = value;
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

    _clearHeader() {
        this.engine.drawFillRectangle(
            config.mainBorderWidth,
            config.mainBorderWidth,
            this.engine.canvas.width - 2 * config.mainBorderWidth,
            config.headerHeight,
            config.fieldBackgroundColor
        );
    }

    setHeaderText(text) {
        this._clearHeader();
        this.engine.putText(
            text,
            config.headerMargin,
            config.headerMargin + 45,
            config.headerHeight - 2 * config.headerMargin
        );
    }
}