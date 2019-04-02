package com.reeckset.labyrinthrobots;

import java.util.Comparator;

public class StateComparatorNonAdmissibleStrict implements Comparator<State> {

    private Board board;

    public StateComparatorNonAdmissibleStrict(Board board){
        super();
        this.board = board;
    }

    @Override
    public int compare(State o1, State o2) {
        return getValue(o1).compareTo(getValue(o2));
    }

    private Integer getValue(State s){

        int total = 0;
        for(int i = 0; i < s.robots.length; i++) {
            total += this.board.minMovesPerTargetStrict[i][s.robots[i]];
        }

        return total + s.currentMoveCount;
    }
}
