class Player {
    
    constructor(id){
        this.id = id;
    }

    async play(state) {
        console.log("Player function not defined");
        return state;
    }

    isValidMove(idx1, idx2){
        switch((idx2 - idx1 + 24) % 24){
            case 23:
                return idx2 % 3 !== 0 && Math.floor(idx1/3)%2 === 0 ? true : false;
            case 1:
                return idx1 % 3 !== 0 && Math.floor(idx1/3)%2 === 0 ? true : false;
            case 21:
            case 3:
                return true;
            default:
                return false;
        }
    }
}

module.exports = Player;