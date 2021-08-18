import TriggersEffects from "./triggers-effects.js"

class MobileObject {
	#coordinates
	#nextFrame
	constructor (game, {coordinates}) {
		// Define the parent game.
		this.game = game

		// There are no default effects or triggers for a core MobileObject.
		// Watch my subclasses, they will use TriggersEffects more.
		this.triggersEffects = new TriggersEffects(game, this)

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
		return this.xPos
	}

	get up () {
		return this.yPos
	}

	get down () {
		return this.yPos
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
		return this.nextXPos
	}

	get nextUp () {
		return this.nextYPos
	}

	get nextDown () {
		return this.nextYPos
	}

	set coordinates (givenCoordinates) {
		this.#coordinates = givenCoordinates
		this.#nextFrame = null
	}
}

export default MobileObject
