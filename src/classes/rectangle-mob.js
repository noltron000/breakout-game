import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (length, height) {
		super()
		this.dimensions = [length, height]
	}
}

export default RectangleMOB
