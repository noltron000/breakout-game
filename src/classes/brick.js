import RectangleMOB from './rectangle-mob.js'

class Brick extends RectangleMOB {
	constructor (canvasContext, {coordinates, dimensions}) {
		super(canvasContext, {coordinates, dimensions, color: 'black'})
		this.health = 1
	}
}

export default Brick

/***
-< SEQUENTIAL STYLE >-
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
***/
