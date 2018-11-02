canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d"); // CANVAS CONTEXT

class Node { // PARENT NODE — SETS UP INTERACTABLE SHAPES //
	constructor(x = 0, y = 0, xDelta = 0, yDelta = 0, length = 0, height = 0, radius = 0, colour = 'grey') {
		this.x = x;
		this.y = y;
		this.xDelta = xDelta;
		this.yDelta = yDelta;
		this.length = length;
		this.height = height;
		this.radius = radius;
		this.colour = colour;
	}

	drawBox() { // DRAW BOX FUNCTION //
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.length, this.height);
		ctx.fill();
		ctx.closePath();
	}

	drawCircle() { // DRAW CIRCLE FUNCTION //
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}

class Ball extends Node { // CREATES GAME BALL WITH PHYSICS //
	constructor(x, y, xDelta, yDelta, radius, colour) {
		super(x, y, xDelta, yDelta, radius, colour);
	}
}

class Paddle extends Node { // CREATES USER CONTROLLED PADDLE //
	constructor(x, y, xDelta, yDelta, length, height, colour, pressL, pressR) {
		super(x, y, xDelta, yDelta, length, height, colour);
		this.pressL = pressL;
		this.pressR = pressR;
	}

	keyDownHandler(event) { // Setting up keypress event listener
		if (event.keyCode == 39) {
			pressR = true;
		}
		else if (event.keyCode == 37) {
			pressL = true;
		}
	}

	keyUpHandler(event) { // Removes status when key is lifted
		if (event.keyCode == 39) {
			pressR = false;
		}
		else if (event.keyCode == 37) {
			pressL = false;
		}
	}
}

class Brick extends Node { // CREATES DESTRUCTABLE BRICKS //
	constructor(x, y, length, height, colour, health) {
		super(x, y, length, height, colour);
		this.health = health;
	}
}

/*
HUD CLASS
*/

	/*
	LIVES CLASS
	*/

	/*
	SCORES CLASS
	*/

/*
GAME CLASS
*/
class Game { // GAME CLASS //
	constructor(canvasLength, canvasHeight) {
		this.ball = new Ball()
		this.paddle = new Paddle()
		this.brickArray = new BrickArray()
		this.hud = new HUD()
	}
}

/*
CANVAS CLASS
*/

