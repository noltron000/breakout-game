/*
NODE CLASS
*/
class Node {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	// DRAW BOX FUNCTION
	drawBox(length, height) {
		ctx.fillStyle = 'grey'
		ctx.beginPath();
		ctx.rect(this.x, this.y, length, height);
		ctx.fill();
		ctx.closePath();
	}

	// DRAW CIRCLE FUNCTION
	drawCircle(radius) {
		ctx.fillStyle = 'grey'
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}
}

/*
BALL CLASS
*/
class Ball extends Node {
	constructor(x, y, radius, xDelta, yDelta) {
		super(x, y);
		this.radius = radius;
		this.xDelta = xDelta;
		this.yDelta = yDelta;
	}
}

/*
PADDLE CLASS
*/
class Paddle extends Node {
	constructor(x, y, length, height, pressL, pressR) {
		super(x, y);
		this.length = length;
		this.height = height;
		this.pressL = pressL;
		this.pressR = pressR;
	}
}

/*
BRICK CLASS
*/
class Brick extends Node {
	constructor(x, y, length, height, health) {
		super(x, y);
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
class Game {
	constructor(canvasLength, canvasHeight) {
		// this.canvas = document.getElementById()
		// this.ctx = this.Canvas.getContext('2d');
		this.ball = new Ball()
		this.paddle = new Paddle()
		this.brickArray = new BrickArray()
		this.hud = new HUD()
	}
}

/*
CANVAS CLASS
*/