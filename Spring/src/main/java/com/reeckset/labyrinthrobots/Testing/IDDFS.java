package com.reeckset.labyrinthrobots.Testing;

import com.reeckset.labyrinthrobots.Board;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class IDDFS {

    @Test
    public void testSimplePuzzle(){

        int[] robots = {0};

        int[] targets = {17};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(3, b.iterativeDFS().size());
    }

    /*@Test
    public void testSimplePuzzleInUnsolvablePosition(){

        int[] robots = {0};

        int[] targets = {18};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(0, b.iterativeDFS().size());
    }*/

    @Test
    public void testLevel7(){

        int[] robots = {100, 137};

        int[] targets = {83, 196};

        Board b = new Board(TestBoards.LEVEL_7_WALLS, targets, robots);

        assertEquals(8, b.iterativeDFS().size());
    }

    @Test
    public void testLevel10(){

        int[] robots = {177, 235};

        int[] targets = {157, -1};

        Board b = new Board(TestBoards.LEVEL_10_WALLS, targets, robots);

        assertEquals(13, b.iterativeDFS().size());
    }

    @Test
    public void testLevel18(){

        int[] robots = {150, 153, 93};

        int[] targets = {73, 85, -1};

        Board b = new Board(TestBoards.LEVEL_18_WALLS, targets, robots);

        assertEquals(10, b.iterativeDFS().size());
    }
}
