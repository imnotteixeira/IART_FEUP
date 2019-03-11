## General puzzle description

The Labyrinth Robot puzzle consists in finding the shortest possible path for one or more robots to their respective targets. The robots can move up, down, left or right and must go as far as possible in that direction before hitting an obstacle (wall or another robot). However, if the robot is directly adjacent to an obstacle it cannot go in that direction. When every target is beneath the respective robot, the game ends. By that point, the score of the game is determined by the amount of moves made to reach that state.


## State representation

The puzzle's state is made up of:
 - an N*N matrix, with each cell of the matrix being an object with a position (X, Y) and a type (Free cell, Wall or Target)
 - K robot objects, with a position (X, Y)
 - the number of movements made so far. 

## Initial State

The game's initial state contains the positions of the robots (each represented by unique (Xri, Yri) coordinates, with i relative to the robot's color), the positions of the targets (Xti, Yti) and the positions of the walls (Xw, Yw). Furthermore, it also includes the number of plays done until then, being 0 initially.

## Goal Testing

The goal is to have the robots on the respective target's position, if applicable. In other words, for each robot with existent target, (Xri, Yri) = (Xti, Yti).

## Operators

There are, at most, (4*nRobots) operators, being that a robot can move up, down, left or right (move_up, move_down, move_left, move_right). To move in one of those directions, there cannot be a wall or a robot adjacent to the robot in that direction.

When moving, the robot will slide in that direction, until it reaches a wall or another robot, which will block its movement.

Each operator has a cost of 1, so that the cost is the same as the amount of movements made.

## Solution Cost

The solution cost will be the total amount of movements made until the final state was reached.
