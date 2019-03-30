package com.reeckset.labyrinthrobots.cli;

import java.util.InputMismatchException;
import java.util.Scanner;

public class Menu {
    MenuItem[] items;
    CLI cli;

    public Menu(MenuItem[] items, CLI cli) {
        this.items = items;
        this.cli = cli;
    }

    public void show() {
        System.out.println("\n------------------------------");
        System.out.println("> 0 - Back");
        for (int i = 0; i < items.length; i++) {
            System.out.println("> "+ (i + 1) + " - " + items[i].getLabel());
        }

        boolean validInput = false;
        while (!validInput) {
            validInput = true;


            try {
                System.out.println("\nChoose an option [0-" + items.length+"]");

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
            } catch (InputMismatchException e) {
                validInput = false;
                System.out.print("Invalid Option. ");
            }


        }

    }
}
