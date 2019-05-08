const PLAYER_TYPES = require('./State.js').PLAYER_TYPES;
const HumanPlayer = require('./HumanPlayer.js');
const AIPlayer = require('./AIPlayer.js');
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

    

}

module.exports = Game