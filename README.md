# canvas-study-engine
Simple tetris engine for study purposes based on canvas 2D api.  
Here you have `TetrisEngine` and `GameCycle` classes.

## GameCycle
`GameCycle` class creates and manage cycle of rendering frames via [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

Constructor takes 2 argumets : 

`gameObject` - is any object that has **render** method. 

`fps` (optional) - desired number of frames per second number. That means that real fps won't be more than specified here. Default value is 30.

To start cycle call `Start()` function of `GameCycle`, to stop call `Stop()` function.

Example
```js
let game = {
    render: () => console.log('Render function')
};

let gameCycle = new GameCycle(game).
gameCycle.Start();
```

## TetrisEngine
`TetrisEngine` class draw tetris field and gives method to manage it. 

Constructor creates canvas element and draw tetris field there. It takes 2 args: 

`parentElement` - HTMLElement where tetris field will be drawn.

`customConfig` (optional) - tetris field configuration.  
By default threre is a config object: 
```js
const config = {
    mainBorderWidth: 1,
    fieldWidth: 30,
    fieldInterval: 3,
    columnCount: 20,
    rowCount: 25,
    fieldBackgroundColor: "white",
    fieldBorderColor: "gray",
    fieldDefaultContentColor: "gray",
    highlightColor: "red",
    defaultLineWidth: 0.5,
    fullLineWidth: 1,
    defaultUseBorders: true,
    headerHeight: 80,
    headerMargin: 15
}
``` 
The most important here is `columnCount` and `rowCount` props that configure field size.

Methods and properties of `TetrisEngine`:  
```js
turnOnField(x, y)
```
x, y - column number and y number of field that will be turn on.

-------------------------------

```js
turnOffField(x, y)
```
x, y - column number and y number of field that will be turn off.

-------------------------------

```js
switchField(x, y)
```
Change current state of field to opposite: if field was on then it will be turned off and vice versa.
x, y - column number and y number of field that will be switched.

-------------------------------

```js
setHeaderText(text)
```
There is a place at the top of tetris field where some text can be types. Using this method you can type `text` there.

-------------------------------

```js
highlightField(x, y)
```
The filed can be highlited(the border is thicker) without turning on.
x, y - column number and y number of field that will be highlited.

-------------------------------

```js
removeHighlight(x, y)
```
x, y - column number and y number of field that will be unhighlited.

-------------------------------

```js
keyboardHandler
```
You can assign to this property function that calls when keyboard event triggers. This function calls with 2 arg [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode) and [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)



