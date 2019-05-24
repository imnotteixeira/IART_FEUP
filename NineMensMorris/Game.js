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
        
        this.startTime = process.hrtime();

        this.state = new State(first_player);
        
        if(this.exportData) CSVExport(`
            \n\n------MATCH------
            \nPlayer Types:, ${player1_type.type}, ${player2_type.type}
            \nDepths:, ${player1_type.depth || '-'}, ${player2_type.depth || '-'}
            \nUsing pruning:, ${player1_type.type === PLAYER_TYPES.MINIMAX ? !player1_type.dont_prune : '-'}, ${player2_type.type === PLAYER_TYPES.MINIMAX ? !player2_type.dont_prune : '-'}
            \nHeuristic prioritizing mills:, ${player1_type.type === PLAYER_TYPES.MINIMAX ? !!player1_type.prioritize_mills : '-'}, ${player2_type.type === PLAYER_TYPES.MINIMAX ? !!player2_type.prioritize_mills : '-'}
            \nPlay, Expanded Nodes P1, Play Time (ms) P1, Play Action P1, Expanded Nodes P2, Play Time (ms) P2, Play Action P2
        `);

        //bindings
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.getActivePlayer = this.getActivePlayer.bind(this);
        this.switchPlayer = this.switchPlayer.bind(this);

    }

    async run(){
        let winner = 0;
        while(true){
            if(this.state.playerLost(0)){
                console.log("PLAYER 1 WON");
                winner = 1;
                break;
            }else if(this.state.playerLost(1)){
                console.log("PLAYER 0 WON");
                winner = 0;
                break;
            }else if(this.state.n_turns[1] > 50){
                winner = 0.5
                break;
            }else{
                if(this.state.active_player === 0 && this.exportData) CSVExport(`\n${this.state.n_turns[0]}`);
                await this.update();
                this.state.printBoard();
            }
        }
        if(this.exportData) CSVExport(`\n\nTotal Elapsed Time:, ${(process.hrtime(this.startTime)[1] / 1000000)}, Winner:, ${winner}`);
        return winner;
    }

    isGameOver(){
        return this.state.isGameOver();
    }
   
    createPlayer(playerType, id) {
        switch(playerType.type){
            case PLAYER_TYPES.RANDOM:
                return new RandomAIPlayer(id, this.exportData);
            case PLAYER_TYPES.MINIMAX:
                return new MinimaxAIPlayer(id, playerType.depth, playerType.dont_prune, playerType.prioritize_mills, this.exportData);
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