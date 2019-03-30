package com.reeckset.labyrinthrobots;


import com.reeckset.labyrinthrobots.cli.CLI;

public class Main {

    public static void main(String[] args){
        API api = new API();
        CLI cli = new CLI(api);
        cli.init();
    }

}
