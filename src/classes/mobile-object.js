class MobileObject {
	#coordinates
	#nextFrame
	constructor (canvasContext, {coordinates}) {
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
		this.#coordinates = [[0, 0]]

		// Fill it with what coordinates that we have. It could only be positions.
		coordinates.forEach((pair, index) => {
			this.#coordinates[index] = pair
		})

		this.health = null
		this.canvasContext = canvasContext
		this.#nextFrame = null
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

	get nextXPos () {
		return this.nextFrame[0][0]
	}

	get nextYPos () {
		return this.nextFrame[0][1]
	}

	set coordinates (givenCoordinates) {
		this.#coordinates = givenCoordinates
		this.#nextFrame = null
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
}

export default MobileObject
