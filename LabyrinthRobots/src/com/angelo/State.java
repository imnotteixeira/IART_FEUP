package com.angelo;

import java.util.Arrays;

class State implements Comparable<State>{

    public int[] robots;

    public int currentMoveCount;
    public State parentState = null;

    private Board board;

    public State(int[] robots, int currentMoveCount) {
        this.robots = robots;
        this.currentMoveCount = currentMoveCount;
    }

    public State(int[] robots, int currentMoveCount, Board board) {
        this(robots, currentMoveCount);
        this.board = board;
    }

    public State(State parent, int[] robots, int currentMoveCount) {
        this(robots, currentMoveCount);
        this.parentState = parent;
        this.board = parent.board;
    }

    public static State fromRobotMove(State old, int idx, int pos) {
        int[] newRobots = old.robots.clone();
        newRobots[idx] = pos;
        return new State(old, newRobots, old.currentMoveCount+1);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        State state = (State) o;
        return Arrays.equals(robots, state.robots);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(robots);
    }

    @Override
    public int compareTo(State o) {
        return this.getValue().compareTo(o.getValue());
    }

    private Integer getValue(){

        int total = 0;
        for(int i = 0; i < robots.length; i++) {
            total += this.board.minMovesPerTarget[i][robots[i]];
        }

        return total + this.currentMoveCount;
    }
}