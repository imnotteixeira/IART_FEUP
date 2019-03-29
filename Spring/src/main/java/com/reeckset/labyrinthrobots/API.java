package com.reeckset.labyrinthrobots;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@RestController
public class API {

    private Board activeBoard;

    static final Map<String, Function> algorithmToFunction = new HashMap<String, Function>() {{
        put("DFS", (activeBoard) -> ((Board) activeBoard).dfs_wrapper());
        put("Iterative Deepening DFS", (activeBoard) -> ((Board) activeBoard).iterativeDFS());
        put("Iterative Deepening DFS - optimized", (activeBoard) -> ((Board) activeBoard).iterativeDFS(true));
        put("AStar", (activeBoard) -> ((Board) activeBoard).AStar());
        put("AStar with non admissable heuristic", (activeBoard) -> ((Board) activeBoard).AStar(true));
    }};

    @CrossOrigin(origins = "http://localhost:8000")
    @RequestMapping(value = "/board", method = RequestMethod.GET)
    public String getBoard(String filePath){
        this.activeBoard = readLevel(filePath);
        return activeBoard.toJSON();
    }

    @CrossOrigin(origins = "http://localhost:8000")
    @RequestMapping(value = "/runAlgorithm", method = RequestMethod.GET)
    public String runAlgorithm(String algorithm){

        long start = System.currentTimeMillis();

        ArrayList<State> solution = (ArrayList<State>) algorithmToFunction.get(algorithm).apply(activeBoard);

        long duration = System.currentTimeMillis() - start;

        return "{\"solution\":" + getSolutionJSON(solution) + ", \"time\":" + duration + "}";
    }

    @CrossOrigin(origins = "http://localhost:8000")
    @RequestMapping(value = "/listAlgorithms", method = RequestMethod.GET)
    public String listAlgorithms(){

        String result = "[";

        int counter = 0;
        for (String algorithm : algorithmToFunction.keySet()) {
            result += "\"" + algorithm + "\"";
            if(counter < algorithmToFunction.size() - 1){
                result += ", ";
            }
            counter++;
        }

        return result + "]";
    }

    private static String getSolutionJSON(ArrayList<State> states){
        String result = "[";
        for(int i = 0; i < states.size(); i++){
            result += states.get(i).toJSON();
            if(i < states.size() - 1){
                result += ", ";
            }
        }
        return result + "]";
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
