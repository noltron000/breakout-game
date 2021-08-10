import RectangleMOB from './rectangle-mob.js'

class Ball extends RectangleMOB {
	constructor (canvasContext, {coordinates, dimensions}) {
		super(canvasContext, {coordinates, dimensions, color: 'white'})
	}
}

export default Ball

/***
-< CLASS STYLE >-
class OLD__Ball extends Node { // CREATES GAME BALL WITH PHYSICS //`
	constructor(x, y, length, height, xDelta, yDelta, colour, radius) {
		super(x, y, length, height, xDelta, yDelta, colour);
		this.shape = "circle";
		this.radius = radius;

		// By giving circles a length and height, we don't need to
		// compute the circle's full diameter multiple times over.
		this.length = this.radius * 2;
		this.height = this.radius * 2;
	}

	draw() {
		ctx.fillStyle = this.colour
		ctx.beginPath();
		// By offsetting this.x and this.y by this.radius,
		// we are able to normalize circles with squares elsewhere.
		// EXAMPLE: wall-collision functionality needs to
		// know the edges, and is based of x, y, length, and height.
		//               ↓ ↓ ↓ ↓ ↓ ↓           ↓ ↓ ↓ ↓ ↓ ↓
		ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
}

-< SEQUENTIAL STYLE >-
// Ball Variables
let ballRadius = 128;
let x = (canvas.width - MarginSide * 2 - ballRadius * 2) * Math.random() + MarginSide + ballRadius;
let y = (canvas.height / 3) * Math.random() + canvas.height / 2;
let dx = 2;
let dy = -2;
const max_dx = 24;
const max_dy = 24;

const getRandomColor = () => {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

const rainbowMode = (color) => {
	if (color > 360) {
		color = color - 360
	}
	return `hsl(${color}, 100%, 50%)`
}

const drawBall = () => {
	// left edge of paddle, 0, left of paddle + width of paddle, 0
	let clr = ctx.createLinearGradient(x, y, x + ballRadius, y + ballRadius);
	clr.addColorStop(0, rainbowMode(ballColor)); // Places a color at the start
	clr.addColorStop(1, rainbowMode(ballColor + 30)); // Places a color at the end
	ballColor += 2

	// Fill with gradient
	ctx.fillStyle = clr;

	// Create gradient
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}
***/
