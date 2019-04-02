package com.reeckset.labyrinthrobots.cli;

import com.reeckset.labyrinthrobots.API;
import com.reeckset.labyrinthrobots.AlgorithmSolution;
import com.reeckset.labyrinthrobots.Board;

import java.io.File;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

public class CLI {


    API api;
    Stack<Menu> menuStack;

    public CLI(API api) {

        this.api = api;
        this.menuStack = new Stack<>();

        MenuItem AStar = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "A*";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("AStar");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem AStar_Non_Admissible = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "A* with non admissible heuristic";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("AStar with non admissible heuristic");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem AStar_Non_Admissible_v2 = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "A* with non admissible heuristic v2";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("AStar with non admissible heuristic v2");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem Greedy = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "Greedy Algorithm";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("Greedy Algorithm");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem Greedy_Non_Admissible = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "Greedy Algorithm with non admissible heuristic";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("Greedy Algorithm with non admissible heuristic");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem DFS = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "DFS";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("DFS");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem BFS = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "BFS";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("BFS");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem IDDFS = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "Iterative Deepening DFS";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("Iterative Deepening DFS");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem IDDFS_Optimized = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "Iterative Deepening DFS - Optimized";
            }

            @Override
            public void select() {
                if(!cli.api.isBoardLoaded()) {
                    System.out.println("No Board loaded, please select a level first!");
                    return;
                }

                cli.execAlgorithm("Iterative Deepening DFS - optimized");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };



        Menu algorithmsMenu = new Menu(new MenuItem[]{
                DFS, BFS, AStar, AStar_Non_Admissible, AStar_Non_Admissible_v2, Greedy, Greedy_Non_Admissible, IDDFS, IDDFS_Optimized
        }, this);

        MenuItem loadLevel = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "Load Level";
            }

            @Override
            public void select() {
                this.cli.loadLevel();
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem runAlgorithm = new MenuItem(this) {
            @Override
            public String getLabel() {
                return "Run Algorithm";
            }

            @Override
            public void select() {

            }

            @Override
            public Menu getChildrenMenu() {
                return algorithmsMenu;
            }
        };

        this.menuStack.push(new Menu(new MenuItem[]{loadLevel, runAlgorithm}, this));
    }


    public void init() {
        while(!menuStack.empty()) {
            this.menuStack.peek().show();
        }
    }

    public void advanceMenu(Menu menu) {
        this.menuStack.push(menu);
    }

    public void returnMenu() {
        this.menuStack.pop();
    }

    public void loadLevel() {
        System.out.println("File Path (ex. lvl_18.txt):");

        Scanner in = new Scanner(System.in);
        String filepath = in.nextLine();

        File levelFile = new File(filepath);

        this.api.loadLevel(levelFile);

        System.out.println("File loaded successfully, you can now execute the search algorithms.");

    }

    public void execAlgorithm(String algorithm, int timeout) {
        try {
            AlgorithmSolution exec = api.execAlgorithm(algorithm, timeout);
            System.out.println("Time: " + exec.execTime + "ms");
            System.out.println("Visited nodes: " + exec.nVisitedNodes);
            Board.printSolution(exec.solution);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            System.out.println("Could not solve the given problem in the requested timeout (" + timeout + "s)");
        }
    }


    public void execAlgorithm(String algorithm) {
        execAlgorithm(algorithm, 30);
    }
}
