package com.reeckset.labyrinthrobots;

import java.util.Arrays;

class State{

    public int[] robots;

    public int currentMoveCount;
    public State parentState = null;

    public State(int[] robots, int currentMoveCount) {
        this.robots = robots;
        this.currentMoveCount = currentMoveCount;
    }

    public State(State parent, int[] robots, int currentMoveCount) {
        this(robots, currentMoveCount);
        this.parentState = parent;
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

    public String toJSON(){
        String result = "[";
        for(int i = 0; i < this.robots.length; i++){
            result += this.robots[i];
            if(i < (this.robots.length - 1))
                result += ", ";
        }
        return result + "]";
    }
}