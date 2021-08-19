import MobileObject from './mobile-object.js'

class Paddle extends MobileObject {
	constructor (game, transform) {
		super(game, transform, {color: 'black'})
	}
}

export default Paddle

/***
-< CLASS STYLE >-
class OLD__Paddle extends Node { // CREATES USER CONTROLLED PADDLE //
	constructor(x, y, length, height, xDelta, yDelta, colour) {
		...
		this.pressL = false;
		this.pressR = false;

		// Setting up keypress event listener
		document.addEventListener("keydown", this.keyDownHandler.bind(this));
		document.addEventListener("keyup", this.keyUpHandler.bind(this));
		document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
		//                                                        ↑ ↑ ↑ ↑ ↑ ↑
		// .bind(this) forces "this" context to be remembered in future steps.
		//otherwise, "this" will be the #document
	}

	...

	move() {
		if (this.pressR == true) {
			this.x += 6;
		} else if (this.pressL == true) {
			this.x -= 6;
		}
		this.x += this.xDelta
		this.y += this.yDelta
		this.boundary()
	}

	keyDownHandler(event) { // Adds status when key is pressed
		if (event.keyCode == 37) {
			this.pressL = true;
		} else if (event.keyCode == 39) {
			this.pressR = true;
		}
	}

	keyUpHandler(event) { // Removes status when key is lifted
		if (event.keyCode == 37) {
			this.pressL = false;
		} else if (event.keyCode == 39) {
			this.pressR = false;
		}
	}

	mouseMoveHandler(event) { // Allows for mouse movements in game
		this.x = event.clientX - canvas.offsetLeft - this.length / 2;
	}
}

-< SEQUENTIAL STYLE >-
// Paddle Variables
...
let rightPressed = false;
let leftPressed = false;

// Adding Event Handlers
const keyDownHandler = (e) => {
	if (e.keyCode == 39) {
		rightPressed = true;
	}
	else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

const keyUpHandler = (e) => {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

const mouseMoveHandler = (e) => {
	let relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
***/
