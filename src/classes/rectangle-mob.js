import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (canvasContext, coordinates, dimensions) {
		super(canvasContext, coordinates)
		this.dimensions = dimensions
	}

	draw () {}
}

export default RectangleMOB
