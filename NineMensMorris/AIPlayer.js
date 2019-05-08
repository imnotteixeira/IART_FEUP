const Player = require('./Player.js');


class AIPlayer extends Player {

    constructor(AILevel){
        super();
        this.AILevel = AILevel;        
    }

    //random
    //número de níveis

    getValidMoves(state){
        let moves = []

        return moves;

    }


    getNextMove(){
        let moves = getValidMoves();
        move_idx = Math.floor(Math.random() * moves.length);
        return moves[move_idx];
    }

    playPlacing(state){
        let coordinates = Math.floor(Math.random() * 24);
    }
    
}

module.exports = AIPlayer;