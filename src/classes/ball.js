import RectangleMOB from './rectangle-mob.js'

class Ball extends RectangleMOB {
	constructor (canvasContext, {coordinates, dimensions}) {
		super(canvasContext, {coordinates, dimensions, color: 'white'})
	}
}

export default Ball

/***
-< SEQUENTIAL STYLE >-
// Ball Variables
let ballRadius = 128;
let dx = 2;
let dy = -2;

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
