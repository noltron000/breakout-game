import Ball from './ball.js'

class EffectField {
	static game = undefined

	static wallEffectFields (mob) {
		const functions = [
			(mob) => {if (this.downWallBallTrigger(mob)) this.damageEffect(mob)},
			(mob) => {if (this.upWallTrigger(mob)) this.moveDownEffect(mob)},
			(mob) => {if (this.downWallTrigger(mob)) this.moveUpEffect(mob)},
			(mob) => {if (this.leftWallTrigger(mob)) this.moveRightEffect(mob)},
			(mob) => {if (this.rightWallTrigger(mob)) this.moveLeftEffect(mob)},
		]

		functions.forEach(fx => fx(mob))
	}

	static upWallTrigger (mob) {
		// Get the height of the game board.
		const canvasHeight = this.game.canvas.element.height

		// If the object is taller than the canvas, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (mob.nextDown > canvasHeight) return false

		// Activate if the MOB would sink into the upper wall.
		else if (mob.nextUp < 0) return true
		else return false
	}

	static downWallTrigger (mob) {
		// Get the height of the game board.
		const canvasHeight = this.game.canvas.element.height

		// If the object is taller than the canvas, its possible
		// 	that the object is both too high and too low.
		// When this happens, block this effect trigger.
		if (mob.nextUp < 0) return false

		// Activate if the MOB would sink into the lower wall.
		else if (mob.nextDown > canvasHeight) return true
		else return false
	}

	static leftWallTrigger (mob) {
		// Get the length of the game board.
		const canvasLength = this.game.canvas.element.length

		// If the object is wider than the canvas, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (mob.nextRight > canvasLength) return false

		// Activate if the MOB would sink into the left wall.
		else if (mob.nextLeft < 0) return true
		else return false
	}

	static rightWallTrigger (mob) {
		// Get the length of the game board.
		const canvasLength = this.game.canvas.element.length

		// If the object is wider than the canvas, its possible
		// 	that the object is both too left and too right.
		// When this happens, block this effect trigger.
		if (mob.nextLeft < 0) return false

		// Activate if the MOB would sink into the right wall.
		else if (mob.nextRight > canvasLength) return true
		else return false
	}

	static downWallBallTrigger (mob) {
		if (mob instanceof Ball
			&& this.downWallTrigger(mob)) return true
		else return false
	}

	static moveUpEffect (mob) {
		const canvasHeight = this.game.canvas.element.height
		const coordinates = [...mob.coordinates]

		// Y Coordinates can't exceed the board's height.
		if (coordinates[0][1] >= canvasHeight) coordinates[0][1] = canvasHeight
		// Y Velocity must be negative.
		if (coordinates[1][1] > 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		mob.coordinates = coordinates
	}

	static moveDownEffect (mob) {
		const coordinates = [...mob.coordinates]

		// Y Coordinates can't go below zero.
		if (coordinates[0][1] <= 0) coordinates[0][1] = 0
		// Y Velocity must be positive.
		if (coordinates[1][1] < 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		mob.coordinates = coordinates
	}

	static moveLeftEffect (mob) {
		const canvasLength = this.game.canvas.element.length
		const coordinates = [...mob.coordinates]

		// X Coordinates can't exceed the board's length.
		if (coordinates[0][1] >= canvasLength) coordinates[0][1] = canvasLength
		// X Velocity must be negative.
		if (coordinates[1][1] > 0) coordinates[1][1] = -coordinates[1][1]

		// Set the MOB's coordinates now.
		mob.coordinates = coordinates
	}

	static moveRightEffect (mob) {
		const coordinates = [...mob.coordinates]

		// X Coordinates can't go below zero.
		if (coordinates[0][0] <= 0) coordinates[0][0] = 0
		// X Velocity must be positive.
		if (coordinates[1][0] < 0) coordinates[1][0] = -coordinates[1][0]

		// Set the MOB's coordinates now.
		mob.coordinates = coordinates
	}

	static damageEffect (mob) {
		mob.health -= 1
	}
}

export default EffectField
