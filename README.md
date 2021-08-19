# FEW-1-2_breakout
> ##### Created using this tutorial:
> https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

## Instructions
Use your Left and Right arrow keys to control the paddle.
If you prefer to use a mouse cursor, that option is available to you.

## Details
For Make School's Backend Web 1.2 course.

Objects in the game:
- Heads up display
- Game Board
- Bricks
- Ball
- Paddle

# Class Deconstruction
## Game Object
- <kbd>canvas</kbd>
	- <kbd>element</kbd>: References the HTML Canvas Element
	- <kbd>context</kbd>: References the 2D-JS Canvas Context
- <kbd>state</kbd>
	- <kbd>score</kbd>: Attain the highest score you can
	- <kbd>lives</kbd>: If this reaches zero, game over
- <kbd>Mobile Objects</kbd>: Visible entities that move and interact
- <kbd>Static Objects</kbd>: Visible entities that are overlay-only
- <kbd>Fields of Effects</kbd>: Invisible areas that trigger mobile objects

### Mobile Objects
- <kbd>Ball</kbd>: This thing bounces around and destroys bricks on hit.
- <kbd>Brick</kbd>: This thing gives you points when its destroyed.
- <kbd>Paddle</kbd>: This thing bounces the ball.

### Static Objects
- <kbd>HUD</kbd>
- <kbd>Pause Overlay</kbd>

### Fields of Effects
- <kbd>Generic Wall Field</kbd>: Stops objects from passing + bounces
- <kbd>Bottom Wall Field</kbd>: As above, but also destroys balls on hit.
