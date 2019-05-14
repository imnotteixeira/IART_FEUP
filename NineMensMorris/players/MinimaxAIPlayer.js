const AIPlayer = require('./AIPlayer.js');


class MinimaxAIPlayer extends AIPlayer {

    constructor(id, depth){
        super(id);
        this.depth = depth;
    }

    async play(state){
        return this.minimax(state, this.depth, this.id === 0);
    }

    minimax(state, depth, maximizing_player) {
        if (depth == 0 || state.isGameOver()) {// or game over in position
            return state;//static evaluation of position 
        }
        const valid_moves = state.getValidMoves(this.id);

        if(maximizing_player) {
            let max_val = -Infinity;

            valid_moves.forEach(child_state => {
                let generatedState = this.minimax(child_state, depth - 1, false);
                let val = this.evaluateState(generatedState);
                max_val = Math.max(max_val, val);
                if(val > max_val){
                    max_val = val;
                    state = generatedState;
                }
            });                
        } else {
            let min_val = Infinity;
            valid_moves.forEach(child_state => {
                let generatedState = this.minimax(child_state, depth - 1, true)
                let val = this.evaluateState(generatedState);
                if(val < min_val){
                    min_val = val;
                    state = generatedState;
                }
            });
        }

        return state;
    }
      
    evaluateState(state){
        if (state.playerLost(1))
            return Infinity;
        else if (state.playerLost(0))
            return -Infinity;
        else return (state.n_pieces_in_board[0]-state.n_pieces_in_board[1]) + (state.getMillsOfPlayer(0) - state.getMillsOfPlayer(1));
    }
    
    getNextMove(state){
        let moves = state.getValidMoves();
        return this.chooseNextMove(moves);
    }    
}

module.exports = MinimaxAIPlayer;