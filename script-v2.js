const canvas = document.getElementById("myCanvas");
const canvas.length = canvas.width
const ctx = canvas.getContext("2d"); // CANVAS CONTEXT

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

const game = new Game();
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


// for comboFunction () {
// 	list = [A, B, C, D]
// 	// .
// 	// .   FUNCTION CONTENT GOES HERE
// 	// .

// 	// RESULTS IN
// 	otherFunction(A, B)
// 	otherFunction(A, C)
// 	otherFunction(A, D)

// 	otherFunction(B, C)
// 	otherFunction(B, D)

// 	otherFunction(C, D)
// }
