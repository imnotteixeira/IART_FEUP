package com.reeckset.labyrinthrobots;

import java.util.*;

public class Board {

    static final int INITIAL_IDDFS_MAX_DEPTH = 2;
    static final int IDDFS_MAX_DEPTH = 32;
    static final int BOARD_SIZE = 16;
    static final int MAX_POS = BOARD_SIZE*BOARD_SIZE - 1;

    private int maxSteps;

    static final int[] directions = {-16, 1, 16, -1};
    public int[][] minMovesPerTarget, minMovesPerTargetStrict;

    public byte[] walls;
    public int[] targets;

    private State initialState;

    public Board(byte[] walls, int[] targets, int[] robots) {
        this.walls = walls;
        this.targets = targets;
        this.initialState = new State(robots, 0);
        this.maxSteps = 0;

        this.minMovesPerTargetStrict = getMinMovesPerTarget_strict();
        this.minMovesPerTarget = getMinMovesPerTarget();

    }

    private int[][] getMinMovesPerTarget(){

        int[][] result = new int[this.targets.length][BOARD_SIZE*BOARD_SIZE];

        for(int i = 0; i < this.targets.length; i++){
            if(this.targets[i] == -1){
                continue;
            }
            result[i] = generateMinimumMovesPerCellPerTarget(i);
        }

        int[] minimumMovesHelpers = null;

        for(int i = 0; i < this.targets.length; i++){
            if(this.targets[i] == -1){
                if(minimumMovesHelpers == null){
                    minimumMovesHelpers = generateMinimumMovesPerCellForHelper(result);
                }
                result[i] = minimumMovesHelpers;
            }
        }

        return result;
    }

    private int[][] getMinMovesPerTarget_strict(){

        int[][] result = new int[this.targets.length][BOARD_SIZE*BOARD_SIZE];

        for(int i = 0; i < this.targets.length; i++){
            if(this.targets[i] == -1){
                continue;
            }
            result[i] = generateMinimumMovesPerCellPerTarget_strict(i);
        }

        int[] minimumMovesHelpers = null;

        for(int i = 0; i < this.targets.length; i++){
            if(this.targets[i] == -1){
                if(minimumMovesHelpers == null){
                    minimumMovesHelpers = generateMinimumMovesPerCellForHelper(result);
                }
                result[i] = minimumMovesHelpers;
            }
        }

        return result;
    }

    public static void printSolution(ArrayList<State> states) {

        System.out.println("Found solution with " + (states.size() - 1) + " moves");

        State prevState = states.get(states.size()-1);



        for (int i = states.size() - 2; i >= 0 ; i--) {
            int[] robots = states.get(i).robots;

            printRobotMovement(prevState, states.get(i));
            prevState = states.get(i);
        }
    }

    private static void printRobotMovement(State prev, State curr) {
        for (int i = 0; i < prev.robots.length; i++) {
            if(prev.robots[i] != curr.robots[i]) {
                String out = "Robot [" + i + "] moves from position " + getHumanReadablePosition(prev.robots[i])
                        + " to " + getHumanReadablePosition(curr.robots[i]);
                System.out.println(out);
                return;
            }
        }
    }

    private static String getHumanReadablePosition(int pos) {
        int x = pos % BOARD_SIZE;
        int y = pos / BOARD_SIZE;
        return "(" + x + ", " + y + ")";
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
                        if(minMoves[currentCell]+1 > this.maxSteps) {
                            this.maxSteps = minMoves[currentCell] + 1;
                        }
                    }
                    analysingCell = analysingCell + dir;
                }
            }
        }

        return minMoves;
    }

    public int[] generateMinimumMovesPerCellPerTarget_strict(int targetIdx){

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

                //only fill cells if the opposite direction allows stopping in current cell
                if(!canMoveInDirection(dummyState, analysingCell, -dir)) {
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
        }

        int[] nonStrictMinMoves = generateMinimumMovesPerCellPerTarget(targetIdx);

        for (int i = 0; i < minMoves.length; i++) {
            if(minMoves[i] == Integer.MAX_VALUE && nonStrictMinMoves[i] != Integer.MAX_VALUE) {
                minMoves[i] = nonStrictMinMoves[i] * this.maxSteps;
            }
        }

        return minMoves;
    }

    public int[] generateMinimumMovesPerCellForHelper(int[][] minMoves) {

        byte[] sumOfActiveRobotsMins = new byte[BOARD_SIZE*BOARD_SIZE];

        for(int i = 0; i < minMoves.length; i++){
            if(this.targets[i] == -1) continue;
            for(int j = 0; j < sumOfActiveRobotsMins.length; j++){
                if(minMoves[i][j] != Integer.MAX_VALUE) {
                    sumOfActiveRobotsMins[j] += minMoves[i][j];
                }
            }
        }

        int[] result = new int[BOARD_SIZE*BOARD_SIZE];
        State dummyState = new State(new int[0], 0);

        for(int i = 0; i < result.length; i++){

            if(sumOfActiveRobotsMins[i] == 0){
                result[i] = Integer.MAX_VALUE;
                continue;
            }

            int accountedDirections = 0;
            for(int dir : directions) {
                if (canMoveInDirection(dummyState, i, dir) && sumOfActiveRobotsMins[i+dir] != 0) {
                    result[i] += sumOfActiveRobotsMins[i+dir];
                    accountedDirections++;
                }
            }
            if(accountedDirections > 0) {
                result[i] /= accountedDirections;
            }
        }

        return result;
    }

    private boolean isValidRamification(State state, int nbrOfMovesLeft){
        for(int i = 0; i < state.robots.length; i++){
            if(minMovesPerTarget[i][state.robots[i]] >= nbrOfMovesLeft){
                return false;
            }
        }
        return true;
    }

    public String toJSON(){
        String result = "{\"walls\": [";
        for(int i = 0; i < this.walls.length; i++){
            result += this.walls[i];
            if(i < (this.walls.length - 1))
            result += ", ";
        }
        result += "], \"targets\": [";
        for(int i = 0; i < this.targets.length; i++){
            result += this.targets[i];
            if(i < (this.targets.length - 1))
                result += ", ";
        }
        result += "], \"robots\": [";
        for(int i = 0; i < this.initialState.robots.length; i++){
            result += this.initialState.robots[i];
            if(i < (this.initialState.robots.length - 1))
                result += ", ";
        }
        return result + "]}";
    }

    /***************************************************************/
    /***                          IDDFS                          ***/
    /***************************************************************/

    public AlgorithmSolution iterativeDFS() {
        return iterativeDFS(false);
    }

    public AlgorithmSolution iterativeDFS(boolean useCuts) {

        AlgorithmSolution result = new AlgorithmSolution();

        for (int i = INITIAL_IDDFS_MAX_DEPTH; i <= IDDFS_MAX_DEPTH; i++) {
            try {
                return result.setSolution(iddfs(i, useCuts));
            } catch(Exception e) {
                continue;
            }
        }

        return null;

    }

    private State iddfs(int maxDepth, boolean useCuts) throws Exception{

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
                return currState;
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

    public AlgorithmSolution AStar(){ return AStar(false); }

    public AlgorithmSolution AStar(boolean useStrict){

        AlgorithmSolution result = new AlgorithmSolution();

        Queue<State> pQueue;
        if(useStrict){
            pQueue = new PriorityQueue<State>(new StateComparatorStrict(this));
        }else{
            pQueue = new PriorityQueue<State>(new StateComparator(this));
        }
        HashMap<State, Integer> visitedStatesToMoves = new HashMap<>();
        pQueue.add(this.initialState);

        while(!pQueue.isEmpty()){

            State currState = pQueue.poll();

            if(visitedStatesToMoves.containsKey(currState) && currState.currentMoveCount >= visitedStatesToMoves.get(currState)){
                continue;
            }

            if(isSolution(currState)) {
                return result.setSolution(currState);
            }

            ArrayList<State> childrenStates = getChildrenStates(currState);

            for (State child : childrenStates) {
                pQueue.add(child);
            }

            visitedStatesToMoves.put(currState, currState.currentMoveCount);
        }

        return null;
    }


    /********************************************************************/
    /***                            DFS                               ***/
    /********************************************************************/

    public AlgorithmSolution dfs_wrapper() {

        AlgorithmSolution result = new AlgorithmSolution();

        try {
            return result.setSolution(dfs());
        } catch(Exception e) {
            return null;
        }
    }

    private State dfs() throws Exception{

        Stack<State> pendingStates = new Stack<>();
        pendingStates.push(initialState);

        HashMap<State, Integer> visitedStatesToMoves = new HashMap<>();
        ArrayList<State> childrenStates;
        while(!pendingStates.empty()) {

            State currState = pendingStates.pop();

            if(visitedStatesToMoves.containsKey(currState)) {
                continue;
            }

            if(isSolution(currState)) {
                return currState;
            }

            childrenStates = getChildrenStates(currState);

            for (State child : childrenStates) {
                pendingStates.push(child);
            }

            visitedStatesToMoves.put(currState, currState.currentMoveCount);
        }

        throw new Exception("No Solution Found");
    }

    /***************************************************************************/
    /***                                BFS                                  ***/
    /***************************************************************************/

    public AlgorithmSolution bfs_wrapper() {

        AlgorithmSolution result = new AlgorithmSolution();

        try {
            return result.setSolution(bfs());
        } catch(Exception e) {
            return null;
        }
    }

    private State bfs() throws Exception{

        Queue<State> pendingStates = new LinkedList<>();
        pendingStates.add(initialState);

        HashMap<State, Integer> visitedStatesToMoves = new HashMap<>();
        ArrayList<State> childrenStates;
        while(!pendingStates.isEmpty()) {

            State currState = pendingStates.poll();

            if(visitedStatesToMoves.containsKey(currState)) {
                continue;
            }

            if(isSolution(currState)) {
                return currState;
            }

            childrenStates = getChildrenStates(currState);

            for (State child : childrenStates) {
                pendingStates.add(child);
            }

            visitedStatesToMoves.put(currState, currState.currentMoveCount);
        }

        throw new Exception("No Solution Found");
    }
}
