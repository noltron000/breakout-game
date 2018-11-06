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
		//                x y                   ∆x   ∆y   L   H    Colour
		this.ballArray = [];
		this.brickArray = [new Brick(349, 12, -3, -3, 94, 53, 'red', 1)];
		this.paddleArray = [new Paddle(120, canvas.height - 20, 0, 0, 120, 15, 'blue', false, false)];

		this.ballArray.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3, 15, 'purple'));
		this.ballArray.push(new Ball(Math.random() * canvas.width, Math.random() * canvas.height, 3, 3, 15, 'purple'));
		this.combinate()
	}

	combinate() { // UGLY FUNCTION NEEDS TO BE REFACTORED!!
		// COLLISION CALCULATION TAKES INTO CONSIDERATION EACH OBJECT AND THE WALL.
		let i;
		let j;
		let iUsed = [];
		let jUsed = [];
		let combo = [];
		let list = [];
		list = list.concat(this.ballArray, this.brickArray, this.paddleArray);

		for (i in list) {
			for (j in list) {
				if (! ((list[i] == list[j]) || (iUsed.includes(list[i]) || iUsed.includes(list[j])) || (jUsed.includes(list[i]) || jUsed.includes(list[j])))) {
					combo.push([list[i], list[j]])
					jUsed.push(list[j]);
				}
			}
			iUsed.push(list[i]);
			jUsed = [];
		}
		iUsed = [];
		for (i in combo) {
			this.bump(combo[i][0],combo[i][1])
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

		const aWithin1 = bMin < aMin < bMax;
		const aWithin2 = bMin < aMax < bMax;
		const bWithin1 = aMin < bMin < aMax;
		const bWithin2 = aMin < bMax < aMax;
		const together = aMin === bMin && aMax === bMax;
		const collides = aWithin1 || aWithin2 || bWithin1 || bWithin2 || together;
	}


	passings(aMin, aMax, aDelta, bMin, bMax, bDelta) {
		/*
			If a rectangle is moving downwards, and another is moving upwards, how do we know if they pass eachother?
			It depends on their Y positions and speeds. The following variables help determine if they do or not. If any of them are true, then they pass eachother.

				// passing1: 		// passing2:
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
				// 	  ↓↓↓    		// 	  ↓↓↓
				// 	 [aaa]   		// 	 [bbb]
				// 	  ↓↓↓    		// 	  ↓↓↓
				// 	  ↓↓↓    		// 	  ↓↓↓
				// 	 [bbb]   		// 	 [aaa]
				// RESULT: one reverses

			Note that this function can be used to check either horizontal and vertical passings.
		*/

		const passing1 = aMax;

	}

	draw() { // DRAWS EACH OBJECT IN THEIR NEW POSITION //
		let index;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (index in this.ballArray) {
			this.ballArray[index].draw();
		}

		for (index in this.brickArray) {
			this.brickArray[index].draw();
		}

		for (index in this.paddleArray) {
			this.paddleArray[index].draw();
		}
	}

	move() { // CALCULATES MOVES FOR EACH OBJECT USING DELTAS //
		let index;

		for (index in this.ballArray) {
			this.ballArray[index].move();
		}

		for (index in this.brickArray) {
			this.brickArray[index].move();
		}

		for (index in this.paddleArray) {
			this.paddleArray[index].move();
		}
	}

	loop() { // ADDS THE ILLUSION OF MOTION OVER TIME //
		this.move()
		this.draw()
		this.combinate()

		 // req…ionFrame(this.loop… repeatedly calls the loop() function.
		//                    ↓ ↓ ↓ ↓ ↓
		requestAnimationFrame(this.loop.bind(this))
		  //                           ↑ ↑ ↑ ↑ ↑ ↑
		 // ….bind(this) forces "this" context to be remembered.
		// otherwise, "this" will be undefined.
	}
}

const game = new Game();
// game.combinate();
game.loop();




/*
HUD CLASS
*/

	/*
	LIVES CLASS
	*/

	/*
	SCORES CLASS
	*/


for comboFunction () {
	list = [A, B, C, D]
	// .
	// .   FUNCTION CONTENT GOES HERE
	// .

	// RESULTS IN
	otherFunction(A, B)
	otherFunction(A, C)
	otherFunction(A, D)

	otherFunction(B, C)
	otherFunction(B, D)

	otherFunction(C, D)
}