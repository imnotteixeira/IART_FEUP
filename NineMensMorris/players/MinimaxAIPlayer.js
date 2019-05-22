const AIPlayer = require('./AIPlayer.js');


class MinimaxAIPlayer extends AIPlayer {

    constructor(id, depth){
        super(id);
        this.depth = depth;
        this.minimaxCuts = 0;
    }

    chooseNextMove(moves) {

        console.log("number of moves first level: " + moves.length);

        let moveValues = moves.map((move) => ({move, value: this.minimax(move, this.depth - 1, -Infinity, Infinity, this.id !== 0)}));
 
        moveValues = moveValues.sort((a,b) => {
            if(a.value === b.value){
                return 0;
            }else if(a.value < b.value){
                return this.id === 0 ? 1 : -1;
            }else{
                return this.id === 0 ? -1 : 1;
            }
        });

        let best_value = moveValues[0].value;
        let chosen_move = moveValues[Math.floor(Math.random()*moveValues.length)].move;
        for(let i in moveValues){
            if(moveValues[i].value === best_value) continue;
                
            chosen_move = moveValues[Math.floor(Math.random()*i)].move;
            console.log("Best values:" + i);
            break;
        }

        console.log("Minimax refused states: " + this.minimaxCuts);

        //console.log(best_move.n_pieces_in_board[0], best_move.n_pieces_in_board[1], best_move.getMillsOfPlayer(0), best_move.getMillsOfPlayer(1));
        //console.log("ID: ", this.id, " - VAL: ", best_value);
        return chosen_move;
    }

    minimax(state, depth, alpha, beta, maximizing_player) {
        

        if (depth === 0 || state.isGameOver()) {// or game over in position
            return (depth + 1) * this.evaluateState(state);
            
        }
        
        let valid_moves = state.getValidMoves(maximizing_player ? 0 : 1)
                                
        if(depth > 1){
            valid_moves = valid_moves.map((move) => ({move, value: this.evaluateState(move)}))
            .sort((a,b) => a.value < b.value ? (maximizing_player ? 1 : -1) : (maximizing_player ? -1 : 1))
            .map(move => move.move);
        }

        if(maximizing_player) {
            let max_val = -Infinity;

            for (let i = 0; i < valid_moves.length; i++) {
                const val = this.minimax(valid_moves[i], depth - 1, alpha, beta, !maximizing_player);
                max_val = Math.max(max_val, val);
                alpha = Math.max(alpha, val)
                if (beta <= alpha) {
                    this.minimaxCuts++;
                    break;
                }
            }                
            return max_val;
        } else {
            let min_val = Infinity;
            for (let i = 0; i < valid_moves.length; i++) {
                const val = this.minimax(valid_moves[i], depth - 1, alpha, beta, !maximizing_player);
                min_val = Math.min(min_val, val);
                beta = Math.min(beta, val)
                if (beta <= alpha) {
                    this.minimaxCuts++;
                    break;
                }
            }
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
            return (state.n_pieces_in_board[0]-state.n_pieces_in_board[1]) * 0.2 + (state.getMillsOfPlayer(0) - state.getMillsOfPlayer(1)) * 0.8;
        }
    }
}

module.exports = MinimaxAIPlayer;