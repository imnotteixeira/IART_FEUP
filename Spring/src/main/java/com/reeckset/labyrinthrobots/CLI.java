package com.reeckset.labyrinthrobots;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;
import java.util.Stack;

public class CLI {
    private interface MenuItem {
        public String getLabel();
        public void select();
        public Menu getChildrenMenu();

    }



    private class Menu {
        MenuItem[] items;
        CLI cli;

        public Menu(MenuItem[] items, CLI cli) {
            this.items = items;
            this.cli = cli;
        }

        public void show() {
            cli.advanceMenu(this);
            System.out.println("> 0 - Back");
            for (int i = 0; i < items.length; i++) {
                System.out.println("> "+ (i + 1) + " - " + items[i].getLabel());
            }


            Scanner in = new Scanner(System.in);
            int option = in.nextInt();

            if(option == 0) {
                cli.returnMenu();
            }

            if(option > 0 && option <= items.length) { //valid option
                if(items[option-1].getChildrenMenu() == null) {
                    items[option-1].select();
                } else {
                    this.cli.advanceMenu(items[option-1].getChildrenMenu());
                }
            }

        }
    }


    Stack<Menu> menuStack;

    public CLI() {

        this.menuStack = new Stack<>();

        MenuItem AStar = new MenuItem() {
            @Override
            public String getLabel() {
                return "AStar";
            }

            @Override
            public void select() {
                System.out.println("I Should be running AStar");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem DFS = new MenuItem() {
            @Override
            public String getLabel() {
                return "DFS";
            }

            @Override
            public void select() {
                System.out.println("I Should be running DFS");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        Menu algorithmsMenu = new Menu(new MenuItem[]{
            AStar, DFS
        }, this);

        MenuItem loadLevel = new MenuItem() {
            @Override
            public String getLabel() {
                return "Load Level";
            }

            @Override
            public void select() {
                System.out.println("asd");
            }

            @Override
            public Menu getChildrenMenu() {
                return null;
            }
        };

        MenuItem runAlgorithm = new MenuItem() {
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
            this.menuStack.pop().show();
        }

    }

    public void advanceMenu(Menu menu) {
        this.menuStack.push(menu);
    }

    public void returnMenu() {
        this.menuStack.pop();
    }

}
