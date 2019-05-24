const AIPlayer = require('./AIPlayer.js');
const CSVExport = require('../Exporter.js').CSVExport;


class RandomAIPlayer extends AIPlayer {

    chooseNextMove(moves){
        if(this.exportData) CSVExport(`, ${moves.length}`)
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
}

module.exports = RandomAIPlayer;