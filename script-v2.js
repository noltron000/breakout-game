canvas = document.getElementById("myCanvas");
canvas.length = canvas.width
ctx = canvas.getContext("2d"); // CANVAS CONTEXT

class Node { // PARENT NODE — SETS UP INTERACTABLE SHAPES //
	constructor(x = 0, y = 0, xDelta = 0, yDelta = 0, colour = 'grey') {
		this.x = x;
		this.y = y;
		this.xDelta = xDelta;
		this.yDelta = yDelta;
		this.colour = colour;
	}

	boundary() { // LIMITS MOVEMENT TO CANVAS //
		if (this.x < 0) { // too far left
			this.x = 0;
		}
		else if (this.x > canvas.width - this.length) { // too far right
			this.x = canvas.width - this.length;
		}
		if (this.y < 0) { // too far up
			this.y = 0;
		}
		else if (this.y > canvas.height - this.height) { // too far down
			this.y = canvas.height - this.height;
		}
	}

	draw() { // PIXEL NODE
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, 1, 1)
		ctx.fill();
		ctx.closePath();
	}

	move() { // MOVE OBJECT
		this.x += this.xDelta
		this.y += this.yDelta
		this.boundary()
	}
}

class Ball extends Node { // CREATES GAME BALL WITH PHYSICS //
	constructor(x, y, xDelta, yDelta, radius, colour) {
		super(x, y, xDelta, yDelta, colour);
		this.radius = radius;
	}

	boundary() { // LIMITS MOVEMENT TO CANVAS //
		if (this.x < 0) { // too far left
			this.x = 0;
		}
		else if (this.x > canvas.width - this.radius) { // too far right
			this.x = canvas.width - this.radius;
		}
		if (this.y < 0) { // too far up
			this.y = 0;
		}
		else if (this.y > canvas.height - this.radius) { // too far down
			this.y = canvas.height - this.radius;
		}
	}

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}

class Paddle extends Node { // CREATES USER CONTROLLED PADDLE //
	constructor(x, y, xDelta, yDelta, length, height, colour, pressL, pressR) {
		super(x, y, xDelta, yDelta, colour);
		this.length = length;
		this.height = height;
		this.pressL = pressL;
		this.pressR = pressR;

		// Setting up keypress event listener
		// // bind(this) forces "this" context to be used.
		// // otherwise, "this" will be the entire #document.
		document.addEventListener("keydown", this.keyDownHandler.bind(this));
		document.addEventListener("keyup", this.keyUpHandler.bind(this));
		document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
	}

	boundary() { // LIMITS MOVEMENT TO CANVAS //
		if (this.x < 0) { // too far left
			this.x = 0;
		}
		else if (this.x > canvas.width - this.length) { // too far right
			this.x = canvas.width - this.length;
		}
		if (this.y < 0) { // too far up
			this.y = 0;
		}
		else if (this.y > canvas.height - this.height) { // too far down
			this.y = canvas.height - this.height;
		}
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
			this.x += 7;
		}
		else if (this.pressL == true) {
			this.x -= 7;
		}
		this.x += this.xDelta
		this.y += this.yDelta
		this.boundary()
	}

	keyDownHandler(event) { // Adds status when key is pressed
		if (event.keyCode == 37) {
			this.pressL = true;
		}
		else if (event.keyCode == 39) {
			this.pressR = true;
		}
	}

	keyUpHandler(event) { // Removes status when key is lifted
		if (event.keyCode == 37) {
			this.pressL = false;
		}
		else if (event.keyCode == 39) {
			this.pressR = false;
		}
	}

	mouseMoveHandler(event) { // Allows for mouse movements in game
		this.x = event.clientX - canvas.offsetLeft - this.length / 2;
	}
}

class Brick extends Node { // CREATES DESTRUCTABLE BRICKS //
	constructor(x, y, xDelta, yDelta, length, height, colour, health) {
		super(x, y, xDelta, yDelta, colour);
		this.length = length;
		this.height = height;
		this.health = health;
	}

	boundary() { // LIMITS MOVEMENT TO CANVAS //
		if (this.x < 0) { // too far left
			this.x = 0;
		}
		else if (this.x > canvas.width - this.length) { // too far right
			this.x = canvas.width - this.length;
		}
		if (this.y < 0) { // too far up
			this.y = 0;
		}
		else if (this.y > canvas.height - this.height) { // too far down
			this.y = canvas.height - this.height;
		}
	}

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.length, this.height);
		ctx.fill();
		ctx.closePath();
	}
}

class Game { // GAME CLASS //
	constructor() {
		this.ball = new Ball(50, 50, 1, 1, 15, 'purple')
		this.brick = new Brick(349, 12, 0, 0, 94, 53, 'red', 1)
		this.paddle = new Paddle(120, canvas.height - 20, 0, 0, 120, 15, 'blue', 'a', 'a')
	}

	loop() { // ADDS THE ILLUSION OF MOTION OVER TIME //
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.ball.move();
		this.brick.move();
		this.paddle.move();

		this.ball.draw();
		this.brick.draw();
		this.paddle.draw();

		  // requ…nFrame(this.loop repeatedly calls the loop() function.
		  //                  ↓ ↓ ↓ ↓ ↓
		requestAnimationFrame(this.loop.bind(this))
		  //                           ↑ ↑ ↑ ↑ ↑ ↑
		  // bind(this) forces "this" context to be remembered.
		  // otherwise, "this" will be undefined.
	}
}

const game = new Game()
game.loop()





/*
HUD CLASS
*/

	/*
	LIVES CLASS
	*/

	/*
	SCORES CLASS
	*/