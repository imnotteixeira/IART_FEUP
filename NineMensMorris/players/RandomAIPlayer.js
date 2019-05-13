const AIPlayer = require('./AIPlayer.js');


class RandomAIPlayer extends AIPlayer {

    chooseNextMove(moves){
        return moves[Math.floor(Math.random() * moves.length)];
    }

    async play(state){
        return this.getNextMove(state);
    }
    
}

module.exports = RandomAIPlayer;