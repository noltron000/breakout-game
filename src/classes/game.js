import Ball from './ball'
import Paddle from './paddle'
import Brick from './brick'

class Game {
	constructor () {
		// Creates one ball
		this.ball = new Ball()

		// Creates one paddle
		this.paddle = new Paddle()

		// Creates a 5-by-5 array of bricks
		this.bricks = [...new Array(5)].map(
			() => [...new Array(5)].map(
				() => new Brick()
			)
		)

		alert("You have started the game.")
	}
}

export default Game

/***
class OLD__Game { // GAME CLASS //
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
		// If the height of rectangle A goes from 2 to 3, and the height of rectangle B goes from 4 to 3, would they collide?
		// It depends on their X position. The following variables help determine if they do or not. If any of them are true, then they collide.

		// 	// aWithin1:
		// 	// 	[bbbbbbbbbbbbbbbbbbbb]
		// 	// 	            [aaa…

		// 	// bWithin1:
		// 	// 	[aaaaaaaaaaaaaaaaaaaa]
		// 	// 	            [bbb…

		// 	// aWithin2:
		// 	// 	[bbbbbbbbbbbbbbbbbbbb]
		// 	// 	            …aaa]

		// 	// bWithin2:
		// 	// 	[aaaaaaaaaaaaaaaaaaaa]
		// 	// 	            …bbb]

		// 	// together:
		// 	// 	[aaaaaaaaaaaaaaaaaaaa]
		// 	// 	[bbbbbbbbbbbbbbbbbbbb]

		// Note that this function can be used to check either horizontal and vertical collisions.

		const aWithin1 = bMin < aMin && aMin < bMax;
		const aWithin2 = bMin < aMax && aMax < bMax;
		const bWithin1 = aMin < bMin && bMin < aMax;
		const bWithin2 = aMin < bMax && bMax < aMax;
		const together = aMin === bMin && aMax === bMax;
		const collides = aWithin1 || aWithin2 || bWithin1 || bWithin2 || together;
		return collides;
	}

	reverses(aMin, aMax, aDelta, bMin, bMax, bDelta) {
		// If a rectangle is moving downwards, and another is moving upwards, how do we know if they pass eachother?
		// It depends on their Y positions and speeds. The following variables help determine if they do or not. If any of them are true, then they pass eachother.

		// 	// aPassing: 		// bPassing:
		// 	// 	 [aaa]   		// 	 [bbb]
		// 	// 	  ↓↓↓    		// 	  ↓↓↓
		// 	// 	  ↑↑↑    		// 	  ↑↑↑
		// 	// 	 [bbb]   		// 	 [aaa]
		// 	// RESULT: both reverse

		// 	// aFaster1: 		// bFaster1:
		// 	// 	  ↑↑↑    		// 	  ↑↑↑
		// 	// 	 [bbb]   		// 	 [aaa]
		// 	// 	  ↑↑↑    		// 	  ↑↑↑
		// 	// 	  ↑↑↑    		// 	  ↑↑↑
		// 	// 	 [aaa]   		// 	 [bbb]
		// 	// RESULT: one reverses

		// 	// aFaster2: 		// bFaster2:
		// 	// 	 [aaa]   		// 	 [bbb]
		// 	// 	  ↓↓↓    		// 	  ↓↓↓
		// 	// 	  ↓↓↓    		// 	  ↓↓↓
		// 	// 	 [aaa]   		// 	 [aaa]
		// 	// 	  ↓↓↓    		// 	  ↓↓↓
		// 	// RESULT: one reverses

		// Note that this function can be used to check either horizontal and vertical passings.

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
***/
