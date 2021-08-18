import MobileObject from './mobile-object.js'

class RectangleMOB extends MobileObject {
	constructor (game, {coordinates, dimensions, color}) {
		super(game, {coordinates})
		this.dimensions = dimensions
		this.color = color
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

	get down () {
		return this.yPos + this.height
	}

	get nextRight () {
		return this.nextXPos + this.length
	}

	get nextDown () {
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
		let up = 'up'
		let down = 'down'
		if (phase === 'nextFrame') {
			up = 'nextUp'
			down = 'nextDown'
		}

		return (
			this[up] < that[down]
		) && (
			that[up] < this[down]
		)
	}

	sharesSpaceWith (that, phase='thisFrame') {
		return (
			this.sharesDomainWith(that, phase)
		) && (
			this.sharesRangeWith(that, phase)
		)
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
