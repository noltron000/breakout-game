class EffectField {
	constructor (game, {trigger}) {
		this.game = game

		// When does this effect field trigger?
		// Does it trigger when an object is just touching the field?
		// Or does it only trigger when an object is completely within the field?
		this.trigger = 'touch' // alternative is 'engulf'

		// This class doesn't start with any effect functions.
		// Please provide effect functions after you instantiate your field.
		this.functions = []
	}

	wallBounce (mob) {
		const {
			length: canvasLength,
			height: canvasHeight,
		} = this.game.canvas.element

		if (mob.nextLeft < 0 && mob.nextRight > canvasLength) {
			// a weird (but possible) case where the canvas is too thin.
			// if this happens, do nothing.
		}
		else if (mob.nextLeft < 0) {
			const coordinates = [...mob.coordinates]

			// minimum xPos / left is zero
			coordinates[0][0] = 0

			// increasing x velocity only
			coordinates[1][0] = Math.abs(coordinates[1][0])

			// set the new coordinates
			mob.coordinates = coordinates
		}
		else if (mob.nextRight > canvasLength) {
			const coordinates = [...mob.coordinates]

			// maximum xPos+length / right is canvas length
			coordinates[0][0] = canvasLength

			// decreasing x velocity only
			coordinates[1][0] = -Math.abs(coordinates[1][0])

			// set the new coordinates
			mob.coordinates = coordinates
		}

		if (mob.nextUp < 0 && mob.nextDown > canvasHeight) {
			// a weird (but possible) case where the canvas is too short.
			// if this happens, do nothing.
		}
		else if (mob.nextUp < 0) {
			const coordinates = [...mob.coordinates]

			// minimum yPos / up is zero (canvas top)
			coordinates[0][1] = 0

			// increasing y velocity only (go back down)
			coordinates[1][1] = Math.abs(coordinates[1][1])

			// set the new coordinates
			mob.coordinates = coordinates
		}
		else if (mob.nextDown > canvasHeight) {
			const coordinates = [...mob.coordinates]

			// maximum yPos+height / down is canvas height (bottom)
			coordinates[0][1] = canvasHeight

			// decreasing y velocity only (go back up)
			coordinates[1][1] = -Math.abs(coordinates[1][1])

			// set the new coordinates
			mob.coordinates = coordinates
		}
	}

	wallBounceBall (mob) {
		const {
			height: canvasHeight,
		} = this.game.canvas.element

		if (mob.nextDown > canvasHeight) {
			mob.health -= 1
		}
	}
}
