canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d"); // CANVAS CONTEXT

class Node { // PARENT NODE — SETS UP INTERACTABLE SHAPES //
	constructor(x = 0, y = 0, xDelta = 0, yDelta = 0, colour = 'grey') {
		this.x = x;
		this.y = y;
		this.xDelta = xDelta;
		this.yDelta = yDelta;
		this.colour = colour;
	}

	draw() { // CATCH-ALL DRAW FUNCTION //
		ctx.fillStyle = this.colour
		ctx.beginPath();
		if (this.radius != undefined) { // This object has a radius. It is a circle.
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		}
		else if ((this.length != undefined) && (this.height != undefined)) { // This object has a length and width. It is a square.
			ctx.rect(this.x, this.y, this.length, this.height);
		}
		else {
			console.log("This object is neither circle nor square?")
		}
		ctx.fill();
		ctx.closePath();
	}
}

class Ball extends Node { // CREATES GAME BALL WITH PHYSICS //
	constructor(x, y, xDelta, yDelta, radius, colour) {
		super(x, y, xDelta, yDelta, colour);
		this.radius = radius;
	}
}

class Paddle extends Node { // CREATES USER CONTROLLED PADDLE //
	constructor(x, y, xDelta, yDelta, length, height, colour, pressL, pressR) {
		super(x, y, xDelta, yDelta, colour);
		this.length = length;
		this.height = height;
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

	mouseMoveHandler(event) { // Allows for mouse movements in game
		// Needs Refactored — has some ugly code
		let xRel = event.clientX - canvas.offsetLeft;
		if (xRel > 0 && xRel < canvas.width) {
			paddleX = xRel - paddleWidth / 2;
		}
	}
}

class Brick extends Node { // CREATES DESTRUCTABLE BRICKS //
	constructor(x, y, length, height, colour, health) {
		super(x, y, xDelta, yDelta, colour);
		this.length = length;
		this.height = height;
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
	constructor() {
		this.ball = new Ball(50, 50, 0, 0, 50, 'blue')
		this.paddle = new Paddle(70, 70, 0, 0, 50, 75, 'red')
		// this.brickArray = new BrickArray()
		// this.hud = new HUD()
	}

	start() { // ADDS THE ILLUSION OF MOTION OVER TIME //

	}
}

const game = new Game()
game.start()

game.ball.draw()
game.paddle.draw()