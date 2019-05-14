const AIPlayer = require('./AIPlayer.js');


class MinimaxAIPlayer extends AIPlayer {

    constructor(id, depth){
        super(id);
        this.depth = depth;
    }

    chooseNextMove(moves) {
        let best_value = this.id === 0 ? -Infinity : Infinity;
        let best_move;
        for(let move of moves){
            const val = this.minimax(move, this.depth - 1, this.id === 0);
            /*move.printBoard();
            //console.log("val = ", val);
            console.log(move.getMillsOfPlayer(0), move.getMillsOfPlayer(1))
            var sleep = require('system-sleep');
            sleep(2*1000); // sleep for 10 seconds*/

            if(this.id === 0){
                if(val > best_value){
                    best_value = val;
                    best_move = move;
                }
            } else {
                if(val < best_value){
                    best_value = val;
                    best_move = move;
                }
            }
        }

        //console.log(best_move.n_pieces_in_board[0], best_move.n_pieces_in_board[1], best_move.getMillsOfPlayer(0), best_move.getMillsOfPlayer(1));
        //console.log("ID: ", this.id, " - VAL: ", best_value);

        return best_move;
    }

    minimax(state, depth, maximizing_player) {
        if (depth === 0 || state.isGameOver()) {// or game over in position
            return (depth + 1) * this.evaluateState(state);
            
        }
        const valid_moves = state.getValidMoves(maximizing_player ? 0:1);

        if(maximizing_player) {
            let max_val = -Infinity;
            valid_moves.forEach(child_state => {
                const val = this.minimax(child_state, depth - 1, false);
                max_val = Math.max(max_val, val);
            });                
            return max_val;
        } else {
            let min_val = Infinity;
            valid_moves.forEach(child_state => {
                const val = this.minimax(child_state, depth - 1, true)
                min_val = Math.min(min_val, val);
            });
            return min_val;
        }
    }
      
    evaluateState(state){
        if (state.playerLost(1))
            return Infinity;
        else if (state.playerLost(0))
            return -Infinity;
        else {
            /*console.log("ANALYSNG ---------------------------")
            state.printBoard();
            console.log(state.n_pieces_in_board[0], state.n_pieces_in_board[1], state.getMillsOfPlayer(0), state.getMillsOfPlayer(1));
            console.log(" -------------------------------------")*/
            return (state.n_pieces_in_board[0]-state.n_pieces_in_board[1]) + (state.getMillsOfPlayer(0) - state.getMillsOfPlayer(1)) * 0.1;
        }
    }
}

module.exports = MinimaxAIPlayer;