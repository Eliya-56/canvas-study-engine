export default class FieldState {

    constructor(
        turnState,
        isHighlighted
    ) {
        this._turnState = turnState;
        this._isHighlighted = isHighlighted;
    }

    get turnState() {
        return this._turnState;
    }

    set turnState(value) {
        if (!(typeof value === "boolean")) {
            console.error(`Value must be boolean. ${value} was given`);
            return;
        }
        this._turnState = value;
    }

    get isHighlighted() {
        return this._isHighlighted;
    }

    set isHighlighted(value) {
        if (!(typeof value === "boolean")) {
            console.error(`Value must be boolean. ${value} was given`);
            return;
        }
        this._isHighlighted = value;
    }
}