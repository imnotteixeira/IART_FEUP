package com.angelo.Testing;

import com.angelo.Board;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class IDDFS_Tests {

    @Test
    void testSimplePuzzle(){

        int[] robots = {0};

        int[] targets = {17};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(3, b.iterativeDFS().size());
    }

    /*@Test
    void testSimplePuzzleInUnsolvablePosition(){

        int[] robots = {0};

        int[] targets = {18};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(0, b.iterativeDFS().size());
    }*/


    @Test
    void testLevel10(){

        int[] robots = {177, 235};

        int[] targets = {157, -1};

        Board b = new Board(TestBoards.LEVEL_10_WALLS, targets, robots);

        assertEquals(13, b.iterativeDFS().size());
    }

    //@Test
    void testLevel24(){

        int[] robots = {49, 60, 145, 253};

        int[] targets = {30, -1, 172, 22};

        Board b = new Board(TestBoards.LEVEL_24_WALLS, targets, robots);

        assertEquals(22, b.iterativeDFS().size());
    }

}
