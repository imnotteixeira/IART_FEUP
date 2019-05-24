class Player {
    
    constructor(id, exportData){
        this.id = id;
        this.exportData = exportData;
    }

    async play(state) {
        console.log("Player function not defined");
        return state;
    }
}

module.exports = Player;