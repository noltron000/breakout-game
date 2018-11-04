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
		if ((this.length != undefined) && (this.height != undefined)) { // This is a square.
			ctx.rect(this.x, this.y, this.length, this.height);
		}
		else if (this.radius != undefined) { // This object has a radius. It is a circle.
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		}
		else { // This object is neither square nor circle. Thus, it is henceforth a dot.
			ctx.rect(this.x, this.y, 1, 1)
		}
		ctx.fill();
		ctx.closePath();
	}

	move() { // CATCH-ALL MOVE FUNCTION //
		console.log(canvas.width)
		console.log(this.length)
		if (this.pressR == true) {
			this.x += 7;
		}
		else if (this.pressL == true) {
			this.x -= 7;
		}

		if (this.x < 0) { // too far left
			this.x = 0;
		}
		else if (this.x > canvas.width - this.length) { // too far right
			this.x = canvas.width - this.length;
		}

		this.x += this.xDelta
		this.y += this.yDelta
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

		// Setting up keypress event listener
		// // bind(this) forces "this" context to be used.
		// // otherwise, "this" will be the entire #document.
		document.addEventListener("keydown", this.keyDownHandler.bind(this));
		document.addEventListener("keyup", this.keyUpHandler.bind(this));
		document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
	}

	keyDownHandler(event) { //
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

class Game { // GAME CLASS //
	constructor() {
		this.ball = new Ball(50, 50, 0, 0, 15, 'purple')
		this.brick = new Brick(349, 12, 0, 0, 94, 53, 'red', 1)
		this.paddle = new Paddle(70, 70, 0, 0, 50, 75, 'blue', 'a', 'a')
	}

	loop() { // ADDS THE ILLUSION OF MOTION OVER TIME //
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		this.ball.move();
		this.brick.move();
		this.paddle.move();

		this.ball.draw();
		this.brick.draw();
		this.paddle.draw();

		  // requ...nFrame(this.loop repeatedly calls the loop() function.
		  //                  ↓ ↓ ↓ ↓ ↓
		requestAnimationFrame(this.loop.bind(this))
		  //                           ↑ ↑ ↑ ↑ ↑ ↑
		  // bind(this) forces "this" context to be remembered.
		  // otherwise, "this" will be undefined.
	}
}

const game = new Game()
game.loop()