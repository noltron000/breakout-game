class Node { // PARENT NODE — SETS UP INTERACTABLE SHAPES //
	constructor(x = 0, y = 0, length = 0, height = 0, xDelta = 0, yDelta = 0, colour = 'grey') {
		this.x = x;
		this.y = y;
		this.length = length;
		this.height = height;
		this.xDelta = xDelta;
		this.yDelta = yDelta;
		this.colour = colour;
	}

	boundary() { // LIMITS MOVEMENT TO CANVAS //
		if (this.x < 0) { // too far left
			this.x = 0;
			this.xDelta = Math.abs(this.xDelta);
		} else if (this.x > canvas.width - this.length) { // too far right
			this.x = canvas.width - this.length;
			this.xDelta = -Math.abs(this.xDelta);
		} if (this.y < 0) { // too far up
			this.y = 0;
			this.yDelta = Math.abs(this.yDelta);
		} else if (this.y > canvas.height - this.height) { // too far down
			this.y = canvas.height - this.height;
			this.yDelta = -Math.abs(this.yDelta);
		}
	}

	draw() { // PIXEL NODE
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, length, height)
		ctx.fill();
		ctx.closePath();
	}

	move() { // MOVE OBJECT
		this.x += this.xDelta
		this.y += this.yDelta
		this.boundary()
	}
}

class Ball extends Node { // CREATES GAME BALL WITH PHYSICS //`
	constructor(x, y, length, height, xDelta, yDelta, colour, radius) {
		super(x, y, length, height, xDelta, yDelta, colour);
		this.shape = "circle";
		this.radius = radius;

		// By giving circles a length and height, we don't need to
		// compute the circle's full diameter multiple times over.
		this.length = this.radius * 2;
		this.height = this.radius * 2;
	}

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		// By offsetting this.x and this.y by this.radius,
		// we are able to normalize circles with squares elsewhere.
		// EXAMPLE: wall-collision functionality needs to
		// know the edges, and is based of x, y, length, and height.
		//               ↓ ↓ ↓ ↓ ↓ ↓           ↓ ↓ ↓ ↓ ↓ ↓
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}

class Paddle extends Node { // CREATES USER CONTROLLED PADDLE //
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

class Brick extends Node { // CREATES DESTRUCTABLE BRICKS //
	constructor(x, y, length, height, xDelta, yDelta, colour, health) {
		super(x, y, length, height, xDelta, yDelta, colour);
		this.shape = "square";
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
	constructor() { //           fun(x,     y, length, height, xDelta, yDelta, colour…
		this.ballArray = [new Ball(300, 200, 0, 0, 2, 3, 'red', 25)];
		this.brickArray = [new Brick(360, 200, 50, 50, 0.5, .25, 'blue', 20)];
		this.paddleArray = [new Paddle(0, 0, 50, 50, 0, 0, 'orange')];
	}

	combinations() { // RETURNS A LIST OF UNIQUE COMBINATIONS FOR EVERY INTERACTABLE GAME OBJECT
		let iUsed = [];
		let jUsed = [];
		let combo = [];
		let array = [].concat(this.ballArray, this.brickArray, this.paddleArray);
		for (let i in array) {
			for (let j in array) {

				const matches = array[i] === array[j];        // both iterators refer to the same item
				const cycled1 = iUsed.includes(array[i]);    // first iterator is in primary tabs list
				const cycled2 = iUsed.includes(array[j]);   // second iterator is in primary tabs list
				const cycled3 = jUsed.includes(array[i]);  // first iterator is in secondary tabs list
				const cycled4 = jUsed.includes(array[j]); // second iterator is in secondary tabs list

				if (!(matches || cycled1 || cycled2 || cycled3 || cycled4)) { // This match is unique!
					combo.push([array[i], array[j]]); // add to valid unique match list
					jUsed.push(array[j]); // add j to secondary used item list
				}
			}
			jUsed = []; // Empty secondary tabs list for next iteration of i
			iUsed.push(array[i]); // add i to primary used item list
		}
		iUsed = []; // Empty primary tabs list when finished - no more iterations
		return combo;
	}

	bumpCheck(combo) {
		let i;
		for (i in combo) {
			const itemA = combo[i][0];
			const itemB = combo[i][1];

			const aMinX = itemA.x;
			const bMinX = itemB.x;
			const aMaxX = itemA.x + itemA.length;
			const bMaxX = itemB.x + itemB.length;
			const aSpdX = itemA.xDelta;
			const bSpdX = itemB.xDelta;
			const xCollision = this.collides(aMinX, aMaxX, bMinX, bMaxX);
			const xReversals = this.reverses(aMinX, aMaxX, aSpdX, bMinX, bMaxX, bSpdX);

			const aMinY = itemA.y;
			const bMinY = itemB.y;
			const aMaxY = itemA.y + itemA.height;
			const bMaxY = itemB.y + itemB.height;
			const aSpdY = itemA.yDelta;
			const bSpdY = itemB.yDelta;
			const yCollision = this.collides(aMinY, aMaxY, bMinY, bMaxY);
			const yReversals = this.reverses(aMinY, aMaxY, aSpdY, bMinY, bMaxY, bSpdY);


			if (yCollision && xCollision) {
				if (xReversals[0]) {
					itemA.xDelta = -itemA.xDelta;
				}
				if (yReversals[0]) {
					itemA.yDelta = -itemA.yDelta;
				}
				if (xReversals[1]) {
					itemB.xDelta = -itemB.xDelta;
				}
				if (yReversals[1]) {
					itemB.yDelta = -itemB.yDelta;
				}
			}
		}
	}

	collides(aMin, aMax, bMin, bMax) {
		/*
			If the height of rectangle A goes from 2 to 3, and the height of rectangle B goes from 4 to 3, would they collide?
			It depends on their X position. The following variables help determine if they do or not. If any of them are true, then they collide.

				// aWithin1:
				// 	[bbbbbbbbbbbbbbbbbbbb]
				// 	            [aaa…

				// bWithin1:
				// 	[aaaaaaaaaaaaaaaaaaaa]
				// 	            [bbb…

				// aWithin2:
				// 	[bbbbbbbbbbbbbbbbbbbb]
				// 	            …aaa]

				// bWithin2:
				// 	[aaaaaaaaaaaaaaaaaaaa]
				// 	            …bbb]

				// together:
				// 	[aaaaaaaaaaaaaaaaaaaa]
				// 	[bbbbbbbbbbbbbbbbbbbb]

			Note that this function can be used to check either horizontal and vertical collisions.
		*/


		const aWithin1 = bMin < aMin && aMin < bMax;
		const aWithin2 = bMin < aMax && aMax < bMax;
		const bWithin1 = aMin < bMin && bMin < aMax;
		const bWithin2 = aMin < bMax && bMax < aMax;
		const together = aMin === bMin && aMax === bMax;
		const collides = aWithin1 || aWithin2 || bWithin1 || bWithin2 || together;
		return collides;
	}

	reverses(aMin, aMax, aDelta, bMin, bMax, bDelta) {
		/*
			If a rectangle is moving downwards, and another is moving upwards, how do we know if they pass eachother?
			It depends on their Y positions and speeds. The following variables help determine if they do or not. If any of them are true, then they pass eachother.

				// aPassing: 		// bPassing:
				// 	 [aaa]   		// 	 [bbb]
				// 	  ↓↓↓    		// 	  ↓↓↓
				// 	  ↑↑↑    		// 	  ↑↑↑
				// 	 [bbb]   		// 	 [aaa]
				// RESULT: both reverse

				// aFaster1: 		// bFaster1:
				// 	  ↑↑↑    		// 	  ↑↑↑
				// 	 [bbb]   		// 	 [aaa]
				// 	  ↑↑↑    		// 	  ↑↑↑
				// 	  ↑↑↑    		// 	  ↑↑↑
				// 	 [aaa]   		// 	 [bbb]
				// RESULT: one reverses

				// aFaster2: 		// bFaster2:
				// 	 [aaa]   		// 	 [bbb]
				// 	  ↓↓↓    		// 	  ↓↓↓
				// 	  ↓↓↓    		// 	  ↓↓↓
				// 	 [aaa]   		// 	 [aaa]
				// 	  ↓↓↓    		// 	  ↓↓↓
				// RESULT: one reverses

			Note that this function can be used to check either horizontal and vertical passings.
		*/
		const aMore = aMax > bMin // a > b: 	a =is= more than b
		const bMore = bMax > aMin // b > a: 	b =is= more than a
		const aWill = aMax + aDelta >= bMin + bDelta // a + ∆a ≥ b + ∆b: 	a =will be= more than b
		const bWill = bMax + bDelta >= aMin + aDelta // b + ∆b ≥ a + ∆a: 	b =will be= more than a
		const aBump = aDelta > 0 && bDelta < 0; // a moves down, b moves up - they collide.
		const bBump = bDelta > 0 && aDelta < 0; // b moves down, a moves up - they collide.
		const south = aDelta >= 0 && bDelta >= 0; // a and b move down, but one is faster!
		const north = aDelta <= 0 && bDelta <= 0; // a and b move up, but one is faster!

		const aPassing = bMore && aWill && aBump // They bump! Both reverse.
		const aFaster1 = bMore && aWill && north // A bumps B! A reverses.
		const aFaster2 = bMore && aWill && south // A bumps B! A reverses.

		const bPassing = aMore && bWill && bBump // They bump! Both reverse.
		const bFaster1 = aMore && bWill && north // B bumps A! B reverses.
		const bFaster2 = aMore && bWill && south // B bumps A! B reverses.

		if (aPassing || bPassing) { // They both reverse!
			return [true, true];

		} else if (aFaster1 || aFaster2) { // A reverses!

			console.log("ONE REVERSE!")
			return [true, false];

		} else if (bFaster1 || bFaster2) { // B reverses!
			console.log("ONE REVERSE!")
			return [false, true];

		} else { // Neither reverse!
			return [false, false];
		}
	}

	draw() { // DRAWS EACH OBJECT IN THEIR NEW POSITION //
		let index;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (index in this.ballArray) {
			this.ballArray[index].draw();
		} for (index in this.brickArray) {
			this.brickArray[index].draw();
		} for (index in this.paddleArray) {
			this.paddleArray[index].draw();
		}
	}

	move() { // CALCULATES MOVES FOR EACH OBJECT USING DELTAS //
		let index;
		for (index in this.ballArray) {
			this.ballArray[index].move();
		} for (index in this.brickArray) {
			this.brickArray[index].move();
		} for (index in this.paddleArray) {
			this.paddleArray[index].move();
		}
	}

	loop() { // ADDS THE ILLUSION OF MOTION OVER TIME //
		this.move();
		this.draw();
		let combo = this.combinations();
		this.bumpCheck(combo);

		// req…ionFrame(this.loop… repeatedly calls the loop() function.
		//                    ↓ ↓ ↓ ↓ ↓
		requestAnimationFrame(this.loop.bind(this))
		//                           ↑ ↑ ↑ ↑ ↑ ↑
		// ….bind(this) forces "this" context to be remembered.
		// otherwise, "this" will be undefined.
	}
}

// JavaScript code goes here
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d"); // CANVAS CONTEXT

// Canvas Variables™€
let MarginTop = 80;
let MarginSide = 80;

// Ball Variables
let ballRadius = 128;
let x = (canvas.width - MarginSide * 2 - ballRadius * 2) * Math.random() + MarginSide + ballRadius;
let y = (canvas.height / 3) * Math.random() + canvas.height / 2;
let dx = 2;
let dy = -2;
const max_dx = 24;
const max_dy = 24;

// Paddle Variables
const paddleHeight = 15;
let paddleWidth = 288;
const min_pWidth = paddleWidth / 24
const paddleRaise = paddleHeight / 2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Brick Variables
const brickRowCount = 16;
const brickColCount = 12;
const brickPadding = 3;
const brickHeight = (canvas.height / 3 - MarginTop) / (brickRowCount);
const brickWidth = (canvas.width - MarginSide * 2 - (brickPadding * (brickRowCount - 1) / brickColCount)) / brickColCount;

let bricks = [];
for (let c = 0; c < brickColCount; c++) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: true };
	}
}

// Defining UI Variables
let score = 0;
let lives = 9;
let game_on = true;

// Defining COLOR Variables
let ballColor = 200;
let brickColor = "";
let paddleColor = "";

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


const getRandomColor = () => {
	ctx.fillStyle = 'gray'
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

const rainbowMode = (color) => {
	if (color > 360) {
		color = color - 360
	}
	return `hsl(${color}, 100%, 50%)`
}

const collisionDetection = () => {
	for (let c = 0; c < brickColCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status == true) {
				if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
					// If ball is within range of Brick
					if (x > b.x && x < b.x + brickWidth) {
						// If ball is specifically within horizontal range of block
						dy = -dy;
					} else if (y > b.y && y < b.y + brickWidth) {
						// If ball is specifically within verticle range of block
						dx = -dx;
					}
					// Regardless, Continue on with function
					b.status = false;
					score++;
					dy = dy + ((max_dy - Math.abs(dy)) * Math.abs(dy) / (dy * max_dy ** 2))
					dx = dx + ((max_dx - Math.abs(dx)) * Math.abs(dx) / (dx * max_dx ** 2))
					ballRadius += 20 / ballRadius;
					console.log(dy)
					console.log(Math.abs(dy) - Math.abs(dx))
					paddleWidth = paddleWidth - ((min_pWidth - paddleWidth) / (min_pWidth ** 2))
					paddleX += paddleWidth * 1 / 128
					paddleWidth = paddleWidth * (95 / 96);
					if (score == brickRowCount * brickColCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
}

const drawBall = () => {
	// left edge of paddle, 0, left of paddle + width of paddle, 0
	let clr = ctx.createLinearGradient(x, y, x + ballRadius, y + ballRadius);
	clr.addColorStop(0, rainbowMode(ballColor)); // Places a color at the start
	clr.addColorStop(1, rainbowMode(ballColor + 30)); // Places a color at the end
	ballColor += 2

	// Fill with gradient
	ctx.fillStyle = clr;

	// Create gradient
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

const drawPaddle = () => {
	// Fill with gradient
	ctx.fillStyle = 'grey';
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight - paddleRaise, paddleWidth, paddleHeight);
	ctx.fill();
	ctx.closePath();
}

const drawBricks = () => {
	ctx.fillStyle = 'gray'
	for (let c = 0; c < brickColCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == true) {
				let brickX = (c * (brickWidth + brickPadding * 2));
				let brickY = (r * (brickHeight + brickPadding * 2));
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				if ((r % 2) == 0) {
					brickX = (c * (brickWidth + brickPadding)) + MarginSide + brickWidth / 4;
					brickY = (r * (brickHeight + brickPadding)) + MarginTop;
				} else {
					brickX = (c * (brickWidth + brickPadding)) + MarginSide - brickWidth / 4;
					brickY = (r * (brickHeight + brickPadding)) + MarginTop;
				}
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

const drawScore = () => {
	ctx.fillStyle = 'gray'
	ctx.font = "16px Arial";
	ctx.fillText("Score: " + score, 8, 20);
}

const drawLives = () => {
	ctx.fillStyle = 'gray'
	ctx.font = "16px Arial";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	drawScore();
	drawLives();
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		// If ball would touch the ceiling
		dy = -dy;
	} else if ((y + dy > canvas.height - ballRadius - paddleHeight - paddleRaise) && (y + dy < canvas.height - ballRadius - paddleRaise)) {
		// If ball would touch the paddle on floor
		if (x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
			// If ball is in horizontal range of the paddle
			dy = -Math.abs(dy);
		}
	} else if (y + dy > canvas.height - ballRadius) {
		// If ball would touch the floor
		lives--;
		if (!lives) {
			if (game_on) {
				game_on = false
				alert("GAME OVER"); // YOU LOSE
				document.location.reload();
			}
		}
		else {
			x = (canvas.width - MarginSide * 2 - ballRadius * 2) * Math.random() + MarginSide + ballRadius;
			y = (canvas.height / 3) * Math.random() + canvas.height / 2;
			dy = -Math.abs(dy);
		}
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}
	x += dx;
	y += dy;
	ballRadius /= 1 + 1 / 128;
	requestAnimationFrame(draw);
}

// SCRIPT OG: INLINE MODE
draw();

// SCRIPT v2: USE CLASSES (broken)
const game = new Game();
game.loop();
