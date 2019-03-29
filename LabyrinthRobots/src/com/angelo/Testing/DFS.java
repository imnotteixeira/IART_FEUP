package com.angelo.Testing;

import com.angelo.Board;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DFS {

    @Test
    void testLevel10(){

        int[] robots = {177, 235};

        int[] targets = {157, -1};

        Board b = new Board(TestBoards.LEVEL_10_WALLS, targets, robots);

        long start = System.nanoTime();
        assertEquals(13, b.dfs_wrapper().size());
    }
}
