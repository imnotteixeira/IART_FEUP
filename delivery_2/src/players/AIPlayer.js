const Player = require('./Player.js');
const CSVExport = require('../Exporter.js').CSVExport;


class AIPlayer extends Player {

    chooseNextMove(moves) {}

    getNextMove(state){
        let hrstart = process.hrtime();
        let moves = state.getValidMoves(this.id);
        let result = this.chooseNextMove(moves);
        if(this.exportData) CSVExport(", " + (process.hrtime(hrstart)[1] / 1000000) + ", " + state.getAction(this.id));
        return result;
    }    

    async play(state){
        return this.getNextMove(state);
    }
}

module.exports = AIPlayer;