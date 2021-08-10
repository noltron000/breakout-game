import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (canvasContext, {coordinates, dimensions, color}) {
		super(canvasContext, {coordinates})
		this.dimensions = dimensions
		this.color = color
	}

	draw () {
		const context = this.canvasContext
		const [xPos, yPos] = this.position
		const [length, height] = this.dimensions
		context.fillStyle = this.color
		context.beginPath();
		context.rect(xPos, yPos, length, height);
		context.fill();
		context.closePath();
	}
}

export default RectangleMOB
