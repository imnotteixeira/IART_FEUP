const Player = require('./AIPlayer.js');


class MinimaxAIPlayer extends AIPlayer {

    constructor(depth){
        this.depth = depth;
    }

    chooseNextMove(moves) {}
    
       
}

module.exports = AIPlayer;