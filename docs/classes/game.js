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
			status: 'playing'
		}

		this.resetBoard()
	}

	get board () {
		return {
			width: this.canvas.element.width,
			height: this.canvas.element.height,
		}
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
			positions: [{
				x: 40,
				y: 350,
			}, {
				x: -1,
				y: -1,
			}],
			dimensions: [{
				x: 10,
				y: 10,
			}],
		})
	}

	/*
	// Creates one brick.
	createBrick () {}
	*/

	// Creates one paddle.
	createPaddle () {
		return new Paddle(this, {
			positions: [{
				x: 20,
				y: this.board.height - 40,
			}],
			dimensions: [{
				x: 100,
				y: 20,
			}],
		})
	}

	// Create an array of bricks using these parameters.
	createBrickArray ({
		gridWidth,
		gridHeight,
		gridMargin,
		brickWidth,
		brickHeight,
	} = {
		gridWidth: 6,
		gridHeight: 5,
		gridMargin: 20,
		brickWidth: 65,
		brickHeight: 30,
	}) {
		// Compute the brickPadding.
		const brickPadding = (
			this.board.width
			- (gridMargin * 2)
			- (gridWidth * brickWidth)
		) / (gridWidth - 1)

		// Map bricks over a grid of the grid width * grid height.
		const bricks = [...new Array(gridWidth)].map(
			(_, widthIndex) => [...new Array(gridHeight)].map(
				(_, heightIndex) => {
					// Calculate the x/y coordinates using the map indexes.
					const xPos = gridMargin + widthIndex * (brickWidth + brickPadding)
					const yPos = gridMargin + heightIndex * (brickHeight + brickPadding)

					// Create the new brick based on calculated values.
					return new Brick(this, {
						positions: [{
							x: xPos,
							y: yPos,
						}],
						dimensions: [{
							x: brickWidth,
							y: brickHeight
						}],
					})
				}
			)
		)

		// Finally, flatten the bricks 2D-matrix into a single array.
		return bricks.flat()
	}

	clearBoard () {
		this.balls = []
		this.bricks = []
		this.paddles = []
		this.state.status = 'menu'
	}

	resetBoard () {
		this.clearBoard()
		this.state.status = 'playing'

		// Prepare mobile objects
		this.balls = [this.createBall()]
		this.bricks = this.createBrickArray()
		this.paddles = [this.createPaddle()]
	}

	destroyAsset (asset) {
		this.balls = this.balls.filter(ball => ball !== asset)
		this.bricks = this.bricks.filter(brick => brick !== asset)
		this.paddles = this.paddles.filter(ball => ball !== asset)
	}

	get combinations () {
		const assets = this.mobileObjects
		const combinations = []

		// Get every unique combination of the assets.
		for (let iIndex = 0; iIndex < assets.length; iIndex++) {
			const iAsset = assets[iIndex]
			for (let jIndex = iIndex + 1; jIndex < assets.length; jIndex++) {
				const jAsset = assets[jIndex]
				combinations.push([iAsset, jAsset])
			}
		}

		return combinations
	}

	get collisions () {
		const assets = this.mobileObjects
		const combinations = this.combinations
		const collisions = []

		// Determine collisions within all the combinations.
		for (const [asset1, asset2] of combinations) {
			if (asset1.sharesSpaceWith(asset2, 'nextFrame')) {
				collisions.push([asset1, asset2])
			}
		}

		return collisions
	}

	resolveCollisions () {
		this.collisions.forEach((pair) => {
			pair[0].checkCollisionTriggers(pair[1])
			pair[1].checkCollisionTriggers(pair[0])
		})
		this.mobileObjects.forEach((mob) => mob.resolvePendingEffects())
	}

	resolveFieldEffects () {
		this.mobileObjects.forEach((mob) => mob.checkFieldTriggers())
		this.mobileObjects.forEach((mob) => mob.resolvePendingEffects())
	}

	resolveGameEffects () {
		if (this.bricks.length <= 0 && this.state !== 'win') {
			this.state.status = 'win'
			alert ("YOU WIN!")
			this.resetBoard()
		}

		if (this.balls.length <= 0 && this.state !== 'lose') {
			this.state.status = 'lose'
			alert ("YOU LOSE!")
			this.resetBoard()
		}
	}

	draw () {
		// Clear the canvas before redrawing the frame,
		// 	or else you get ghosted duplicates and afterimages.
		const width = this.board.width
		const height = this.board.height
		this.canvas.context.clearRect(0, 0, width, height)

		// Use collisions trigges & effects for ball-bouncing, etc.
		this.resolveCollisions()
		// Apply field triggers & effects next because their rules override collisions.
		this.resolveFieldEffects()
		// Finally, the game status rules over all.
		this.resolveGameEffects()

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
	loop() { // ADDS THE ILLUSION OF MOTION OVER TIME //
		this.move();
		this.draw();
		let combo = this.combinations();
		this.bumpCheck(combo);
	}
}
***/
