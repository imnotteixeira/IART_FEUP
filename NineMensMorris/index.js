const express = require('express');
require('dotenv').config()
const CSVSubmit = require('./Exporter.js').CSVSubmit;

const app = express();
const port = process.env.PORT || 8080;

const Game = require('./Game.js')
const PLAYER_TYPES = require('./State.js').PLAYER_TYPES

app.get('/', (req, res) => {

    const player1_type = {type: PLAYER_TYPES.MINIMAX};
    const player2_type = {type: PLAYER_TYPES.MINIMAX};
    const first_player = 0;

    const game = new Game(player1_type, player2_type, first_player);
    game.run();
    res.json(game);
});

app.get('/export', async (req, res) => {

    const PLAYER_RANDOM = {type: PLAYER_TYPES.RANDOM};
    const PLAYER_MINIMAX_1 = {type: PLAYER_TYPES.MINIMAX, depth: 1};
    const PLAYER_MINIMAX_2 = {type: PLAYER_TYPES.MINIMAX, depth: 2};
    const PLAYER_MINIMAX_3_NO_PRUNE = {type: PLAYER_TYPES.MINIMAX, depth: 3, dont_prune: true};
    const PLAYER_MINIMAX_3 = {type: PLAYER_TYPES.MINIMAX, depth: 3};
    const PLAYER_MINIMAX_3_EVAL_MILLS = {type: PLAYER_TYPES.MINIMAX, prioritize_mills: true, depth: 3};
    
    const matches = [
        [PLAYER_RANDOM, PLAYER_RANDOM],
        [PLAYER_MINIMAX_2, PLAYER_MINIMAX_2],
        [PLAYER_MINIMAX_3, PLAYER_MINIMAX_3],

        [PLAYER_RANDOM, PLAYER_MINIMAX_1],
        [PLAYER_RANDOM, PLAYER_MINIMAX_2],
        [PLAYER_RANDOM, PLAYER_MINIMAX_3],

        [PLAYER_MINIMAX_1, PLAYER_MINIMAX_2],
        [PLAYER_MINIMAX_1, PLAYER_MINIMAX_3],
        [PLAYER_MINIMAX_2, PLAYER_MINIMAX_3],

        [PLAYER_MINIMAX_3_NO_PRUNE, PLAYER_MINIMAX_3],

        [PLAYER_MINIMAX_3_EVAL_MILLS, PLAYER_MINIMAX_3],
    ]
    

    for(let match of matches){
        const game = new Game(match[0], match[1], 0, true);
        await game.run();
    }
    CSVSubmit();
    res.json(0);
});

app.listen(port, () => console.log(`Started Server on port ${port}!`))