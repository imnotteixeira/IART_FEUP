package com.reeckset.labyrinthrobots;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@RestController
public class API {

    private Board activeBoard;

    @CrossOrigin(origins = "http://localhost:8000")
    @RequestMapping(value = "/board", method = RequestMethod.GET)
    public String getBoard(String filePath){
        this.activeBoard = readLevel(filePath);
        return activeBoard.toJSON();
    }

    private static Board readLevel(String filePath) {

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

        return new Board(walls, targets, robots);
    }
}
