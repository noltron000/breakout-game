import MobileObject from './mobile-object.js'

class Ball extends MobileObject {
	constructor (game, {coordinates, dimensions}) {
		super(game, {coordinates, dimensions, color: 'white'})
		this.health = 1
	}
}

export default Ball
