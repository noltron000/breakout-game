import RectangleMOB from './rectangle-mob.js'

class Brick extends RectangleMOB {
	constructor (game, {coordinates, dimensions}) {
		super(game, {coordinates, dimensions, color: 'black'})
		this.health = 1
	}
}

export default Brick
