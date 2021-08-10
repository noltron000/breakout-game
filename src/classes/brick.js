import RectangleMOB from './rectangle-mob.js'

class Brick extends RectangleMOB {
	constructor (canvasContext, {coordinates, dimensions}) {
		super(canvasContext, {coordinates, dimensions, color: 'black'})
		this.health = 1
	}
}

export default Brick
