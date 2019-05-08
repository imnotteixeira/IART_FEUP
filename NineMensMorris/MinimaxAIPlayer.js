const Player = require('./AIPlayer.js');


class MinimaxAIPlayer extends AIPlayer {

    constructor(depth){
        this.depth = depth;
    }

    chooseNextMove(moves) {}
    
    getNextMove(state){
        let moves = this.getValidMoves(state);
        return this.chooseNextMove(moves);
    }    
}

module.exports = AIPlayer;