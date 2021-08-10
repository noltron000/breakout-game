import RectangleMOB from './rectangle-mob.js'

class Paddle extends RectangleMOB {
	constructor (canvasContext, coordinates, dimensions) {
		super(canvasContext, coordinates, dimensions)
	}
}

export default Paddle

/***
class OLD__Paddle extends Node { // CREATES USER CONTROLLED PADDLE //
	constructor(x, y, length, height, xDelta, yDelta, colour) {
		super(x, y, length, height, xDelta, yDelta, colour);
		this.shape = "square";
		this.length = length;
		this.height = height;
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

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.length, this.height);
		ctx.fill();
		ctx.closePath();
	}

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
***/
