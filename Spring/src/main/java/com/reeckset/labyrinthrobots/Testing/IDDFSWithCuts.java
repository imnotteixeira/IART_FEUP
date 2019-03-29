package com.reeckset.labyrinthrobots.Testing;

import com.reeckset.labyrinthrobots.Board;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class IDDFSWithCuts {

    @Test
    public void testSimplePuzzle(){

        int[] robots = {0};

        int[] targets = {17};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(3, b.iterativeDFS(true).size());
    }

    @Test
    public void testLevel7(){

        int[] robots = {100, 137};

        int[] targets = {83, 196};

        Board b = new Board(TestBoards.LEVEL_7_WALLS, targets, robots);

        assertEquals(8, b.iterativeDFS(true).size());
    }

    @Test
    public void testLevel10(){

        int[] robots = {177, 235};

        int[] targets = {157, -1};

        Board b = new Board(TestBoards.LEVEL_10_WALLS, targets, robots);

        assertEquals(13, b.iterativeDFS(true).size());
    }

    @Test
    public void testLevel18(){

        int[] robots = {150, 153, 93};

        int[] targets = {73, 85, -1};

        Board b = new Board(TestBoards.LEVEL_18_WALLS, targets, robots);

        assertEquals(10, b.iterativeDFS(true).size());
    }

    @Test
    public void testLevel24(){

        int[] robots = {49, 60, 145, 253};

        int[] targets = {30, -1, 172, 22};

        Board b = new Board(TestBoards.LEVEL_24_WALLS, targets, robots);

        assertEquals(23, b.iterativeDFS(true).size());
    }
}
