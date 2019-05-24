const express = require('express');
require('dotenv').config()
const CSVSubmit = require('./Exporter.js').CSVSubmit;
const CSVExport = require('./Exporter.js').CSVExport;
const MinimaxAIPlayer = require('./players/MinimaxAIPlayer.js');

const app = express();
const port = process.env.PORT || 8080;

const Game = require('./Game.js')
const PLAYER_TYPES = require('./State.js').PLAYER_TYPES

app.get('/', (req, res) => {

    const player1_type = {type: PLAYER_TYPES.MINIMAX, depth: 3};
    const player2_type = {type: PLAYER_TYPES.MINIMAX, depth: 3};
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

        [PLAYER_MINIMAX_3_EVAL_MILLS, PLAYER_MINIMAX_3]
    ]


    for(let match of matches){
        const game = new Game(match[0], match[1], 0, true);
        await game.run();
    }
    CSVSubmit("exported.csv");
    res.json(0);
});

app.get('/export-winners', async (req, res) => {

    const PLAYER_RANDOM = {type: PLAYER_TYPES.RANDOM};
    const PLAYER_MINIMAX_1 = {type: PLAYER_TYPES.MINIMAX, depth: 1, prioritize_mills: true};
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

        [PLAYER_MINIMAX_1, PLAYER_MINIMAX_3_EVAL_MILLS],
        [PLAYER_MINIMAX_1, PLAYER_MINIMAX_3],
        [PLAYER_MINIMAX_2, PLAYER_MINIMAX_3],

        [PLAYER_MINIMAX_3_NO_PRUNE, PLAYER_MINIMAX_3],

        [PLAYER_MINIMAX_3_EVAL_MILLS, PLAYER_MINIMAX_3]
    ]


    for(let match of matches){
        console.log("_--------------------------------------------------");
        console.log("_--------------------------------------------------");
        console.log("_--------------------------------------------------");
        console.log(match)
        console.log("_--------------------------------------------------");
        console.log("_--------------------------------------------------");
        console.log("_--------------------------------------------------");
        let winnerSum = 0;
        for(let i = 0; i < 10; i++){
            const game = new Game(match[0], match[1], 0, false);
            winnerSum += await game.run();
        }
        for(let i = 0; i < 10; i++){
            const game = new Game(match[1], match[0], 0, false);
            winnerSum += Math.abs(1 - await game.run());
        }
        const winningProbability = winnerSum / 20;
        CSVExport(`
        \n\n------MATCH------
        \nPlayer Types:, ${match[0].type}, ${match[1].type}
        \nDepths:, ${match[0].depth || '-'}, ${match[1].depth || '-'}
        \nUsing pruning:, ${match[0].type === PLAYER_TYPES.MINIMAX ? !match[0].dont_prune : '-'}, ${match[1].type === PLAYER_TYPES.MINIMAX ? !match[1].dont_prune : '-'}
        \nHeuristic prioritizing mills:, ${match[0].type === PLAYER_TYPES.MINIMAX ? !!match[0].prioritize_mills : '-'}, ${match[1].type === PLAYER_TYPES.MINIMAX ? !!match[1].prioritize_mills : '-'}
        \nP1 Winning Probability:, ${(1 - winningProbability)}
        \nP2 Winning Probability:, ${winningProbability}
        `);
    }
    CSVSubmit("exported-winners.csv");
    res.json(0);
});

app.listen(port, () => console.log(`Started Server on port ${port}!`))