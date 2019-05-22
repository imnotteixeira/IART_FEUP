const PLAYER_TYPES = require('./State.js').PLAYER_TYPES;
const HumanPlayer = require('./players/HumanPlayer.js');
const RandomAIPlayer = require('./players/RandomAIPlayer.js');
const MinimaxAIPlayer = require('./players/MinimaxAIPlayer.js');
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
        var hrstart = process.hrtime();
        while(true){
            if(this.state.playerLost(0)){
                console.log("PLAYER 1 WON");
                break;
            }else if(this.state.playerLost(1)){
                console.log("PLAYER 0 WON");
                break;
            }else{
                await this.update();
                this.state.printBoard();
                console.log("NTurns: " + (this.state.n_turns[0] + this.state.n_turns[1]));
            }
        }
        console.log("Finished in " + process.hrtime(hrstart)[0] + " seconds");
    }

    isGameOver(){
        return this.state.isGameOver();
    }
   
    createPlayer(playerType, id) {
        switch(playerType){
            case PLAYER_TYPES.RANDOM:
                return new RandomAIPlayer(id);
            case PLAYER_TYPES.MINIMAX:
                return new MinimaxAIPlayer(id, 3);
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