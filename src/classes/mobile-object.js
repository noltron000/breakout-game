class MobileObject {
	#coordinates
	#nextFrame
	constructor (game, {coordinates, dimensions, color}) {
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
		// - this.coordinates[0] is position.
		// - this.coordinates[1] is velocity.
		// - this.coordinates[2] is acceleration.
		//
		// Coordinates is stored in cartesian coordinates. [x,y]
		//
		// This is an n-by-two array (n>0).
		// For each array in each frame, the array to the right gets added on.
		// The first item is always the object's position.
		this.coordinates = coordinates
		this.dimensions = dimensions
		this.color = color
	}

	get length () {
		return this.dimensions[0]
	}

	get height () {
		return this.dimensions[1]
	}

	get coordinates () {
		return this.#coordinates
	}

	get xPos () {
		return this.coordinates[0][0]
	}

	get yPos () {
		return this.coordinates[0][1]
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

	get nextFrame () {
		// If the next frame isnt calculated, calculate it.
		if (this.#nextFrame === null) {
			// Loop through every coordinate pair.
			this.#nextFrame = this.coordinates.map((coordinatePair, index) => {
				// Determine if there is another array after this one.
				if (index + 1 >= this.coordinates.length) {
					return coordinatePair // The final array always remains unchanged.
				}

				// Add the next array's elements to this array's elements, respectively.
				const nextCoordinatePair = this.coordinates[index + 1]
				return coordinatePair.map((coordinate, pairIndex) => {
					// Note that the coordinatePair elements are just x/y coordinate pairs.
					// We didn't need a map per say, its not like we'll ever have x/y/z coords.
					const nextCoordinate = nextCoordinatePair[pairIndex]
					return coordinate + nextCoordinate
				})
			})
		}

		// Return the calculated next frame.
		return this.#nextFrame
	}

	get nextXPos () {
		return this.nextFrame[0][0]
	}

	get nextYPos () {
		return this.nextFrame[0][1]
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

	set coordinates (givenCoordinates) {
		this.#coordinates = givenCoordinates
		this.#nextFrame = null
	}

	/* Field Triggers */

	collidesWithTopWall (phase='thisFrame') {

		let top = 'top'
		let bottom = 'bottom'
		if (phase === 'nextFrame') {
			top = 'nextTop'
			bottom = 'nextBotom'
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
			bottom = 'nextBotom'
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
			bottom = 'nextBotom'
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
			bottom = 'nextBotom'
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
		const canvasHeight = this.game.board.height
		const coordinates = [...this.coordinates]

		// Y Coordinates can't exceed the board's height.
		if (coordinates[0][1] >= canvasHeight) coordinates[0][1] = canvasHeight
		// Y Velocity must be negative.
		if (coordinates[1][1] > 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		this.coordinates = coordinates
	}

	moveDownEffect () {
		const coordinates = [...this.coordinates]

		// Y Coordinates can't go below zero.
		if (coordinates[0][1] <= 0) coordinates[0][1] = 0
		// Y Velocity must be positive.
		if (coordinates[1][1] < 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		this.coordinates = coordinates
	}

	moveLeftEffect () {
		const canvasLength = this.game.board.length
		const coordinates = [...this.coordinates]

		// X Coordinates can't exceed the board's length.
		if (coordinates[0][1] >= canvasLength) coordinates[0][1] = canvasLength
		// X Velocity must be negative.
		if (coordinates[1][1] > 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		this.coordinates = coordinates
	}

	moveRightEffect () {
		const coordinates = [...this.coordinates]

		// X Coordinates can't go below zero.
		if (coordinates[0][0] <= 0) coordinates[0][0] = 0
		// X Velocity must be positive.
		if (coordinates[1][0] < 0) coordinates[1][0] = -coordinates[1][0]

		// Set the MOB's coordinates now.
		this.coordinates = coordinates
	}

	checkFieldTriggers () {
		this.fieldTriggers.forEach((fx) => fx())
	}

	resolvePendingEffects () {
		this.pendingEffects.forEach((fx) => fx())
		this.pendingEffects = []
	}

	draw () {
		this.coordinates = this.nextFrame
		const context = this.game.canvas.context
		const [xPos, yPos] = this.coordinates[0]
		const [length, height] = this.dimensions
		context.fillStyle = this.color
		context.beginPath();
		context.rect(xPos, yPos, length, height);
		context.fill();
		context.closePath();
	}
}

export default MobileObject
