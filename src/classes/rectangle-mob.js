import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (game, {coordinates, dimensions, color}) {
		super(game, {coordinates})
		this.dimensions = dimensions
		this.color = color

		// FIXME: Gosh this is really gross. Please no.
		// Define wall-bouncing for rectangle mobs.
		this.triggersEffects.fieldTriggers.push(
			() => {if (this.triggersEffects.topWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveDownEffect.bind(this.triggersEffects))},
			() => {if (this.triggersEffects.bottomWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveUpEffect.bind(this.triggersEffects))},
			() => {if (this.triggersEffects.leftWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveRightEffect.bind(this.triggersEffects))},
			() => {if (this.triggersEffects.rightWallFieldTrigger()) this.triggersEffects.pendingEffects.push(this.triggersEffects.moveLeftEffect.bind(this.triggersEffects))},
		)
	}

	get length () {
		return this.dimensions[0]
	}

	get height () {
		return this.dimensions[1]
	}

	get right () {
		return this.xPos + this.length
	}

	get bottom () {
		return this.yPos + this.height
	}

	get nextRight () {
		return this.nextXPos + this.length
	}

	get nextBottom () {
		return this.nextYPos + this.height
	}

	// This diagram might help...
	// O<=>O   X<->X ❌️
	// X<->X   O<=>O ❌️
	// O<=<X>=>O-->X ✔️
	// X<-<O<=<X>=>O ✔️
	// O<=<X<->X>=>O ✔️
	// X<-<O<=>O>->X ✔️
	// ...Where X and O are this and that.
	// Arrows connect between left and right Xs and Os.

	sharesDomainWith (that, phase='thisFrame') {
		let left = 'left'
		let right = 'right'
		if (phase === 'nextFrame') {
			left = 'nextLeft'
			right = 'nextRight'
		}

		return (
			this[left] < that[right]
		) && (
			that[left] < this[right]
		)
	}

	sharesRangeWith (that, phase='thisFrame') {
		let top = 'top'
		let bottom = 'bottom'
		if (phase === 'nextFrame') {
			top = 'nextTop'
			bottom = 'nextBotom'
		}

		return (
			this[top] < that[bottom]
		) && (
			that[top] < this[bottom]
		)
	}

	sharesSpaceWith (that, phase='thisFrame') {
		return (
			this.sharesDomainWith(that, phase)
		) && (
			this.sharesRangeWith(that, phase)
		)
	}

	checkFieldTriggers () {
		this.triggersEffects.fieldTriggers.forEach((fx) => fx())
	}

	resolvePendingEffects () {
		this.triggersEffects.pendingEffects.forEach((fx) => fx())
		this.triggersEffects.pendingEffects = []
	}

	draw () {
		this.coordinates = this.nextFrame
		const context = this.game.canvas.context
		const [xPos, yPos] = this.coordinates[0]
		const [length, height] = this.dimensions
		context.fillStyle = this.color
		context.beginPath();
		context.rect(xPos, yPos, length, height);
		context.fill();
		context.closePath();
	}
}

export default RectangleMOB
