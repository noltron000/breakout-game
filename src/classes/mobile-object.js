import TriggersEffects from "./triggers-effects.js"

class MobileObject {
	#coordinates
	#nextFrame
	constructor (game, {coordinates, dimensions, color}) {
		// Define the parent game.
		this.game = game

		// There are no default effects or triggers for a core MobileObject.
		// Watch my subclasses, they will use TriggersEffects more.
		this.triggersEffects = new TriggersEffects(game, this)

		// FIXME: Gosh this is really gross. Please no.
		// Define wall-bouncing for rectangle mobs.
		this.triggersEffects.fieldTriggers.push(
			() => {if (this.triggersEffects.topWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveDownEffect.bind(this.triggersEffects))},
			() => {if (this.triggersEffects.bottomWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveUpEffect.bind(this.triggersEffects))},
			() => {if (this.triggersEffects.leftWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveRightEffect.bind(this.triggersEffects))},
			() => {if (this.triggersEffects.rightWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveLeftEffect.bind(this.triggersEffects))},
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

	checkFieldTriggers () {
		this.triggersEffects.fieldTriggers.forEach((fx) => fx())
	}

	resolvePendingEffects () {
		this.triggersEffects.pendingEffects.forEach((fx) => fx())
		this.triggersEffects.pendingEffects = []
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
