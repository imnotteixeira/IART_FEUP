const express = require('express');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080;

const Game = require('./Game.js')
const PLAYER_TYPES = require('./State.js').PLAYER_TYPES

app.get('/', (req, res) => {

    const player1_type = PLAYER_TYPES.HUMAN;
    const player2_type = PLAYER_TYPES.AI;
    const first_player = 0;

    const game = new Game(player1_type, player2_type, first_player);
    game.run();
    res.json(game);
});

app.listen(port, () => console.log(`Started Server on port ${port}!`))