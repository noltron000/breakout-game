import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (canvasContext, coordinates, dimensions) {
		super(canvasContext, coordinates)
		this.dimensions = dimensions
	}

	draw () {
		const context = this.canvasContext
		const [xPos, yPos] = this.position
		const [length, height] = this.dimensions
		context.fillStyle = 'red'
		context.beginPath();
		context.rect(xPos, yPos, length, height);
		context.fill();
		context.closePath();
	}
}

export default RectangleMOB
