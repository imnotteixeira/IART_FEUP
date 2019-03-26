package com.angelo;

public class Main {

    public static void main(String[] args) {

//        boolean[] walls = {
//                false, false, true,  false, false, false, false, false, false, false, false, false, false, false, false, false, //15
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //31
//                false, true,  false, false, false, false, false, false, false, false, false, false, false, false, false, false, //47
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //63
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //79
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //95
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //111
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //127
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //143
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,//159
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //175
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //191
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //207
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //223
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //239
//                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //255
//        };
//
//        int[] robots = {0};
//
//        int[] targets = {17};

        boolean[] walls = {
                false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, //15
                false, false, false, false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false, //31
                false, false, false, true,  false, false, false, false, false, false, true,  false, false, false, false, false, //47
                false, false, false, true,  false, true,  false, false, false, false, true,  true,  false, false, false, false, //63
                false, false, true,  false, false, false, false, false, false, false, false, false, true,  false, false, false, //79
                false, false, true,  false, false, false, false, false, false, false, false, false, false, true,  false, false, //95
                false, false, false, true,  false, false, true,  true,  true,  false, false, false, false, true,  false, false, //111
                true,  true,  true,  true,  false, false, true,  false, true,  false, false, false, false, true,  false, false, //127
                false, false, false, false, false, false, true,  false, true,  true,  false, false, true,  false, true,  false, //143
                false, false, false, false, false, false, false, true,  false, false, false, false, false, false, false, true,  //159
                false, false, false, true,  false, false, false, true,  false, false, false, false, false, true,  true,  false, //175
                false, false, false, false, false, true,  false, true,  true,  true,  true,  false, false, true,  false, false, //191
                true,  false, false, true,  false, false, false, true,  false, true,  false, false, false, true,  false, false, //207
                false, true,  true,  true,  false, false, false, true,  false, true,  false, false, false, false, true,  false, //223
                false, false, false, true,  false, false, false, true,  false, false, true,  false, false, false, true,  false, //239
                false, false, false, true,  false, false, false, true,  false, false, true,  false, false, true,  false, false, //255
        };

        int[] robots = {177, 235};

        int[] targets = {157, -1};

        Board b = new Board(walls, targets, robots);
        b.solve();
    }
}
