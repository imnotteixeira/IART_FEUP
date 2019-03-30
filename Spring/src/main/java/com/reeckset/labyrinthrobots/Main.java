package com.reeckset.labyrinthrobots;


import java.io.File;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

public class Main {

    public static void main(String[] args){
        API api = new API();
        api.loadLevel(new File("lvl_18.txt"));


        int timeout = 15;
        try {
            AlgorithmSolution exec = api.execAlgorithm("AStar", timeout);
            System.out.println("Time: " + exec.execTime + "ms");
            Board.printSolution(exec.solution);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            System.out.println("Could not solve the given problem in the requested timeout (" + timeout + "s)");
        }
    }

}
