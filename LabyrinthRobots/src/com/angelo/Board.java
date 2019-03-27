package com.angelo;

import java.util.*;

class State {

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
}

public class Board {

    static final int MAX_DEPTH = 32;
    static final int BOARD_SIZE = 16;
    static final int MAX_POS = BOARD_SIZE*BOARD_SIZE - 1;

    static final int[] directions = {-16, 1, 16, -1};

    public byte[] walls;
    public int[] targets;

    private State initialState;

    public Board(byte[] walls, int[] targets, int[] robots) {
        this.walls = walls;
        this.targets = targets;
        this.initialState = new State(robots, 0);
    }

    //TODO [DISCUSS] should elapsed time be calculated inside solve for each method?
    public void solve() {

        long start = System.nanoTime();

        ArrayList<State> iddfsSolution = iterativeDFS();
        long elapsed = (System.nanoTime() - start) / 1000000;

        printSolution(iddfsSolution);
        System.out.println("Elapsed Time: " + elapsed + " ms");
    }

    private void printSolution(ArrayList<State> states) {
        for (int i = states.size() - 1; i >= 0 ; i--) {
            int[] robots = states.get(i).robots;
            for (int j = 0; j < robots.length; j++) {
                System.out.println("  ::  [Robot " + j + "] Position: " + robots[j]+ "  ::  ");
            }
            System.out.println("\n------\n");
        }
        System.out.println("Found solution with " + (states.size() - 1) + " moves");
    }

    public ArrayList<State> iterativeDFS() {

        int initialDepth = 2; // TODO make this a static class attribute?

        for (int i = initialDepth; i <= MAX_DEPTH; i++) {
            try {
                return iddfs(i);
            } catch(Exception e) {
                continue;
            }
        }

        return new ArrayList<>();

    }

    private boolean isSolution(State state) {

        for (int i = 0; i < this.targets.length; i++) {
            if(this.targets[i] == -1) continue;
            if(state.robots[i] != this.targets[i]) {
                return false;
            }
        }

        return true;
    }

    private ArrayList<State> iddfs(int maxDepth) throws Exception{

        Stack<State> pendingStates = new Stack<>();
        HashMap<State, Integer> visitedStatesToMoves = new HashMap<>();
        pendingStates.push(initialState);


        ArrayList<State> childrenStates;
        while(!pendingStates.empty()) {

            State currState = pendingStates.pop();

            if(currState.currentMoveCount > maxDepth || (visitedStatesToMoves.containsKey(currState) && currState.currentMoveCount >= visitedStatesToMoves.get(currState))) {
                continue;
            }

            if(isSolution(currState)) {
                return getSolutionTrace(currState);
            }

            childrenStates = getChildrenStates(currState);

            for (State children: childrenStates) {
                pendingStates.push(children);
            }

            visitedStatesToMoves.put(currState, currState.currentMoveCount);

        }

        throw new Exception("No Solution Found");
    }

    private ArrayList<State> getSolutionTrace(State solutionState) {

        ArrayList<State> solution = new ArrayList<State>();
        State currState = solutionState;

        do {
            solution.add(currState);
            currState = currState.parentState;

        } while(currState.parentState != null);

        solution.add(currState);

        return solution;
    }

    private ArrayList<State> getChildrenStates(State currState) {

        ArrayList<State> retStates = new ArrayList<State>();


        for(int i = 0; i < currState.robots.length; i++) {
            int robotPos = currState.robots[i];
            for (int dir : directions ) {
                int newPos = robotPos;
                while(canMoveInDirection(currState, newPos, dir)){
                    newPos += dir;
                }

                if(newPos == robotPos) {
                    continue;
                }

                retStates.add(State.fromRobotMove(currState, i, newPos));

            }
        }

        return retStates;
    }

    private boolean canMoveInDirection(State currState, int pos, int dir) {
        int newPos = pos + dir;

        //check if new position is within board position range
        if(newPos < 0 || newPos > MAX_POS) {
            return false;
        }

        //check if no wall is in new position
        if(this.walls[newPos] > 0) {
            return false;
        }

        // check if by going left the x increases
        // or if by going right the x decreases
        // (edge overflow)
        int posX = pos % BOARD_SIZE;
        int newPosX = newPos % BOARD_SIZE;
        if(dir < 0 && newPosX > posX
                || dir > 0 && newPosX < posX){
            return false;
        }

        //check if there is a robot in the new position
        for (int robotPos : currState.robots) {
            if(robotPos == newPos) {
                return false;
            }
        }

        return true;

    }

}
