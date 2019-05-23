const PLAYER_TYPES = require('./State.js').PLAYER_TYPES;
const HumanPlayer = require('./players/HumanPlayer.js');
const RandomAIPlayer = require('./players/RandomAIPlayer.js');
const MinimaxAIPlayer = require('./players/MinimaxAIPlayer.js');
const State = require('./State.js').State;
const CSVExport = require('./Exporter.js').CSVExport;

class Game {

    constructor(player1_type, player2_type, first_player, exportData){
        this.exportData = !!exportData;

        this.players = [this.createPlayer(player1_type, 0), this.createPlayer(player2_type, 1)];
        
        this.state = new State(first_player);
        
        if(this.exportData) CSVExport(`
            \n\n------MATCH------
            \nPlayer Types:, ${player1_type.type}, ${player2_type.type}
            \nDepths:, ${player1_type.depth || '-'}, ${player2_type.depth || '-'}
            \n\nPlay, Expanded Nodes Player 1, Play Execution Time Player 1, Expanded Nodes Player 2, Play Execution Time Player 2
        `);

        //bindings
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.getActivePlayer = this.getActivePlayer.bind(this);
        this.switchPlayer = this.switchPlayer.bind(this);
    }

    async run(){

        while(true){
            if(this.state.playerLost(0)){
                console.log("PLAYER 1 WON");
                break;
            }else if(this.state.playerLost(1)){
                console.log("PLAYER 0 WON");
                break;
            }else{
                if(this.state.active_player === 0 && this.exportData) CSVExport(`\n${this.state.n_turns[0]}`);
                await this.update();
                this.state.printBoard();
            }
        }
    }

    isGameOver(){
        return this.state.isGameOver();
    }
   
    createPlayer(playerType, id) {
        switch(playerType.type){
            case PLAYER_TYPES.RANDOM:
                return new RandomAIPlayer(id, this.exportData);
            case PLAYER_TYPES.MINIMAX:
                return new MinimaxAIPlayer(id, playerType.depth, this.exportData);
            case PLAYER_TYPES.HUMAN:
                return new HumanPlayer(id);    
        }
    }

    async update(){
        console.log(" --- Player ", this.state.active_player, " ---");
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
}

module.exports = Game