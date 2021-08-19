import MobileObject from './mobile-object.js'

class Ball extends MobileObject {
	constructor (game, transform) {
		super(game, transform, {color: 'white'})
		this.health = 1
	}
}

export default Ball
