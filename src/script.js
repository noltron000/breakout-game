import Game from './classes/game.js'

// Obtain the canvas
const canvasElement = document.getElementById("myCanvas");

// Create a new game context.
const game = new Game(canvasElement)

/***
// Canvas Variables™€
let MarginTop = 80;
let MarginSide = 80;

// Ball Variables
let ballRadius = 128;
let x = (canvas.width - MarginSide * 2 - ballRadius * 2) * Math.random() + MarginSide + ballRadius;
let y = (canvas.height / 3) * Math.random() + canvas.height / 2;
let dx = 2;
let dy = -2;
const max_dx = 24;
const max_dy = 24;

// Paddle Variables
const paddleHeight = 15;
let paddleWidth = 288;
const min_pWidth = paddleWidth / 24
const paddleRaise = paddleHeight / 2;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Brick Variables
const brickRowCount = 16;
const brickColCount = 12;
const brickPadding = 3;
const brickHeight = (canvas.height / 3 - MarginTop) / (brickRowCount);
const brickWidth = (canvas.width - MarginSide * 2 - (brickPadding * (brickRowCount - 1) / brickColCount)) / brickColCount;

let bricks = [];
for (let c = 0; c < brickColCount; c++) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: true };
	}
}

// Defining UI Variables
let score = 0;
let lives = 9;
let game_on = true;

// Defining COLOR Variables
let ballColor = 200;
let brickColor = "";
let paddleColor = "";

// Adding Event Handlers
const keyDownHandler = (e) => {
	if (e.keyCode == 39) {
		rightPressed = true;
	}
	else if (e.keyCode == 37) {
		leftPressed = true;
	}
}

const keyUpHandler = (e) => {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

const mouseMoveHandler = (e) => {
	let relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


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

const collisionDetection = () => {
	for (let c = 0; c < brickColCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status == true) {
				if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
					// If ball is within range of Brick
					if (x > b.x && x < b.x + brickWidth) {
						// If ball is specifically within horizontal range of block
						dy = -dy;
					} else if (y > b.y && y < b.y + brickWidth) {
						// If ball is specifically within verticle range of block
						dx = -dx;
					}
					// Regardless, Continue on with function
					b.status = false;
					score++;
					dy = dy + ((max_dy - Math.abs(dy)) * Math.abs(dy) / (dy * max_dy ** 2))
					dx = dx + ((max_dx - Math.abs(dx)) * Math.abs(dx) / (dx * max_dx ** 2))
					ballRadius += 20 / ballRadius;
					console.log(dy)
					console.log(Math.abs(dy) - Math.abs(dx))
					paddleWidth = paddleWidth - ((min_pWidth - paddleWidth) / (min_pWidth ** 2))
					paddleX += paddleWidth * 1 / 128
					paddleWidth = paddleWidth * (95 / 96);
					if (score == brickRowCount * brickColCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
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

const drawPaddle = () => {
	// Fill with gradient
	ctx.fillStyle = 'grey';
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight - paddleRaise, paddleWidth, paddleHeight);
	ctx.fill();
	ctx.closePath();
}

const drawBricks = () => {
	ctx.fillStyle = 'gray'
	for (let c = 0; c < brickColCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == true) {
				let brickX = (c * (brickWidth + brickPadding * 2));
				let brickY = (r * (brickHeight + brickPadding * 2));
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				if ((r % 2) == 0) {
					brickX = (c * (brickWidth + brickPadding)) + MarginSide + brickWidth / 4;
					brickY = (r * (brickHeight + brickPadding)) + MarginTop;
				} else {
					brickX = (c * (brickWidth + brickPadding)) + MarginSide - brickWidth / 4;
					brickY = (r * (brickHeight + brickPadding)) + MarginTop;
				}
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

const drawScore = () => {
	ctx.fillStyle = 'gray'
	ctx.font = "16px Arial";
	ctx.fillText("Score: " + score, 8, 20);
}

const drawLives = () => {
	ctx.fillStyle = 'gray'
	ctx.font = "16px Arial";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

const draw = () => {
	drawBall();
	drawPaddle();
	drawBricks();
	drawScore();
	drawLives();
	collisionDetection();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		// If ball would touch the ceiling
		dy = -dy;
	} else if ((y + dy > canvas.height - ballRadius - paddleHeight - paddleRaise) && (y + dy < canvas.height - ballRadius - paddleRaise)) {
		// If ball would touch the paddle on floor
		if (x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
			// If ball is in horizontal range of the paddle
			dy = -Math.abs(dy);
		}
	} else if (y + dy > canvas.height - ballRadius) {
		// If ball would touch the floor
		lives--;
		if (!lives) {
			if (game_on) {
				game_on = false
				alert("GAME OVER"); // YOU LOSE
				document.location.reload();
			}
		}
		else {
			x = (canvas.width - MarginSide * 2 - ballRadius * 2) * Math.random() + MarginSide + ballRadius;
			y = (canvas.height / 3) * Math.random() + canvas.height / 2;
			dy = -Math.abs(dy);
		}
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}
	x += dx;
	y += dy;
	ballRadius /= 1 + 1 / 128;
}
***/

// Start infinitely drawing the canvas every frame.
game.draw()
