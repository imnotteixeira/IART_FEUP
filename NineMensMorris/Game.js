const PLAYER_TYPES = require('./State.js').PLAYER_TYPES;
const CELL_VIEWS = require('./State.js').CELL_VIEWS;
const HumanPlayer = require('./players/HumanPlayer.js');
const AIPlayer = require('./players/AIPlayer.js');
const State = require('./State.js').State;

class Game {

    constructor(player1_type, player2_type, first_player){
        this.players = [this.createPlayer(player1_type, 0), this.createPlayer(player2_type, 1)];
        
        this.state = new State(first_player);

        //bindings
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.getActivePlayer = this.getActivePlayer.bind(this);
        this.switchPlayer = this.switchPlayer.bind(this);
    }

    async run(){
        while(!this.isGameOver()){
            await this.update();
            console.log(this.state);
            this.printBoard();
        }
    }

    isGameOver(){
        return false;
    }
   
    createPlayer(playerType, id) {
        switch(playerType){
            case PLAYER_TYPES.AI:
                return new AIPlayer(id);
            case PLAYER_TYPES.HUMAN:
                return new HumanPlayer(id);    
        }
    }

    async update(){
        this.state = await this.getActivePlayer().play(this.state);
        this.state.n_turns[this.state.active_player]++;
        this.switchPlayer();
    }

    getActivePlayer(){
        return this.players[this.state.active_player];
    }

    switchPlayer(){
        this.state.active_player = (this.state.active_player + 1) % 2;
    }

    printBoard(){
        const b = this.state.board;

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

module.exports = Game