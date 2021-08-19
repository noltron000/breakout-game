import MobileObject from './mobile-object.js'

class Paddle extends MobileObject {
	constructor (game, transform) {
		super(game, transform, {color: 'black'})
		// document.addEventListener("keydown", this.keyDownHandler.bind(this))
		// document.addEventListener("keyup", this.keyUpHandler.bind(this))
		this.pressL = false
		this.pressR = false
		this.fieldTriggers.push(
			() => {if (this.pressL) this.pendingEffects.push(this.controlLeftEffect.bind(this))},
			() => {if (this.pressR) this.pendingEffects.push(this.controlRightEffect.bind(this))},
		)
		// Setting up keypress event listener
		document.addEventListener("keydown", this.keyDownHandler.bind(this));
		document.addEventListener("keyup", this.keyUpHandler.bind(this));
		// .bind(this) forces "this" context to be remembered in future steps.
		// otherwise, "this" will be the #document
	}

	keyDownHandler (event) {
		if (event.keyCode == 37) {
			this.pressL = true;
		} else if (event.keyCode == 39) {
			this.pressR = true;
		}
	}

	keyUpHandler (event) {
		if (event.keyCode == 37) {
			this.pressL = false;
		} else if (event.keyCode == 39) {
			this.pressR = false;
		}
	}

	controlLeftEffect () {
		this.transform.xPos -= 3
	}

	controlRightEffect () {
		this.transform.xPos += 3
	}
}

export default Paddle
