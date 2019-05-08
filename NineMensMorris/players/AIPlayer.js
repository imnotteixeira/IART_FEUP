const Player = require('./Player.js');


class AIPlayer extends Player {

    chooseNextMove(moves) {}
    
    getNextMove(state){
        let moves = state.getValidMoves();
        return this.chooseNextMove(moves);
    }    
}

module.exports = AIPlayer;