class TriggersEffects {
	constructor (game, mob) {
		this.game = game
		this.mob = mob

		// This class could have been encorporated with the MOB object.
		// However, putting it here seperates the code just a little more.
		// You'll probably only see this used within other class constructors.

		// Use the field and collision triggers to create pending effects.
		// These three array variables will start empty.
		//
		// The array of triggers will be manually populated after this is instantiated.
		// The fieldTriggers watch for true/false statements every frame.
		// If one is true, it will push a function onto pendingEffects.
		// After fieldTriggers is checked, the pendingEffects are used and emptied.
		this.fieldTriggers = []
		this.collisionTriggers = []
		this.pendingEffects = []
	}

	/* Field Triggers */

	upWallTrigger () {
		// Get the height of the game board.
		const canvasHeight = this.game.canvas.element.height

		// If the object is taller than the canvas, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (this.mob.nextDown > canvasHeight) return false

		// Activate if the MOB would sink into the upper wall.
		else if (this.mob.nextUp < 0) return true
		else return false
	}

	downWallTrigger () {
		// Get the height of the game board.
		const canvasHeight = this.game.canvas.element.height

		// If the object is taller than the canvas, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (this.mob.nextUp < 0) return false

		// Activate if the MOB would sink into the lower wall.
		else if (this.mob.nextDown > canvasHeight) return true
		else return false
	}

	leftWallTrigger () {
		// Get the length of the game board.
		const canvasLength = this.game.canvas.element.length

		// If the object is wider than the canvas, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (this.mob.nextRight > canvasLength) return false

		// Activate if the MOB would sink into the left wall.
		else if (this.mob.nextLeft < 0) return true
		else return false
	}

	rightWallTrigger () {
		// Get the length of the game board.
		const canvasLength = this.game.canvas.element.length

		// If the object is wider than the canvas, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (this.mob.nextLeft < 0) return false

		// Activate if the MOB would sink into the right wall.
		else if (this.mob.nextRight > canvasLength) return true
		else return false
	}

	/* Collision Triggers */

	// TODO
	// ...

	/* Effects */

	moveUpEffect () {
		const canvasHeight = this.game.canvas.element.height
		const coordinates = [...this.mob.coordinates]

		// Y Coordinates can't exceed the board's height.
		if (coordinates[0][1] >= canvasHeight) coordinates[0][1] = canvasHeight
		// Y Velocity must be negative.
		if (coordinates[1][1] > 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		this.mob.coordinates = coordinates
	}

	moveDownEffect () {
		const coordinates = [...this.mob.coordinates]

		// Y Coordinates can't go below zero.
		if (coordinates[0][1] <= 0) coordinates[0][1] = 0
		// Y Velocity must be positive.
		if (coordinates[1][1] < 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		this.mob.coordinates = coordinates
	}

	moveLeftEffect () {
		const canvasLength = this.game.canvas.element.length
		const coordinates = [...this.mob.coordinates]

		// X Coordinates can't exceed the board's length.
		if (coordinates[0][1] >= canvasLength) coordinates[0][1] = canvasLength
		// X Velocity must be negative.
		if (coordinates[1][1] > 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		this.mob.coordinates = coordinates
	}

	moveRightEffect () {
		const coordinates = [...this.mob.coordinates]

		// X Coordinates can't go below zero.
		if (coordinates[0][0] <= 0) coordinates[0][0] = 0
		// X Velocity must be positive.
		if (coordinates[1][0] < 0) coordinates[1][0] = -coordinates[1][0]

		// Set the MOB's coordinates now.
		this.mob.coordinates = coordinates
	}
}

export default TriggersEffects
