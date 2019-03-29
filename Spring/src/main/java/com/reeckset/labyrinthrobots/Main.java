package com.reeckset.labyrinthrobots;

import com.reeckset.labyrinthrobots.Testing.TestBoards;

public class Main {

    public static void main(String[] args){
        Board b = new Board(TestBoards.LEVEL_10_WALLS, TestBoards.LEVEL_10_TARGETS, TestBoards.LEVEL_10_ROBOTS, true);
    }

}
