package com.reeckset.labyrinthrobots.Testing;

import com.reeckset.labyrinthrobots.Board;
import org.junit.Test;

import static org.junit.Assert.assertEquals;


public class AStar {

    @Test
    public void testLevel1(){
        assertEquals(TestBoards.LEVEL_1_OPTIMAL_STEPS + 1, TestBoards.LEVEL_1.AStar().nSteps);
    }

    @Test
    public void testLevel2(){
        assertEquals(TestBoards.LEVEL_2_OPTIMAL_STEPS + 1, TestBoards.LEVEL_2.AStar().nSteps);
    }

    @Test
    public void testLevel3(){
        assertEquals(TestBoards.LEVEL_3_OPTIMAL_STEPS + 1, TestBoards.LEVEL_3.AStar().nSteps);
    }

    @Test
    public void testLevel7(){
        assertEquals(TestBoards.LEVEL_7_OPTIMAL_STEPS + 1, TestBoards.LEVEL_7.AStar().nSteps);
    }

    @Test
    public void testLevel10(){
        long start = System.nanoTime();
        assertEquals(TestBoards.LEVEL_10_OPTIMAL_STEPS + 1, TestBoards.LEVEL_10.AStar().nSteps);
        System.out.println(System.nanoTime() - start);
    }

    @Test
    public void testLevel10_strict(){
        long start = System.nanoTime();
        assertEquals(TestBoards.LEVEL_10_OPTIMAL_STEPS + 1, TestBoards.LEVEL_10.AStar(true).nSteps);
        System.out.println(System.nanoTime() - start);
    }

    @Test
    public void testLevel18(){
        assertEquals(TestBoards.LEVEL_18_OPTIMAL_STEPS + 1, TestBoards.LEVEL_18.AStar().nSteps);
    }

    @Test
    public void testLevel24(){
        assertEquals(TestBoards.LEVEL_24_OPTIMAL_STEPS + 1, TestBoards.LEVEL_24.AStar().nSteps);
    }

    @Test
    public void testLevel24_strict(){
        assertEquals(TestBoards.LEVEL_24_OPTIMAL_STEPS + 1, TestBoards.LEVEL_24.AStar(true).nSteps);
    }
}
