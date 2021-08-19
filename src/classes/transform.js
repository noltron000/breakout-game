class Transform {
	constructor (transform) {
		this.data = transform
	}

	/* TRANSFORM ROTATIONS - GETTERS & SETTERS */

	// // This remains unused for now
	// get rotations () {
	// 	return this.data.rotations
	// }

	/* TRANSFORM DIMENSION - GETTERS & SETTERS */

	get dimensions () {
		return this.data.dimensions
	}
	set dimensions (dimesions) {
		this.data.dimensions = dimensions
	}

	get width () {
		return this.dimensions[0].x
	}
	set width (width) {
		this.dimensions[0].x = width
	}

	get height () {
		return this.dimensions[0].y
	}
	set height (height) {
		this.dimensions[0].y = height
	}

	// It's unlikely we'll be working with dimension deltas.
	// The size of objects won't likely be changing in these games.
	// Beyond the first element in the dimensions array, it wont be used.

	/* TRANSFORM POSITIONS - GETTERS & SETTERS */

	get positions () {
		return this.data.positions
	}
	set positions (positions) {
		this.data.positions = positions
	}

	get position () {
		return this.positions[0]
	}
	set position (position) {
		this.positions[0] = position
	}

	get velocity () {
		return this.positions[1]
	}
	set velocity (velocity) {
		this.positions[1] = velocity
	}

	get acceleration () {
		return this.positions[2]
	}
	set acceleration (acceleration) {
		this.positions[2] = acceleration
	}

	get xPos () {
		return this.position.x
	}
	set xPos (xPos) {
		this.position.x = xPos
	}

	get yPos () {
		return this.position.y
	}
	set yPos (yPos) {
		this.position.y = yPos
	}

	get xVel () {
		return this.velocity.x
	}
	set xVel (xVel) {
		this.velocity.x = xVel
	}

	get yVel () {
		return this.velocity.y
	}
	set yVel (yVel) {
		this.velocity.y = yVel
	}

	get xAcc () {
		return this.acceleration.x
	}
	set xAcc (xAcc) {
		this.acceleration.x = xAcc
	}

	get yAcc () {
		return this.acceleration.y
	}
	set yAcc (yAcc) {
		this.acceleration.y = yAcc
	}

	get leftPos () {
		return this.xPos
	}

	get rightPos () {
		return this.xPos + this.width
	}

	get topPos () {
		return this.yPos
	}

	get bottomPos () {
		return this.yPos + this.height
	}
}

export default Transform
