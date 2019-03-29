package com.angelo;

import java.io.*;
import java.util.Arrays;

public class Main {

    public static void main(String[] args){

        String filePath = "lvl_test.txt";
        Board b = readLevel(filePath, true);

        b.printSolution(b.AStar());

    }

    private static Board readLevel(String filePath, boolean strict) {

        File file = new File(filePath);

        byte[] walls = {};
        int[] targets = {}, robots = {};

        try {
            BufferedReader br = new BufferedReader(new FileReader(file));
            String st;

            st = br.readLine();

            String[] wallPositions = st.split(",");
            walls = new byte[wallPositions.length];

            for (int i = 0; i < wallPositions.length; i++) {
                walls[i] = Byte.parseByte(wallPositions[i]);
            }

            st = br.readLine();

            String[] robotPositions = st.split(",");
            robots = new int[robotPositions.length];

            for (int i = 0; i < robotPositions.length; i++) {
                robots[i] = Integer.parseInt(robotPositions[i]);
            }




            st = br.readLine();

            String[] targetPositions = st.split(",");
            targets = new int[targetPositions.length];

            for (int i = 0; i < targetPositions.length; i++) {
                targets[i] = Integer.parseInt(targetPositions[i]);
            }




        } catch (IOException e) {
            e.printStackTrace();
        }




        return new Board(walls, targets, robots, strict);


    }

}
