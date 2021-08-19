class MobileObject {
	#transform
	#nextTransform
	constructor (game, transform, {color}) {
		// Define the parent game.
		this.game = game

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

		// Notes:
		// - this.transform[0] is position.
		// - this.transform[1] is velocity.
		// - this.transform[2] is acceleration.
		//
		// Transform data is stored in arrays of cartesian coordinates [{x,y}, ...]
		//
		// This is an n-by-two matrix (n>0).
		// For each matrix in each frame, the matrix to the right gets added on.
		// The first item is always the object's position.
		this.transform = transform.positions
		this.dimensions = transform.dimensions
		this.color = color
	}

	get length () {
		return this.dimensions[0].x
	}

	get height () {
		return this.dimensions[0].y
	}

	get transform () {
		return this.#transform
	}

	get xPos () {
		return this.transform[0].x
	}

	get yPos () {
		return this.transform[0].y
	}

	get left () {
		return this.xPos
	}

	get right () {
		return this.xPos + this.length
	}

	get top () {
		return this.yPos
	}

	get bottom () {
		return this.yPos + this.height
	}

	get nextTransform () {
		// If the next frame isnt calculated, calculate it.
		if (this.#nextTransform === null) {
			// Loop through every coordinate pair.
			this.#nextTransform = this.transform.map((coordinatePair, index) => {
				// Determine if there is another array after this one.
				if (index + 1 >= this.transform.length) {
					return coordinatePair // The final array always remains unchanged.
				}

				// Add the next object's elements to this object's elements, respectively.
				const x = this.transform[index].x + this.transform[index + 1].x
				const y = this.transform[index].y + this.transform[index + 1].y
				return {x, y}
			})
		}

		// Return the calculated next frame.
		return this.#nextTransform
	}

	get nextXPos () {
		return this.nextTransform[0].x
	}

	get nextYPos () {
		return this.nextTransform[0].y
	}

	get nextLeft () {
		return this.nextXPos
	}

	get nextRight () {
		return this.nextXPos + this.length
	}

	get nextTop () {
		return this.nextYPos
	}

	get nextBottom () {
		return this.nextYPos + this.height
	}

	set transform (givenCoordinates) {
		this.#transform = givenCoordinates
		this.#nextTransform = null
	}

	/* Field Triggers */

	collidesWithTopWall (phase='thisFrame') {

		let top = 'top'
		let bottom = 'bottom'
		if (phase === 'nextFrame') {
			top = 'nextTop'
			bottom = 'nextBottom'
		}

		// Get the height of the game board.
		const canvasHeight = this.game.board.height

		// If the object is taller than the canvas, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (this[bottom] > canvasHeight) return false

		// Activate if the MOB would sink into the upper wall.
		else if (this[top] < 0) return true
		else return false
	}

	collidesWithBottomWall (phase='thisFrame') {

		let top = 'top'
		let bottom = 'bottom'
		if (phase === 'nextFrame') {
			top = 'nextTop'
			bottom = 'nextBottom'
		}

		// Get the height of the game board.
		const canvasHeight = this.game.board.height

		// If the object is taller than the canvas, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (this[top] < 0) return false

		// Activate if the MOB would sink into the lower wall.
		else if (this[bottom] > canvasHeight) return true
		else return false
	}

	collidesWithLeftWall (phase='thisFrame') {

		let left = 'left'
		let right = 'right'
		if (phase === 'nextFrame') {
			left = 'nextLeft'
			right = 'nextRight'
		}

		// Get the length of the game board.
		const canvasLength = this.game.board.length

		// If the object is wider than the canvas, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (this[right] > canvasLength) return false

		// Activate if the MOB would sink into the left wall.
		else if (this[left] < 0) return true
		else return false
	}

	collidesWithRightWall (phase='thisFrame') {

		let left = 'left'
		let right = 'right'
		if (phase === 'nextFrame') {
			left = 'nextLeft'
			right = 'nextRight'
		}

		// Get the length of the game board.
		const canvasLength = this.game.board.length

		// If the object is wider than the canvas, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (this[left] < 0) return false

		// Activate if the MOB would sink into the right wall.
		else if (this[right] > canvasLength) return true
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

		let left = 'left'
		let right = 'right'
		if (phase === 'nextFrame') {
			left = 'nextLeft'
			right = 'nextRight'
		}

		return (
			this[left] < that[right]
		) && (
			that[left] < this[right]
		)
	}

	engulfsDomainOf (that, phase='thisFrame') {

		let left = 'left'
		let right = 'right'
		if (phase === 'nextFrame') {
			left = 'nextLeft'
			right = 'nextRight'
		}

		return (
			this[left] < that[left]
		) && (
			that[right] < this[right]
		)
	}

	sharesRangeWith (that, phase='thisFrame') {

		let top = 'top'
		let bottom = 'bottom'
		if (phase === 'nextFrame') {
			top = 'nextTop'
			bottom = 'nextBottom'
		}

		return (
			this[top] < that[bottom]
		) && (
			that[top] < this[bottom]
		)
	}

	engulfsRangeOf (that, phase='thisFrame') {

		let top = 'top'
		let bottom = 'bottom'
		if (phase === 'nextFrame') {
			top = 'nextTop'
			bottom = 'nextBottom'
		}

		return (
			this[top] < that[top]
		) && (
			that[bottom] < this[bottom]
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
		const transform = this.transform
		const canvasHeight = this.game.board.height

		// Y Coordinates can't exceed the board's height.
		if (transform[0].y >= canvasHeight) transform[0].y = canvasHeight
		// Y Velocity must be negative.
		if (transform[1].y > 0) transform[1].y = -transform[1].y

		// Set the MOB's transform now.
		this.transform = transform
	}

	moveDownEffect () {
		const transform = this.transform

		// Y Coordinates can't go below zero.
		if (transform[0].y <= 0) transform[0].y = 0
		// Y Velocity must be positive.
		if (transform[1].y < 0) transform[1].y = -transform[1].y

		// Set the MOB's transform now.
		this.transform = transform
	}

	moveLeftEffect () {
		const canvasLength = this.game.board.length
		const transform = this.transform

		// X Coordinates can't exceed the board's length.
		if (transform[0].x >= canvasLength) transform[0].x = canvasLength
		// X Velocity must be negative.
		if (transform[1].x > 0) transform[1].x = -transform[1].x

		// Set the MOB's coordinates now.
		this.transform = transform
	}

	moveRightEffect () {
		const transform = this.transform

		// X Coordinates can't go below zero.
		if (transform[0].x <= 0) transform[0].x = 0
		// X Velocity must be positive.
		if (transform[1].x < 0) transform[1].x = -transform[1].x

		// Set the MOB's coordinates now.
		this.transform = transform
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
		const {x: xPos, y: yPos} = this.transform[0]
		const {x: length, y: height} = this.dimensions[0]
		context.fillStyle = this.color
		context.beginPath();
		context.rect(xPos, yPos, length, height);
		context.fill();
		context.closePath();
	}
}

export default MobileObject
