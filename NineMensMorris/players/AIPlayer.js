const Player = require('./Player.js');


class AIPlayer extends Player {

    chooseNextMove(moves) {}

    getNextMove(state){
        let moves = state.getValidMoves(this.id);
        return this.chooseNextMove(moves);
    }    

    async play(state){
        return this.getNextMove(state);
    }
}

module.exports = AIPlayer;