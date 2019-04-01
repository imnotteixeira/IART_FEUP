package com.reeckset.labyrinthrobots.Testing;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class IDDFSWithCuts {
    
    @Test
    public void testLevel1(){
        assertEquals(TestBoards.LEVEL_1_OPTIMAL_STEPS + 1, TestBoards.LEVEL_1.iterativeDFS(true).nSteps);
    }

    @Test
    public void testLevel2(){
        assertEquals(TestBoards.LEVEL_2_OPTIMAL_STEPS + 1, TestBoards.LEVEL_2.iterativeDFS(true).nSteps);
    }

    @Test
    public void testLevel3(){
        assertEquals(TestBoards.LEVEL_3_OPTIMAL_STEPS + 1, TestBoards.LEVEL_3.iterativeDFS(true).nSteps);
    }

    @Test
    public void testLevel7(){
        assertEquals(TestBoards.LEVEL_7_OPTIMAL_STEPS + 1, TestBoards.LEVEL_7.iterativeDFS(true).nSteps);
    }

    @Test
    public void testLevel10(){
        long start = System.nanoTime();
        assertEquals(TestBoards.LEVEL_10_OPTIMAL_STEPS + 1, TestBoards.LEVEL_10.iterativeDFS(true).nSteps);
        System.out.println(System.nanoTime() - start);
    }

    @Test
    public void testLevel18(){
        assertEquals(TestBoards.LEVEL_18_OPTIMAL_STEPS + 1, TestBoards.LEVEL_18.iterativeDFS(true).nSteps);
    }
}
