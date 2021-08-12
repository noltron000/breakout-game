getCartesianCoordinates = (coordinates, type='cartesian') => {
	if (type === 'cartesian') {
		const [x, y] = coordinates
		return [x, y]
	}
	else if (type === 'polar') {
		const [r, θ] = coordinates
		const x = r * Math.cos(θ)
		const y = r * Math.sin(θ)
		return [x, y]
	}
}

getPolarCoordinates = (coordinates, type='polar') => {
	if (type === 'polar') {
		const [r, θ] = coordinates
		return [r, θ]
	}
	else if (type === 'cartesian') {
		const [x, y] = coordinates
		const r = (x ** 2 +  y ** 2) ** (1 / 2)
		const θ = (Math.atan(y / x))
		return [r, θ]
	}
}

export {
	getCartesianCoordinates,
	getPolarCoordinates,
}
