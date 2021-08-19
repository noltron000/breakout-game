import Transform from "./transform.js"

class MobileObject {
	#transform
	#nextTransform
	constructor (game, transform, {color}) {
		// Define the parent game.
		this.game = game
		this.color = color

		// Use the field and collision triggers to create pending effects.
		// These three array variables will start empty.
		//
		// The fieldTriggers watch for true/false statements every frame.
		// If one is true, it will push a function onto pendingEffects.
		// After fieldTriggers is checked, the pendingEffects are used and emptied.
		this.fieldTriggers = []
		this.collisionTriggers = []
		this.pendingEffects = []

		// FIXME: Gosh this is really gross. Please no.
		// Define wall-bouncing for rectangle mobs.
		this.fieldTriggers.push(
			() => {if (this.collidesWithTopWall('nextFrame')) this.pendingEffects.push(this.moveDownEffect.bind(this))},
			() => {if (this.collidesWithBottomWall('nextFrame')) this.pendingEffects.push(this.moveUpEffect.bind(this))},
			() => {if (this.collidesWithLeftWall('nextFrame')) this.pendingEffects.push(this.moveRightEffect.bind(this))},
			() => {if (this.collidesWithRightWall('nextFrame')) this.pendingEffects.push(this.moveLeftEffect.bind(this))},
		)

		// ~ NOTES ~
		//
		// Transform stores very important geometric data.
		// - rotations (not implemented/used)
		// - positions
		// - dimensions
		//
		// For example, these properties can be accessed.
		// - this.transform.positions[0].x is x position.
		// - this.transform.positions[1].y is y velocity.
		// - this.transform.positions[2] is x/y acceleration.
		//
		// Transform data is stored in arrays of cartesian coordinates [{x,y}, ...]
		//
		// This is an n-by-two matrix (n>0).
		// For each matrix in each frame, the matrix to the right gets added on.
		// The first item is always the object's position.
		this.transform = transform
	}

	get transform () {
		return this.#transform
	}

	set transform (transform) {
		this.#transform = new Transform(transform, () => {this.#nextTransform = null})
		this.#nextTransform = null
	}

	get nextTransform () {
		// If the next frame's transform isn't yet calculated, calculate it.
		if (this.#nextTransform === null) {
			const nextTransform = {}

			// Rotation hasn't been implemented yet to use.
			// // nextTransform.rotation = []

			// Dimensions should never change yet.
			nextTransform.dimensions = this.transform.dimensions

			// Positions are where things get interesting.
			// Loop over every coordinate pair (position, velocity, acceleration, etc).
			nextTransform.positions = this.transform.positions.map((coordinates, index) => {
				// Determine if there is another pair of coordinates after this one.
				if (index + 1 >= this.transform.positions.length) {
					return coordinates // The final array always remains unchanged.
				}

				// Add the next object's elements to this object's elements, respectively.
				const x = this.transform.positions[index].x + this.transform.positions[index + 1].x
				const y = this.transform.positions[index].y + this.transform.positions[index + 1].y
				return {x, y}
			})

			// Set the new next transform object, allowing a suite of getters.
			this.#nextTransform = new Transform(nextTransform)
		}

		// Return the next frame's transform.
		return this.#nextTransform
	}

	transformFrame (phase='thisFrame') {
		if (phase === 'thisFrame') return this.transform
		else if (phase === 'nextFrame') return this.nextTransform
	}

	/* Field Triggers */

	collidesWithTopWall (phase='thisFrame') {
		const boardHeight = this.game.board.height

		// Default transform is for this frame.
		const transform = this.transformFrame(phase)

		// If the object is taller than the board, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (transform.bottomPos > boardHeight) return false

		// Activate if the MOB would sink into the upper wall.
		else if (transform.topPos < 0) return true
		else return false
	}

	collidesWithBottomWall (phase='thisFrame') {
		const boardHeight = this.game.board.height

		// Default transform is for this frame.
		const transform = this.transformFrame(phase)

		// If the object is taller than the board, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (transform.topPos < 0) return false

		// Activate if the MOB would sink into the lower wall.
		else if (transform.bottomPos > boardHeight) return true
		else return false
	}

	collidesWithLeftWall (phase='thisFrame') {
		const boardWidth = this.game.board.width

		// Default transform is for this frame.
		const transform = this.transformFrame(phase)

		// If the object is wider than the board, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (transform.rightPos > boardWidth) return false

		// Activate if the MOB would sink into the left wall.
		else if (transform.leftPos < 0) return true
		else return false
	}

	collidesWithRightWall (phase='thisFrame') {
		const boardWidth = this.game.board.width

		// Default transform is for this frame.
		const transform = this.transformFrame(phase)

		// If the object is wider than the board, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (transform.leftPos < 0) return false

		// Activate if the MOB would sink into the right wall.
		else if (transform.rightPos > boardWidth) return true
		else return false
	}

	/* Collision Triggers */

	// TODO
	// topCollisionWith
	// bottomCollisionWith
	// leftCollisionWith
	// rightCollisionWith

	/* Helper Triggers */

	// This diagram might help for sharing a space...
	// O<=>O   X<->X ❌️
	// X<->X   O<=>O ❌️
	// O<=<X>=>O-->X ✔️
	// X<-<O<=<X>=>O ✔️
	// O<=<X<->X>=>O ✔️
	// X<-<O<=>O>->X ✔️
	//
	// This one works for engulfing a range...
	// O<=>O   X<->X ❌️
	// X<->X   O<=>O ❌️
	// O<=<X>=>O-->X ❌️
	// X<-<O<=<X>=>O ❌️
	// O<=<X<->X>=>O ❌️
	// X<-<O<=>O>->X ✔️
	// ...Where X and O are this and that.
	// Arrows connect between left and right Xs and Os.

	sharesDomainWith (that, phase='thisFrame') {
		// Default transform is for this frame.
		const thisT = this.transformFrame(phase)
		const thatT = that.transformFrame(phase)
		return (
			thisT.leftPos < thatT.rightPos
		) && (
			thatT.leftPos < thisT.rightPos
		)
	}

	engulfsDomainOf (that, phase='thisFrame') {
		// Default transform is for this frame.
		const thisT = this.transformFrame(phase)
		const thatT = that.transformFrame(phase)
		return (
			thisT.leftPos < thatT.leftPos
		) && (
			thatT.rightPos < thisT.rightPos
		)
	}

	sharesRangeWith (that, phase='thisFrame') {
		// Default transform is for this frame.
		const thisT = this.transformFrame(phase)
		const thatT = that.transformFrame(phase)
		return (
			thisT.topPos < thatT.bottomPos
		) && (
			thatT.topPos < thisT.bottomPos
		)
	}

	engulfsRangeOf (that, phase='thisFrame') {
		// Default transform is for this frame.
		const thisT = this.transformFrame(phase)
		const thatT = that.transformFrame(phase)
		return (
			thisT.topPos < thatT.topPos
		) && (
			thatT.bottomPos < thisT.bottomPos
		)
	}

	sharesSpaceWith (that, phase='thisFrame') {
		return (
			this.sharesDomainWith(that, phase)
		) && (
			this.sharesRangeWith(that, phase)
		)
	}

	engulfsSpaceOf (that, phase='thisFrame') {
		return (
			this.engulfsDomainOf(that, phase)
		) && (
			this.engulfsRangeOf(that, phase)
		)
	}

	/* Effects */

	moveUpEffect () {
		const boardHeight = this.game.board.height
		// Y Coordinates can't exceed the board's height.
		if (this.transform.yPos >= boardHeight) this.transform.yPos = boardHeight
		// Y Velocity must be negative.
		if (this.transform.yVel > 0) this.transform.yVel = -this.transform.yVel
	}

	moveDownEffect () {
		// Y Coordinates can't go below zero.
		if (this.transform.yPos <= 0) this.transform.yPos = 0
		// Y Velocity must be positive.
		if (this.transform.yVel < 0) this.transform.yVel = -this.transform.yVel
	}

	moveLeftEffect () {
		const boardWidth = this.game.board.width
		// X Coordinates can't exceed the board's width.
		if (this.transform.xPos >= boardWidth) this.transform.xPos = boardWidth
		// X Velocity must be negative.
		if (this.transform.xVel > 0) this.transform.xVel = -this.transform.xVel
	}

	moveRightEffect () {
		// X Coordinates can't go below zero.
		if (this.transform.xPos <= 0) this.transform.xPos = 0
		// X Velocity must be positive.
		if (this.transform.xVel < 0) this.transform.xVel = -this.transform.xVel
	}

	checkFieldTriggers () {
		this.fieldTriggers.forEach((fx) => fx())
	}

	resolvePendingEffects () {
		this.pendingEffects.forEach((fx) => fx())
		this.pendingEffects = []
	}

	draw () {
		this.transform = this.nextTransform
		const context = this.game.canvas.context
		const {xPos, yPos, width, height} = this.transform
		context.fillStyle = this.color
		context.beginPath();
		context.rect(xPos, yPos, width, height);
		context.fill();
		context.closePath();
	}
}

export default MobileObject
