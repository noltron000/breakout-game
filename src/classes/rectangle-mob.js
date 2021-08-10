import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (canvasContext, length, height) {
		super(canvasContext)
		this.dimensions = [length, height]
	}

	draw () {}
}

export default RectangleMOB
