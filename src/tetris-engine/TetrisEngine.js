import config from "./config"
import Engine from "../Engine";
import FieldState from "./FieldState";

export default class TetrisEngine {

    constructor(parentElement, customConfig = config) {

        this._initConfig(customConfig);

        this.engine = new Engine(
            parentElement,
            config.fieldWidth * config.columnCount
            + config.columnCount * config.fieldInterval
            + config.fieldInterval
            + 2 * config.mainBorderWidth,
            config.fieldWidth * config.rowCount
            + config.rowCount * config.fieldInterval
            + config.fieldInterval
            + config.headerHeight
            + 2 * config.mainBorderWidth
        );

        this._useBorders = config.defaultUseBorders;

        this._defineSizes(config.rowCount, config.columnCount);
        this._initFields();
        this._drawMainBorder();
        this._buildFields();
        this._startListenKeyboard(parentElement);
    }

    _initConfig(customConfig) {
        if (customConfig === config) {
            return;
        }

        if(customConfig.hasOwnProperty("columnCount")) {
            config.columnCount = customConfig.columnCount;
        }
        if(customConfig.hasOwnProperty("rowCount")) {
            config.rowCount = customConfig.rowCount;
        }
        if(customConfig.hasOwnProperty("mainBorderWidth")) {
            config.mainBorderWidth = customConfig.mainBorderWidth;
        }
        if(customConfig.hasOwnProperty("fieldWidth")) {
            config.fieldWidth = customConfig.fieldWidth;
        }
        if(customConfig.hasOwnProperty("fieldInterval")) {
            config.fieldInterval = customConfig.fieldInterval;
        }
        if(customConfig.hasOwnProperty("fieldBackgroundColor")) {
            config.fieldBackgroundColor = customConfig.fieldBackgroundColor;
        }
        if(customConfig.hasOwnProperty("fieldBorderColor")) {
            config.fieldBorderColor = customConfig.fieldBorderColor;
        }
        if(customConfig.hasOwnProperty("fieldDefaultContentColor")) {
            config.fieldDefaultContentColor = customConfig.fieldDefaultContentColor;
        }
        if(customConfig.hasOwnProperty("defaultLineWidth")) {
            config.defaultLineWidth = customConfig.defaultLineWidth;
        }
        if(customConfig.hasOwnProperty("fullLineWidth")) {
            config.fullLineWidth = customConfig.fullLineWidth;
        }
        if(customConfig.hasOwnProperty("defaultUseBorders")) {
            config.defaultUseBorders = customConfig.defaultUseBorders;
        }
        if(customConfig.hasOwnProperty("headerHeight")) {
            config.headerHeight = customConfig.headerHeight;
        }
        if(customConfig.hasOwnProperty("headerMargin")) {
            config.headerMargin = customConfig.headerMargin;
        }

        Object.freeze(config);
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
        this.fields = new Array(this.columnCount);
        for (let i = 0; i < this.columnCount; i++) {
            this.fields[i] = new Array(this.rowCount);
            for (let j = 0; j < this.rowCount; j++) {
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
        for (let i = 0; i < this.columnCount; i++) {
            for (let j = 0; j < this.rowCount; j++) {
                this.switchField(i, j);
            }
        }
    }

    _isValidCoordinates(x, y) {
        if (x < 0 || x > this.columnCount - 1) {
            return false;
        }

        if (y < 0 || y > this.rowCount - 1) {
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

    switchField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from ${this._rowCount} x ${this._columnCount}, but x:${x} y:${y} was given`;
        }

        if (this.fields[x][y].turnState) {
            this.turnOnField(x, y);
        }
        else {
            this.turnOffField(x, y);
        }
        if (this.fields[x][y].isHighlighted) {
            this.highlightField(x, y);
        }
    }

    turnOnField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from ${this._rowCount} x ${this._columnCount}, but x:${x} y:${y} was given`;
        }

        let borderColor = this._useBorders ? config.fieldBorderColor : config.fieldBackgroundColor;
        let lineWidth = this.fields[x][y].isHighlighted ? config.fullLineWidth : config.defaultLineWidth;

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, config.fieldDefaultContentColor, lineWidth);
        this.fields[x][y].turnState = true;
    }

    turnOffField(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was given`;
        }

        let borderColor = this._useBorders ? config.fieldBorderColor : config.fieldBackgroundColor;
        let lineWidth = this.fields[x][y].isHighlighted ? config.fullLineWidth : config.defaultLineWidth;

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, config.fieldBackgroundColor, lineWidth);
        this.fields[x][y].turnState = false;
    }

    highlightField(x, y, color = null) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was given`;
        }

        let borderColor = color ? color : config.highlightColor;
        let contentColor = this.fields[x][y].turnState ? config.fieldDefaultContentColor : config.fieldBackgroundColor;

        this._clearFieldBeforeDraw(x, y);
        this._drawField(x, y, borderColor, contentColor, config.fullLineWidth);
        this.fields[x][y].isHighlighted = true;
    }

    removeHighlight(x, y) {
        if (!this._isValidCoordinates(x, y)) {
            throw `Cordinates out of range. Range is from 30 x 40, but x:${x} y:${y} was given`;
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

    get rowCount() {
        return config.rowCount;
    }

    get columnCount() {
        return config.columnCount;
    }

    get config() {
        return config;
    }
}