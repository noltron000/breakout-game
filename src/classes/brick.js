import RectangleMOB from './rectangle-mob.js'

class Brick extends RectangleMOB {
	constructor (canvasContext, {coordinates, dimensions}) {
		super(canvasContext, {coordinates, dimensions, color: 'black'})
	}
}

export default Brick

/***
class OLD__Brick extends Node { // CREATES DESTRUCTABLE BRICKS //
	constructor(x, y, length, height, xDelta, yDelta, colour, health) {
		super(x, y, length, height, xDelta, yDelta, colour);
		this.shape = "square";
		this.length = length;
		this.height = height;
		this.health = health;
	}

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.length, this.height);
		ctx.fill();
		ctx.closePath();
	}
}
***/
