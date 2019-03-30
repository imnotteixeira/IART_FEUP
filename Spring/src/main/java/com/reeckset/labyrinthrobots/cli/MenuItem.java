package com.reeckset.labyrinthrobots.cli;

public abstract class MenuItem {

    CLI cli;

    public MenuItem(CLI cli) {
        this.cli = cli;
    }

    public abstract String getLabel();
    public abstract void select();
    public abstract Menu getChildrenMenu();

}
