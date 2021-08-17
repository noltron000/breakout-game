import RectangleMOB from './rectangle-mob.js'

class Ball extends RectangleMOB {
	constructor (canvasContext, {coordinates, dimensions}) {
		super(canvasContext, {coordinates, dimensions, color: 'white'})
		this.health = 1
	}
}

export default Ball
