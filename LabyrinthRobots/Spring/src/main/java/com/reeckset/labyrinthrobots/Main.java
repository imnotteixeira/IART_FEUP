package com.reeckset.labyrinthrobots;


import com.reeckset.labyrinthrobots.cli.CLI;

import java.io.File;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

public class Main {

    public static void main(String[] args){
        API api = new API();
        CLI cli = new CLI(api);
        cli.init();


//        try {
//
//
//            api.loadLevel(new File("lvl_17.txt"));
//            Board.printSolution(api.execAlgorithm("AStar", 15).solution);
//
//
//
//        } catch (InterruptedException | ExecutionException | TimeoutException e) {
//            e.printStackTrace();
//        }
    }

}
