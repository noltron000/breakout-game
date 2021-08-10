import RectangleMOB from './rectangle-mob.js'

class Ball extends RectangleMOB {
	constructor () {}
}

export default Ball

/***
class OLD__Ball extends Node { // CREATES GAME BALL WITH PHYSICS //`
	constructor(x, y, length, height, xDelta, yDelta, colour, radius) {
		super(x, y, length, height, xDelta, yDelta, colour);
		this.shape = "circle";
		this.radius = radius;

		// By giving circles a length and height, we don't need to
		// compute the circle's full diameter multiple times over.
		this.length = this.radius * 2;
		this.height = this.radius * 2;
	}

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		// By offsetting this.x and this.y by this.radius,
		// we are able to normalize circles with squares elsewhere.
		// EXAMPLE: wall-collision functionality needs to
		// know the edges, and is based of x, y, length, and height.
		//               ↓ ↓ ↓ ↓ ↓ ↓           ↓ ↓ ↓ ↓ ↓ ↓
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}
***/
