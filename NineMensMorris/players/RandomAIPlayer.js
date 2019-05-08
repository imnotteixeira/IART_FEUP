const Player = require('./Player.js');


class RandomAIPlayer extends AIPlayer {

    chooseNextMove(moves){
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
}

module.exports = AIPlayer;