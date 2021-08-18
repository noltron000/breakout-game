import RectangleMOB from './rectangle-mob.js'

class Ball extends RectangleMOB {
	constructor (game, {coordinates, dimensions}) {
		super(game, {coordinates, dimensions, color: 'white'})
		this.health = 1
	}
}

export default Ball
