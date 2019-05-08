const PLAYER_TYPES = Object.freeze({ 
    AI:"AI",
    HUMAN: "HUMAN"
});

const ACTIONS = Object.freeze({ 
    MOVING:"MOVING",
    FLYING: "FLYING",
    PLACING: "PLACING"
});

const CELL_STATES = Object.freeze({ 
    EMPTY: "-",
    PLAYER1: 0,
    PLAYER2: 1
});

const BOARD_SIZE = 24;
const MAX_PIECES_THRESHOLD = 9;
const MIN_PIECES_THRESHOLD = 3;

class State {

    constructor(current_player){
        this.board = new Array(BOARD_SIZE).fill(CELL_STATES.EMPTY);
        this.active_player = current_player;
        this.n_turns = new Array(2).fill(0);
        this.n_pieces_in_board = new Array(2).fill(0);

        //Function this binding
        this.getAction = this.getAction.bind(this);
        this.clone = this.clone.bind(this);
        this.addPiece = this.addPiece.bind(this);
        this.removePiece = this.removePiece.bind(this);
        this.movePiece = this.movePiece.bind(this);
        this.isPlayerCell = this.isPlayerCell.bind(this);
        
    }

    player1won(){
        return this.n_pieces_in_board[0] < 3;
    }

    player2won(){
        return this.n_pieces_in_board[1] < 3;
    }

    getAction() {
        if (this.n_turns[this.active_player] < MAX_PIECES_THRESHOLD)
            return ACTIONS.PLACING;
        else if (this.n_pieces_in_board[this.active_player] < MIN_PIECES_THRESHOLD)
            return ACTIONS.FLYING;
        else return ACTIONS.MOVING;
    }

    clone() {
        const newState = new State(this.active_player);
        newState.board = [...this.board];
        newState.n_turns = [...this.n_turns];
        newState.n_pieces_in_board = [...this.n_pieces_in_board];
        return newState;
    }

    addPiece(player, board_idx) {
        const newState = this.clone();
        newState.board[board_idx] = player;
        newState.n_pieces_in_board[player]++;
        return newState;
    }

    removePiece(board_idx) {
        const newState = this.clone();
        newState.n_pieces_in_board[newState.board[board_idx]]--;
        newState.board[board_idx] = CELL_STATES.EMPTY;
        return newState;
    }

    movePiece(player, board_idx1, board_idx2) {
        return this.removePiece(board_idx1).addPiece(player, board_idx2);
    }

    getMillsFromCell(index) {
        result = [];

        if(Math.floor(i/3) % 2 === 1){ //is in a corner
            result.push[
                index,
                normalizeIndex(index-3),
                normalizeIndex(index-6)
            ];

            result.push[
                index,
                normalizeIndex(index+3),
                normalizeIndex(index+6)
            ];
        }else{
            const firstIndex = Math.floor(index/3)*3
            result.push([
                normalizeIndex(firstIndex),
                normalizeIndex(firstIndex+1),
                normalizeIndex(firstIndex+2),
            ]);

            result.push[
                index,
                normalizeIndex(index-3),
                normalizeIndex(index+3)
            ];
        }
    }

    normalizeIndex(index){
        return (index + BOARD_SIZE) % BOARD_SIZE;
    }

    checkMills(board_idx){
        lines = getMillsFromCell(board_id);
        return checkMill(lines[0]) || checkMill(lines[1]);
    }

    checkMill(line) {
        return line.every(val => isPlayerCell(val));
    }
    
    isPlayerCell(val){
        return val === this.active_player;
    }

    
}

module.exports = {
    State, 
    PLAYER_TYPES,
    ACTIONS, 
    CELL_STATES
}