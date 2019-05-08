const Player = require('./Player.js');


class MinimaxAIPlayer extends AIPlayer {

    constructor(depth){
        this.depth = depth;
    }

    chooseNextMove(moves, depth) {
        if (depth === 0)
            return;
        
        chooseNextMove()    

    }

    minimax(state, depth, maximizing_player) {
        if (depth == 0 || state.isGameOver()) {// or game over in position
            return this.evaluateState(state);//static evaluation of position 
        }
        const valid_moves = state.getValidMoves();

        if(maximizingPlayer) {
            let max_eval = -Infinity;

            valid_moves.forEach(child_state => {
                eval = minimax(child_state, depth - 1, false);
                max_eval = max(max_eval, eval);
            });                
            
            return max_eval;
        } else {
            let min_eval = Infinity;
            valid_moves.forEach(child_state => {
                eval = minimax(child, depth - 1, true)
                min_eval = min(min_eval, eval)
            });
            return min_eval;
        }
    }
      
    evaluateState(state){
        if (state.player0Won())
            return Infinity;
        else if (state.player1Won())
            return -Infinity;
        else return state.n_pieces_in_board[0]-state.n_pieces_in_board[1];
    }
    
    getNextMove(state){
        let moves = state.getValidMoves();
        return this.chooseNextMove(moves);
    }    
}

module.exports = AIPlayer;