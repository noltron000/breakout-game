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
		// Because Circles and Squares behave differently, it is important to know whether or not "this" is one or the other.
		const thisIsCircle = ((this.radius != undefined) && ((this.length == undefined) && (this.length == undefined)))
		const thisIsSquare = ((this.radius == undefined) && ((this.length != undefined) && (this.length != undefined)))
		  // "Meter" is a generic placeholder for length, height, or radius.
		 // Because Circles are drawn from the center,
		// and Squares from the edge, the "Extra" variables are necessary.
		let xMeter = 0;
		let yMeter = 0;
		let xExtra = 0;
		let yExtra = 0;

		if (thisIsCircle) {
			xMeter = this.radius;
			yMeter = this.radius;
			xExtra = xMeter;
			yExtra = yMeter;
		}
		else if (thisIsSquare) {
			xMeter = this.length;
			yMeter = this.height;
			xExtra = 0;
			yExtra = 0;
		}

		// Finally, we get to deciding when an item bounces of a wall.
		if (this.x < xExtra) { // too far left
			this.x = xExtra;
			this.xDelta = Math.abs(this.xDelta);
		}
		else if (this.x > canvas.width - xMeter) { // too far right
			this.x = canvas.width - xMeter;
			this.xDelta = -Math.abs(this.xDelta)
		}
		if (this.y < yExtra) { // too far up
			this.y = yExtra;
			this.yDelta = Math.abs(this.yDelta)
		}
		else if (this.y > canvas.height - yMeter) { // too far down
			this.y = canvas.height - yMeter;
			this.yDelta = -Math.abs(this.yDelta)
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
		document.addEventListener("keydown",     this.keyDownHandler.bind(this));
		document.addEventListener("keyup",         this.keyUpHandler.bind(this));
		document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
		  //                                                       ↑ ↑ ↑ ↑ ↑ ↑
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
		this.ballArray   = [   new Ball(50, 50, 2.5, 2.5, 15, 'purple'), new Ball(50, 50, -3, 3, 15, 'purple') ]
		this.brickArray  = [  new Brick(349, 12, -3, -3, 94, 53, 'red', 1) ]
		this.paddleArray = [ new Paddle(120, canvas.height - 20, 0, 0, 120, 15, 'blue', 'a', 'a') ]
	}

	newBall() { // CREATES A NEW BALL //
		this.ball
	}

	loop() { // ADDS THE ILLUSION OF MOTION OVER TIME //
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		let index;

		for (index in this.ballArray) {
			this.ballArray[index].move();
			this.ballArray[index].draw();
		}

		for (index in this.brickArray) {
			this.brickArray[index].move();
			this.brickArray[index].draw();
		}

		for (index in this.paddleArray) {
			this.paddleArray[index].move();
			this.paddleArray[index].draw();
		}

		 // requ…nFrame(this.loop repeatedly calls the loop() function.
		//                    ↓ ↓ ↓ ↓ ↓
		requestAnimationFrame(this.loop.bind(this))
		  //                           ↑ ↑ ↑ ↑ ↑ ↑
		 // .bind(this) forces "this" context to be remembered.
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