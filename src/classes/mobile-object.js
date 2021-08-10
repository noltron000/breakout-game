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

		this.canvasContext = canvasContext
		this.#nextFrame = null
	}

	get coordinates () {
		return this.#coordinates
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

/***
class OLD__Node { // PARENT NODE — SETS UP INTERACTABLE SHAPES //
	...

	boundary() { // LIMITS MOVEMENT TO CANVAS //
		if (this.x < 0) { // too far left
			this.x = 0;
			this.xDelta = Math.abs(this.xDelta);
		} else if (this.x > canvas.width - this.length) { // too far right
			this.x = canvas.width - this.length;
			this.xDelta = -Math.abs(this.xDelta);
		} if (this.y < 0) { // too far up
			this.y = 0;
			this.yDelta = Math.abs(this.yDelta);
		} else if (this.y > canvas.height - this.height) { // too far down
			this.y = canvas.height - this.height;
			this.yDelta = -Math.abs(this.yDelta);
		}
	}

	...
}
***/

export default MobileObject
