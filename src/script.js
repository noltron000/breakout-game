import Game from './classes/game.js'

// Obtain the canvas
const canvasElement = document.getElementById("myCanvas");

// Create a new game context.
const game = new Game(canvasElement)

/***

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
let brickColor = "";
let paddleColor = "";


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
