class MobileObject {
	constructor (canvasContext) {
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
		this.canvasContext = canvasContext
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

/***
class OLD__Node { // PARENT NODE — SETS UP INTERACTABLE SHAPES //
	constructor(x = 0, y = 0, length = 0, height = 0, xDelta = 0, yDelta = 0, colour = 'grey') {
		this.x = x;
		this.y = y;
		this.length = length;
		this.height = height;
		this.xDelta = xDelta;
		this.yDelta = yDelta;
		this.colour = colour;
	}

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

	draw() { // PIXEL NODE
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, length, height)
		ctx.fill();
		ctx.closePath();
	}

	move() { // MOVE OBJECT
		this.x += this.xDelta
		this.y += this.yDelta
		this.boundary()
	}
}
***/

export default MobileObject
