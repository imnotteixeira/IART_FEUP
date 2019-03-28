package com.angelo.Testing;

import com.angelo.Board;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class AStar {

    @Test
    void testSimplePuzzle(){

        int[] robots = {0};

        int[] targets = {17};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(3, b.AStar().size());
    }

    /*@Test
    void testSimplePuzzleInUnsolvablePosition(){

        int[] robots = {0};

        int[] targets = {18};

        Board b = new Board(TestBoards.SIMPLE_PUZZLE_WALLS, targets, robots);

        assertEquals(0, b.iterativeDFS().size());
    }*/

    @Test
    void testLevel1(){

        Board b = new Board(TestBoards.LEVEL_1_WALLS, TestBoards.LEVEL_1_TARGETS, TestBoards.LEVEL_1_ROBOTS);

        assertEquals(TestBoards.LEVEL_1_OPTIMAL_STEPS + 1, b.AStar().size());
    }

    @Test
    void testLevel2(){

        Board b = new Board(TestBoards.LEVEL_2_WALLS, TestBoards.LEVEL_2_TARGETS, TestBoards.LEVEL_2_ROBOTS);

        assertEquals(TestBoards.LEVEL_2_OPTIMAL_STEPS + 1, b.AStar().size());
    }

    @Test
    void testLevel7(){

        int[] robots = {100, 137};

        int[] targets = {83, 196};

        Board b = new Board(TestBoards.LEVEL_7_WALLS, targets, robots);

        assertEquals(8, b.AStar().size());
    }

    @Test
    void testLevel10(){

        int[] robots = {177, 235};

        int[] targets = {157, -1};

        Board b = new Board(TestBoards.LEVEL_10_WALLS, targets, robots);

        assertEquals(13, b.AStar().size());
    }

    @Test
    void testLevel18(){

        int[] robots = {150, 153, 93};

        int[] targets = {73, 85, -1};

        Board b = new Board(TestBoards.LEVEL_18_WALLS, targets, robots);

        assertEquals(10, b.AStar().size());
    }

    @Test
    void testLevel24(){

        int[] robots = {49, 60, 145, 253};

        int[] targets = {30, -1, 172, 22};

        Board b = new Board(TestBoards.LEVEL_24_WALLS, targets, robots);

        assertEquals(23, b.AStar().size());
    }

}
