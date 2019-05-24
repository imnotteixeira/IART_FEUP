const Player = require('./Player.js');
const CELL_STATES = require('../State.js').CELL_STATES;
const ACTIONS = require('../State.js').ACTIONS;
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
        switch(state.getAction(this.id)){
            case ACTIONS.PLACING:
                return await this.playPlacing(state);
            case ACTIONS.MOVING:
                return await this.playMoving(state);
            case ACTIONS.FLYING:
                return await this.playFlying(state);
        }
    }

    async playPlacing(state){
        console.log("PLACING");
        let coordinates;
        while(true){

            coordinates = await this.getInputCoordinates();

            if(this.isValidCoordinateInput(coordinates)){
                try{
                    state = this.addPiece(state, coordinates);
                    break;
                } catch(e) {}
            }
            
            console.log("Not a valid move! Try again");
        }
        return await this.checkFormedMillAndRemoveOpponent(state, COORDINATES_READABLE[coordinates]);
    }

    async playMoving(state){

        console.log("MOVING");
        const index = await this.getInputPieceOwn(state);
        let destIndex;

        while(true){

            const coordinates = await this.getInputCoordinates();

            if(this.isValidCoordinateInput(coordinates)){
                try{
                    destIndex = COORDINATES_READABLE[coordinates];
                    state = this.move(state, index, destIndex);
                    break;
                } catch(e) {}
            }
            
            console.log("Not a valid move! try again");
        }
        return this.checkFormedMillAndRemoveOpponent(state, destIndex);
    }

    async playFlying(state){

        console.log("FLYING");
        const index = await this.getInputPieceOwn(state);
        let destIndex;

        while(true){

            const coordinates = await this.getInputCoordinates();

            if(this.isValidCoordinateInput(coordinates)){
                try{
                    destIndex = COORDINATES_READABLE[coordinates];
                    state = this.fly(state, index, destIndex);
                    break;
                } catch(e) {}
            }
            
            console.log("Not a valid move! try again");
        }
        return this.checkFormedMillAndRemoveOpponent(state, destIndex);
    }

    move(state, idx1, idx2){
        if(state.colinearPositions(idx1, idx2) && state.board[idx2] === CELL_STATES.EMPTY){
            return state.addPiece(this.id, idx2).removePiece(idx1);
        }
        throw "Invalid move";
    }

    fly(state, idx1, idx2){
        if(state.board[idx2] === CELL_STATES.EMPTY){
            return state.addPiece(this.id, idx2).removePiece(idx1);
        }
        throw "Invalid move";
    }

    addPiece(state, coordinates){
        const board_index = COORDINATES_READABLE[coordinates];

        if(state.board[board_index] === CELL_STATES.EMPTY){
            return state.addPiece(this.id, board_index);
        }
        throw "Cell not empty";
    }

    getInputCoordinates(){
        return new Promise( (resolve) => {
            readline.question(`Please insert the coordinates for your move (e.g. a7): `, coordinates => {
                return resolve(coordinates);
            });
        })
    }

    async getInputPieceOwn(state){
        while(true){
            const coordinates = await new Promise( (resolve) => {
                readline.question(`Please select a piece (e.g. a7): `, coordinates => {
                    return resolve(coordinates);
                });
            })
            const board_index = COORDINATES_READABLE[coordinates];
            if(state.board[board_index] === this.id){
                return board_index;
            }
            console.log("Those coordinates do not correpond to one of your pieces");
        }
    }

    isValidCoordinateInput(input) {
        return Object.keys(COORDINATES_READABLE).includes(input);
    }

    async checkFormedMillAndRemoveOpponent(state, index){
        if(state.checkMills(index)){
            state.printBoard();
            while(true){
                const coordinates = await new Promise( (resolve) => {
                    readline.question(`A mill was formed. Please select an opponent's piece to remove (e.g. a7): `, coordinates => {
                        return resolve(coordinates);
                    });
                })
                const board_index = COORDINATES_READABLE[coordinates];
                if(state.board[board_index] === (this.id + 1) % 2){
                    return state.removePiece(board_index);
                }
                console.log("The selected node is not valid");
            }
        }
        return state;
    }
}

module.exports = HumanPlayer;