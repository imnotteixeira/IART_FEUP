const Player = require('./Player.js');


class AIPlayer extends Player {

    chooseNextMove(moves) {}

    getNextMove(state){
        
        let moves = state.getValidMoves(this.id);
        console.log("-------------   MOVES CRL   -------------");
        moves.forEach(element => {
            console.log(element.board);
        });
        console.log("-----------------------------------------");
        return this.chooseNextMove(moves);
    }    
}

module.exports = AIPlayer;