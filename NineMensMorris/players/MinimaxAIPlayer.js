const AIPlayer = require('./AIPlayer.js');
const CSVExport = require('../Exporter.js').CSVExport;

class MinimaxAIPlayer extends AIPlayer {

    constructor(id, depth, exportData){
        super(id, exportData);
        this.depth = depth;
        this.minimaxCuts = 0;
    }

    chooseNextMove(moves) {

        console.log("number of moves first level: " + moves.length);

        this.statesCount = moves.length;

        let moveValues = moves.map((move, i) => ({move, value: this.minimax(move, this.depth - 1, -Infinity, Infinity, this.id !== 0)}));
 
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
        let chosen_move = moveValues[0].move;
        for(let i in moveValues){
            if(moveValues[i].value !== best_value){
                chosen_move = moveValues[Math.floor(Math.random()*i)].move;
                console.log("Amount of best moves: " + i);
                break;
            }
        }

        console.log("cuts: ", this.minimaxCuts);
        this.minimaxCuts = 0;

        if(this.exportData) CSVExport(`, ${this.statesCount}`);

        console.log(moveValues[0].value);

        //console.log(best_move.n_pieces_in_board[0], best_move.n_pieces_in_board[1], best_move.getMillsOfPlayer(0), best_move.getMillsOfPlayer(1));
        //console.log("ID: ", this.id, " - VAL: ", best_value);
        return chosen_move;
    }

    minimax(state, depth, alpha, beta, maximizing_player) {

        this.statesCount++;

        if (depth === 0 || state.isGameOver()) {// or game over in position
            return (depth + 1) * this.evaluateState(state);
            
        }
        const valid_moves = state.getValidMoves(maximizing_player ? 0:1);

        if(maximizing_player) {
            let max_val = -Infinity;

            for (let i = 0; i < valid_moves.length; i++) {
                const child_state = valid_moves[i];

                const val = this.minimax(child_state, depth - 1, alpha, beta, false);
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
                const child_state = valid_moves[i];
                
                const val = this.minimax(child_state, depth - 1, alpha, beta, true)
                min_val = Math.min(min_val, val);
                beta = Math.min(beta, val)
                if (beta <= alpha) {
                    this.minimaxCuts++
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