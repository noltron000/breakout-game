class MobileObject {
	constructor () {
		// Notes:
		// - this.coordinates[0] is position.
		// - this.coordinates[1] is velocity.
		// - this.coordinates[2] is acceleration.
		//
		// Coordinates is stored in cartesian coordinates. [x,y]
		//
		// Its initialized as a 3-by-2 array, filled with undefined.
		this.coordinates = [...new Array(3)].map(() => new Array(2))
		this.dimensions = new Array(2)
	}

	get position () {
		return this.coordinates[0]
	}

	get velocity () {
		return this.coordinates[1]
	}

	get acceleration () {
		return this.coordinates[2]
	}

	set position (coordinates) {
		this.coordinates[0] = coordinates
	}

	set velocity (coordinates) {
		this.coordinates[1] = coordinates
	}

	set acceleration (coordinates) {
		this.coordinates[2] = coordinates
	}
}

export default MobileObject
