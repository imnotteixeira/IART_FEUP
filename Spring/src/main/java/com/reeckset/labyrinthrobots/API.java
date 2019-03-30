package com.reeckset.labyrinthrobots;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.*;
import java.util.function.Function;

@RestController
public class API {

    private Board activeBoard;

    static final Map<String, Function> algorithmToFunction = new LinkedHashMap<String, Function>() {{
        put("AStar", (activeBoard) -> ((Board) activeBoard).AStar());
        put("AStar with non admissable heuristic", (activeBoard) -> ((Board) activeBoard).AStar(true));
        put("BFS", (activeBoard) -> ((Board) activeBoard).bfs_wrapper());
        put("DFS", (activeBoard) -> ((Board) activeBoard).dfs_wrapper());
        put("Iterative Deepening DFS", (activeBoard) -> ((Board) activeBoard).iterativeDFS());
        put("Iterative Deepening DFS - optimized", (activeBoard) -> ((Board) activeBoard).iterativeDFS(true));
    }};

    @RequestMapping(value = "/board", method = RequestMethod.POST)
    public String getBoard(@RequestParam("file") MultipartFile file){

        this.activeBoard = readLevel(file);
        return activeBoard.toJSON();
    }

    @RequestMapping(value = "/runAlgorithm", method = RequestMethod.GET)
    public String runAlgorithm(String algorithm){

        ExecutorService executor = Executors.newSingleThreadScheduledExecutor();

        long start = System.currentTimeMillis();

        Future<Object> future = executor.submit(() -> algorithmToFunction.get(algorithm).apply(activeBoard));
        try {
            ArrayList<State> solution = (ArrayList<State>) future.get(15, TimeUnit.SECONDS);
            long duration = System.currentTimeMillis() - start;
            executor.shutdown();
            return "{\"solution\":" + getSolutionJSON(solution) + ", \"time\":" + duration + "}";
        } catch (Exception e) {
            executor.shutdown(); // may or may not desire this
            return "{}";
        }
    }

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
        String result = "";
        for(int i = 0; i < states.size(); i++){
            result = states.get(i).toJSON() + result;
            if(i < states.size() - 1){
                result = ", " + result;
            }
        }
        return "[" + result + "]";
    }

    private static Board readLevel(MultipartFile file) {



        byte[] walls = {};
        int[] targets = {}, robots = {};

        try {
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
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
