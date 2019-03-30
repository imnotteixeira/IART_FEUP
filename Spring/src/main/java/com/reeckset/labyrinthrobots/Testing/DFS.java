package com.reeckset.labyrinthrobots.Testing;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class DFS {


    @Test
    public void testLevel1(){
        assertEquals(TestBoards.LEVEL_1_OPTIMAL_STEPS + 1, TestBoards.LEVEL_1.dfs_wrapper().size());
    }

    @Test
    public void testLevel2(){
        assertEquals(TestBoards.LEVEL_2_OPTIMAL_STEPS + 1, TestBoards.LEVEL_2.dfs_wrapper().size());
    }

    @Test
    public void testLevel3(){
        assertEquals(TestBoards.LEVEL_3_OPTIMAL_STEPS + 1, TestBoards.LEVEL_3.dfs_wrapper().size());
    }

    @Test
    public void testLevel7(){
        assertEquals(TestBoards.LEVEL_7_OPTIMAL_STEPS + 1, TestBoards.LEVEL_7.dfs_wrapper().size());
    }

    @Test
    public void testLevel10(){
        long start = System.nanoTime();
        assertEquals(TestBoards.LEVEL_10_OPTIMAL_STEPS + 1, TestBoards.LEVEL_10.dfs_wrapper().size());
        System.out.println(System.nanoTime() - start);
    }

    @Test
    public void testLevel18(){
        assertEquals(TestBoards.LEVEL_18_OPTIMAL_STEPS + 1, TestBoards.LEVEL_18.dfs_wrapper().size());
    }
}
