import MobileObject from './mobile-object.js'

class Brick extends MobileObject {
	constructor (game, {transform}) {
		super(game, {transform, color: 'black'})
		this.health = 1
	}
}

export default Brick
