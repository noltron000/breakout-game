import MobileObject from './mobile-object.js'

class Brick extends MobileObject {
	constructor (game, {coordinates, dimensions}) {
		super(game, {coordinates, dimensions, color: 'black'})
		this.health = 1
	}
}

export default Brick
