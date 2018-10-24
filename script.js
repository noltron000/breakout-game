// JavaScript code goes here
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

// Ball Variables
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

// Paddle Variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleRaise = paddleHeight;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Brick Variables
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: true };
	}
}

// Defining UI Variables
let score = 0;
let lives = 3;
let game_on = true;

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

const collisionDetection = () => {
	for (let c = 0; c < brickColumnCount; c++) {
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
					dy = dy * 25 / 24;
					dx = dx * 25 / 24;
					ctx.fillStyle = getRandomColor();
					if (score == brickRowCount * brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
}

const drawBall = () => {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
}

const drawPaddle = () => {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight - paddleRaise, paddleWidth, paddleHeight);
	ctx.fill();
	ctx.closePath();
}

const drawBricks = () => {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == true) {
				let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
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
	ctx.font = "16px Arial";
	ctx.fillText("Score: " + score, 8, 20);
}
const drawLives = () => {
	ctx.font = "16px Arial";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

const getRandomColor = () => {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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
				alert("GAME OVER");
				document.location.reload();
			}
		}
		else {
			x = canvas.width / 2;
			y = canvas.height - 30;
			dy = -Math.abs(dy);
			paddleX = (canvas.width - paddleWidth) / 2;
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
	requestAnimationFrame(draw);
}

draw();