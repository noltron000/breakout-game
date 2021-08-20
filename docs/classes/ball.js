import MobileObject from './mobile-object.js'
import Brick from './brick.js'

class Ball extends MobileObject {
	constructor (game, transform) {
		super(game, transform, {color: 'white'})

		// FIXME: Gosh this is really gross. Please no.
		// Define wall-bouncing for rectangle mobs.
		this.fieldTriggers.push(
			() => {if (this.collidesWithBottomWall('nextFrame')) this.pendingEffects.push(this.damageBallEffect.bind(this))},
			() => {if (this.dies()) this.pendingEffects.push(() => {this.game.destroyAsset(this)})},
		)

		this.collisionTriggers.push(
			(that) => {if (this.collidesWithBrick(that, 'nextFrame')) that.pendingEffects.push(that.damageBrickEffect.bind(that))},
		)

		this.health = 1
	}

	collidesWithBrick (that, phase='nextFrame') {
		if ((that instanceof Brick) && this.sharesSpaceWith(that, phase)) {
			return true
		}
		return false
	}

	damageBallEffect () {
		this.health -= 1
	}

	dies () {
		return this.health <= 0
	}
}

export default Ball
