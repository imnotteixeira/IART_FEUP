package com.angelo;

import java.util.*;

public class Board {

    static final int INITIAL_IDDFS_MAX_DEPTH = 2;
    static final int IDDFS_MAX_DEPTH = 32;
    static final int BOARD_SIZE = 16;
    static final int MAX_POS = BOARD_SIZE*BOARD_SIZE - 1;

    static final int[] directions = {-16, 1, 16, -1};
    static int[][] minMovesPerTarget;

    public byte[] walls;
    public int[] targets;

    private State initialState;

    public Board(byte[] walls, int[] targets, int[] robots) {
        this.walls = walls;
        this.targets = targets;
        this.initialState = new State(robots, 0);
        Board.minMovesPerTarget = getMinMovesPerTarget();
    }

    public void solve() {
        iterativeDFS();
    }

    private int[][] getMinMovesPerTarget(){

        int[][] result = new int[this.targets.length][BOARD_SIZE*BOARD_SIZE];

        for(int i = 0; i < this.targets.length; i++){
            if(this.targets[i] == -1){
                continue;
            }
            result[i] = generateMinimumMovesPerCellPerTarget(i);
        }

        return result;
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

    private boolean isSolution(State state) {

        for (int i = 0; i < this.targets.length; i++) {
            if(this.targets[i] == -1) continue;
            if(state.robots[i] != this.targets[i]) {
                return false;
            }
        }

        return true;
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

    public int[] generateMinimumMovesPerCellPerTarget(int targetIdx){

        int targetPos = this.targets[targetIdx];

        int[] minMoves = new int[BOARD_SIZE*BOARD_SIZE];

        Arrays.fill(minMoves, Integer.MAX_VALUE);

        minMoves[targetPos] = 0;

        Queue<Integer> pendingCells = new LinkedList<>();
        pendingCells.add(targetPos);

        State dummyState = new State(new int[0], 0);

        while(!pendingCells.isEmpty()){
            int currentCell = pendingCells.poll();

            for(int dir : directions){
                int analysingCell = currentCell;
                while(canMoveInDirection(dummyState, analysingCell, dir)){
                    if(minMoves[analysingCell] + 1 < minMoves[analysingCell + dir]) {
                        if(minMoves[analysingCell + dir] == Integer.MAX_VALUE){
                            pendingCells.add(analysingCell + dir);
                        }
                        minMoves[analysingCell + dir] = minMoves[currentCell] + 1;
                    }
                    analysingCell = analysingCell + dir;
                }
            }
        }

        return minMoves;
    }

    private boolean isValidRamification(State state, int nbrOfMovesLeft){
        for(int i = 0; i < state.robots.length; i++){
            if(minMovesPerTarget[i][state.robots[i]] >= nbrOfMovesLeft){
                return false;
            }
        }
        return true;
    }

    /***************************************************************/
    /***                          IDDFS                          ***/
    /***************************************************************/

    public ArrayList<State> iterativeDFS() {
        return iterativeDFS(false);
    }

    public ArrayList<State> iterativeDFS(boolean useCuts) {

        long start = System.nanoTime();
        for (int i = INITIAL_IDDFS_MAX_DEPTH; i <= IDDFS_MAX_DEPTH; i++) {
            try {
                ArrayList<State> iddfsSolution = iddfs(i, useCuts);
                long elapsed = (System.nanoTime() - start) / 1000000;

                printSolution(iddfsSolution);
                System.out.println("Elapsed Time: " + elapsed + " ms");
                return iddfsSolution;
            } catch(Exception e) {
                continue;
            }
        }

        return new ArrayList<>();

    }

    private ArrayList<State> iddfs(int maxDepth, boolean useCuts) throws Exception{

        Stack<State> pendingStates = new Stack<>();
        pendingStates.push(initialState);

        HashMap<State, Integer> visitedStatesToMoves = new HashMap<>();
        ArrayList<State> childrenStates;
        while(!pendingStates.empty()) {

            State currState = pendingStates.pop();

            if(useCuts && !isValidRamification(currState, maxDepth - currState.currentMoveCount)){
                continue;
            }

            if(currState.currentMoveCount > maxDepth || (visitedStatesToMoves.containsKey(currState) && currState.currentMoveCount >= visitedStatesToMoves.get(currState))) {
                continue;
            }

            if(isSolution(currState)) {
                return getSolutionTrace(currState);
            }

            childrenStates = getChildrenStates(currState);

            for (State child : childrenStates) {
                pendingStates.push(child);
            }

            visitedStatesToMoves.put(currState, currState.currentMoveCount);
        }

        throw new Exception("No Solution Found");
    }


    /********************************************************************/
    /***                         A STAR                               ***/
    /********************************************************************/


    public ArrayList<State> AStar(){

        Queue<State> pQueue = new PriorityQueue<State>();
        HashMap<State, Integer> visitedStatesToMoves = new HashMap<>();
        pQueue.add(this.initialState);

        while(!pQueue.isEmpty()){

            State currState = pQueue.poll();

            if(visitedStatesToMoves.containsKey(currState) && currState.currentMoveCount >= visitedStatesToMoves.get(currState)){
                continue;
            }

            if(isSolution(currState)) {
                return getSolutionTrace(currState);
            }

            ArrayList<State> childrenStates = getChildrenStates(currState);

            for (State child : childrenStates) {
                pQueue.add(child);
            }

            visitedStatesToMoves.put(currState, currState.currentMoveCount);
        }

        return new ArrayList<State>();
    }
}
