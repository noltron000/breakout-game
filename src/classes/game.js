import Ball from './ball.js'
import Brick from './brick.js'
import Paddle from './paddle.js'

class Game {
	constructor (canvasElement) {
		// Track both the canvas element and context.
		this.canvas = {
			element: canvasElement,
			context: canvasElement.getContext('2d'),
		}

		// Track game variables in the state.
		this.state = {
			lives: 3,
			score: 0,
			pause: false,
		}

		// Prepare mobile objects
		this.balls = [this.createBall()]
		this.bricks = this.createBrickArray()
		this.paddles = [this.createPaddle()]

		console.dir(this)
	}

	get mobileObjects () {
		return [
			...this.balls,
			...this.paddles,
			...this.bricks,
		]
	}

	// Creates one ball.
	createBall () {
		return new Ball(this, {
			coordinates: [[40, 350], [0, -1]],
			dimensions: [10, 10],
		})
	}

	/*
	// Creates one brick.
	createBrick () {}
	*/

	// Creates one paddle.
	createPaddle () {
		return new Paddle(this, {
			coordinates: [[20, this.canvas.element.height - 40]],
			dimensions: [100, 20],
		})
	}

	// Create an array of bricks using these parameters.
	createBrickArray ({
		gridLength,
		gridHeight,
		gridMargin,
		brickLength,
		brickHeight,
	} = {
		gridLength: 6,
		gridHeight: 5,
		gridMargin: 20,
		brickLength: 65,
		brickHeight: 30,
	}) {
		// Compute the brickPadding.
		const brickPadding = (
			this.canvas.element.width
			- (gridMargin * 2)
			- (gridLength * brickLength)
		) / (gridLength - 1)

		// Map bricks over a grid of the grid length * grid height.
		const bricks = [...new Array(gridLength)].map(
			(_, lengthIndex) => [...new Array(gridHeight)].map(
				(_, heightIndex) => {
					// Calculate the x/y coordinates using the map indexes.
					const xPos = gridMargin + lengthIndex * (brickLength + brickPadding)
					const yPos = gridMargin + heightIndex * (brickHeight + brickPadding)

					// Create the new brick based on calculated values.
					return new Brick(this, {
						coordinates: [[xPos, yPos]],
						dimensions: [brickLength, brickHeight],
					})
				}
			)
		)

		// Finally, flatten the bricks 2D-matrix into a single array.
		return bricks.flat()
	}

	resolveCollisions () {
		/* STEP 1: combinations */
		const assets = this.assets
		const combinations = []

		// Get every unique combination of the assets.
		for (let iIndex = 0; iIndex < assets.length; iIndex++) {
			const iAsset = assets[iIndex]
			for (let jIndex = iIndex + 1; jIndex < assets.length; jIndex++) {
				const jAsset = assets[jIndex]
				combinations.push([iAsset, jAsset])
			}
		}

		/* STEP 2: collisions */
		const collisions = []

		// Determine collisions within all the combinations.
		for (const [asset1, asset2] of combinations) {
			if (asset1.sharesSpaceWith(asset2, 'nextFrame')) {
				collisions.push([asset1, asset2])
			}
		}

		/* STEP 3: resolve bounces */
		const bouncePairs = collisions.map(([asset1, asset2]) => {
			const bouncePair = new Map()
			;[asset1, asset2].forEach((asset) => {
				// map each asset in the pair to whether it bounces in the x/y plane.
				bouncePair.set(asset, [false, false])
			})
			return bouncePair
		})

		bouncePairs.forEach((bouncePair) => {
			const [asset1, asset2] = bouncePair.keys()
			const bounceAxis = [
				!asset1.sharesDomainWith(asset2),
				!asset1.sharesRangeWith(asset2),
			]
			;[asset1, asset2].forEach((asset) => {
				bouncePair.set(asset, bounceAxis)
			})
		})

		const bounces = bouncePairs.reduce((bounces, bouncePair) => {
			for (const asset of bouncePair.keys()) {
				const bounceAxis1 = bouncePair.get(asset)
				if (bounces.has(asset)) {
					const bounceAxis2 = bounces.get(asset)
					const newBounceAxis = [
						bounceAxis1[0] || bounceAxis2[0],
						bounceAxis1[1] || bounceAxis2[1],
					]
					bounces.set(asset, newBounceAxis)
				}
				else {
					bounces.set(asset, bounceAxis1)
				}
			}
			return bounces
		}, new Map())

		for (const [asset, bounce] of bounces.entries()) {
			const newCoords = [
				asset.coordinates[0],
				...asset.coordinates.slice(1).map((pair) => pair.map((magnitude, axis) => {
					if (bounce[axis]) {
						return magnitude
					}
					else {
						return -magnitude
					}
				}))
			]
			console.log('newCoords', newCoords)
			asset.coordinates = newCoords
		}
	}

	draw () {
		// Clear the canvas before redrawing the frame,
		// 	or else you get ghosted duplicates and afterimages.
		const width = this.canvas.element.width
		const height = this.canvas.element.height
		this.canvas.context.clearRect(0, 0, width, height)

		// TODO: Fix clarity of collisions
		// // Before redrawing, resolve any collisions.
		// this.resolveCollisions()

		// Use triggers & effects for wall-bouncing fields, etc.
		// Apply effect fields last because their rules are most important.
		this.mobileObjects.forEach((mob) => mob.checkFieldTriggers())
		this.mobileObjects.forEach((mob) => mob.resolvePendingEffects())

		// Redraw all the game's assets.
		this.mobileObjects.forEach((asset) => asset.draw())

		// Via bind, do not forget "this" in the animationFrame callback.
		const drawWithThis = this.draw.bind(this)
		// Draw the canvas on each and every frame w/changes.
		requestAnimationFrame(drawWithThis)
	}
}

export default Game

/***
-< CLASS STYLE >-
class OLD__Game { // GAME CLASS //
	...

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
	}
}
***/
