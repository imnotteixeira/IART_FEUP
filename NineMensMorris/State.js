const PLAYER_TYPES = Object.freeze({ 
    RANDOM:"RANDOM",
    MINIMAX:"MINIMAX",
    HUMAN: "HUMAN"
});

const ACTIONS = Object.freeze({ 
    MOVING:"MOVING",
    FLYING: "FLYING",
    PLACING: "PLACING"
});

const CELL_STATES = Object.freeze({ 
    EMPTY: -1,
    PLAYER1: 0,
    PLAYER2: 1
});

const CELL_VIEWS = Object.freeze({
    "-1": "◯",
    "0": "⚪",
    "1": "⚫"
    
})

const BOARD_SIZE = 24;
const MAX_PIECES_THRESHOLD = 9;
const MIN_PIECES_THRESHOLD = 3;
const DIRECTIONS = [-1, 1, -3, 3];

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
        this.printBoard = this.printBoard.bind(this);
        this.playerLost = this.playerLost.bind(this);
        this.isGameOver = this.isGameOver.bind(this);
        
    }

    isGameOver(){
        return this.playerLost(0) || this.playerLost(1);
    }

    playerLost(player_id){
        return (this.n_pieces_in_board[player_id] < 3 && this.getAction() !== ACTIONS.PLACING) 
        || this.getValidMoves(player_id).length === 0;
    }

    getValidMoves(player){
        let states = [];
        switch(this.getAction()){
            case ACTIONS.PLACING:
                states = this.getValidPlacings(player);
                break;
            case ACTIONS.MOVING:
                states = this.getValidMovings(player);
                break;
            case ACTIONS.FLYING:
                states = this.getValidFlyings(player);
                break;
        }

        return states;
    }

    getValidMovings(player){
        let states = [];
        for(let i = 0; i < this.board.length; i++){
            if (this.board[i] === player){
                DIRECTIONS.forEach(dir => {
                    let pos = (i+dir+24)%24;
                    if (this.board[pos] === CELL_STATES.EMPTY && this.colinearPositions(i, pos)){
                        let new_state = this.movePiece(player, i, pos);
                        states.push(...new_state.generateStatesFromFormedMills(pos, player));
                    }
                });
            }
        }
        return states;
    }

    getValidPlacings(player){
        let states = [];
        for(let i = 0; i < this.board.length; i++){
            if (this.board[i] === CELL_STATES.EMPTY ){
                states.push(this.addPiece(player, i));
            }
        }
        return states;
    }

    getValidFlyings(player){
        let states = [];
        for(let i = 0; i < this.board.length; i++){
            if (this.board[i] === player){
                for(let j = 0; j < this.board.length; j++){
                    if (this.board[j] === CELL_STATES.EMPTY){
                        states.push(this.movePiece(player, i, j));
                    } 
                }
            }
        }
        return states;
    }

    generateStatesFromFormedMills(pos, player){
        if(this.checkMills(pos)){
            return this.getValidRemovals(player);
        }
        return [this];
    }

    getValidRemovals(player){
        return this.board.reduce((states, currentNode, i) => 
            currentNode === (player + 1) % 2 ? 
                [...states, this.removePiece(i)]
            :
                states
        , []);
    }

    getAction() {
        if (this.n_turns[this.active_player] < MAX_PIECES_THRESHOLD)
            return ACTIONS.PLACING;
        else if (this.n_pieces_in_board[this.active_player] <= MIN_PIECES_THRESHOLD)
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
        let result = [];

        if(Math.floor(index/3) % 2 === 1){ //is in a corner
            result.push([
                index,
                this.normalizeIndex(index-3),
                this.normalizeIndex(index-6)
            ]);

            result.push([
                index,
                this.normalizeIndex(index+3),
                this.normalizeIndex(index+6)
            ]);
        }else{
            const firstIndex = Math.floor(index/3)*3
            result.push([
                this.normalizeIndex(firstIndex),
                this.normalizeIndex(firstIndex+1),
                this.normalizeIndex(firstIndex+2),
            ]);

            result.push([
                index,
                this.normalizeIndex(index-3),
                this.normalizeIndex(index+3)
            ]);
        }

        return result;
    }

    normalizeIndex(index){
        return (index + BOARD_SIZE) % BOARD_SIZE;
    }

    checkMills(board_idx){
        const lines = this.getMillsFromCell(board_idx);
        return this.checkMill(lines[0]) || this.checkMill(lines[1]);
    }

    checkMill(line) {
        return line.every(val => this.isPlayerCell(this.board[val]));
    }
    
    isPlayerCell(val){
        return val === this.active_player;
    }

    colinearPositions(idx1, idx2){
        switch((idx2 - idx1 + 24) % 24){
            case 23:
                return idx2 % 3 !== 0 && Math.floor(idx1/3)%2 === 0 ? true : false;
            case 1:
                return idx1 % 3 !== 0 && Math.floor(idx1/3)%2 === 0 ? true : false;
            case 21:
            case 3:
                return true;
            default:
                return false;
        }
    }

    printBoard(){
        const b = this.board;

        console.log("\n",
        `7   ${CELL_VIEWS[b[23]]} --------------------- ${CELL_VIEWS[b[2]]} --------------------- ${CELL_VIEWS[b[5]]}\n`,
        `    |                       |                       |\n`,
        `    |                       |                       |\n`,
        `6   |       ${CELL_VIEWS[b[22]]} ------------- ${CELL_VIEWS[b[1]]} ------------- ${CELL_VIEWS[b[4]]}       |\n`,
        `    |       |               |               |       |\n`,
        `    |       |               |               |       |\n`,
        `5   |       |       ${CELL_VIEWS[b[21]]} ----- ${CELL_VIEWS[b[0]]} ----- ${CELL_VIEWS[b[3]]}       |       |\n`,
        `    |       |       |               |       |       |\n`,
        `    |       |       |               |       |       |\n`,
        `4   ${CELL_VIEWS[b[20]]} ----- ${CELL_VIEWS[b[19]]} ----- ${CELL_VIEWS[b[18]]}               ${CELL_VIEWS[b[6]]} ----- ${CELL_VIEWS[b[7]]} ----- ${CELL_VIEWS[b[8]]}\n`,
        `    |       |       |               |       |       |\n`,
        `    |       |       |               |       |       |\n`,
        `3   |       |       ${CELL_VIEWS[b[15]]} ----- ${CELL_VIEWS[b[12]]} ----- ${CELL_VIEWS[b[9]]}       |       |\n`,
        `    |       |               |               |       |\n`,
        `    |       |               |               |       |\n`,
        `2   |       ${CELL_VIEWS[b[16]]} ------------- ${CELL_VIEWS[b[13]]} ------------- ${CELL_VIEWS[b[10]]}       |\n`,
        `    |                       |                       |\n`,
        `    |                       |                       |\n`,
        `1   ${CELL_VIEWS[b[17]]} --------------------- ${CELL_VIEWS[b[14]]} --------------------- ${CELL_VIEWS[b[11]]}\n`,
        `                                         \n`,
        `    A       B       C       D       E       F       G`);
    }
}

module.exports = {
    State, 
    PLAYER_TYPES,
    ACTIONS, 
    CELL_STATES
}