package com.reeckset.labyrinthrobots;

import java.util.ArrayList;

public class AlgorithmSolution {

    public long startTime;
    public long execTime;
    public ArrayList<State> solution;
    public int nSteps;
    public int nVisitedNodes = 0;

    public AlgorithmSolution() {
        this.startTime = System.currentTimeMillis();
    }

    public AlgorithmSolution setSolution(State finalState){
        this.execTime = System.currentTimeMillis() - this.startTime;
        this.solution = getSolutionTrace(finalState);
        this.nSteps = this.solution.size();
        return this;
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

    public void incrementVisitedNodes(){
        this.nVisitedNodes++;
    }

}
