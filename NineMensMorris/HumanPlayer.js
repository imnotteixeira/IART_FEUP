const Player = require('./Player.js');
const CELL_STATES = require('./State.js').CELL_STATES;
const ACTIONS = require('./State.js').ACTIONS;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const COORDINATES_READABLE = Object.freeze({
    'a1': 17,
    'a4': 20,
    'a7': 23,
    'b2': 16,
    'b4': 19,
    'b6': 22,
    'c3': 15,
    'c4': 18,
    'c5': 21,
    'd1': 14,
    'd2': 13,
    'd3': 12,
    'd5': 0,
    'd6': 1,
    'd7': 2,
    'e3': 9,
    'e4': 6,
    'e5': 3,
    'f2': 10,
    'f4': 7,
    'f6': 4,
    'g1': 11,
    'g4': 8,
    'g7': 5,

})

class HumanPlayer extends Player {

    async play(state){
        switch(state.getAction()){
            case ACTIONS.PLACING:
                return await this.playPlacing(state);
            case ACTIONS.MOVING:
                return await this.playMoving(state);
            case ACTIONS.FLYING:
                return await this.playFlying(state);
        }
    }

    async playPlacing(state){

        while(true){

            const coordinates = await this.getInputCoordinates();

            if(this.isValidCoordinateInput(coordinates)){
                try{
                    return this.addPiece(state, coordinates);
                } catch(e) {
                    
                }
            }
            
            console.log("Not a valid move! try again");
        }
    }

    addPiece(state, coordinates){
        const board_index = COORDINATES_READABLE[coordinates];

        if(state.board[board_index] === CELL_STATES.EMPTY){
            return state.addPiece(this.id, board_index);
        }
        throw "Cell not empty";
    }

    getInputCoordinates(){
        return new Promise( (resolve, reject) => {
            readline.question(`Please insert the coordinates for your move (e.g. a7): `, coordinates => {
                return resolve(coordinates);
            });
        })
    }

    isValidCoordinateInput(input) {
        return Object.keys(COORDINATES_READABLE).includes(input);
    }
}

module.exports = HumanPlayer;