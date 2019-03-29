const MOVEMENT_DURATION = 500; //in miliseconds - actual movement time
const MOVEMENT_INTERVAL = 500;  //in miliseconds - interval between each movement


document.documentElement.style.setProperty("--robot-movement-speed", MOVEMENT_DURATION / 1000 + "s");

const board = document.getElementById("board");
const executedMovesDOM = document.getElementById("executedMovesNbr");

const drawBoard = (walls, targets) => {

    const targetsMap = targets.reduce((map, target, i) => ({[target]: i, ...map}), {});

    for(let i in walls){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if(walls[i] == 1){
            cell.classList.add("wall");
        } else if(targetsMap[i] !== undefined){
            cell.classList.add("target", "color-" + targetsMap[i]);
        }
        
        board.appendChild(cell);
    }
}

const createRobots = (robots) => robots.map((robotPosition, i) => {
        const robot = document.createElement("div");
        robot.classList.add("robot", "color-" + i);
        const x = robotPosition % 16;
        const y = Math.floor(robotPosition / 16);
        robot.style.left = x * 6.25 + "%";
        robot.style.top = y * 6.25 + "%";
        board.appendChild(robot);
        return robot;
},[]);

const updateRobotPositions = (robots, newPositions) => {
    if(robots.length !== newPositions.length){
        console.error("Number of positions provided does not match with number of robots");
        return;
    }
    for(let i in robots){
        robots[i].style.left = (newPositions[i] % 16) * 6.25 + "%";
        robots[i].style.top = (Math.floor(newPositions[i] / 16)) * 6.25 + "%";
    }
}

const runSequence = (robots, positionSequence) => {
    let i = 0;

    let periodicRun = setInterval(() => {
        if(i == positionSequence.length - 1) clearInterval(periodicRun);
    
        updateRobotPositions(robots, positionSequence[i]);
        executedMovesDOM.innerHTML = i+1;
        i++;
    }, MOVEMENT_DURATION + MOVEMENT_INTERVAL);
}

/////////////////////////////////////////////////////////////////


//simulated data from the API

const boardWalls = [
    1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, //15
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, //31
    0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, //47
    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, //63
    1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, //79
    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, //95
    0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, //111
    1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, //127
    0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, //143
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, //159
    1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, //175
    1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, //191
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, //207
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, //223
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, //239
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, //255
];

const targetPositions = [30, -1, 172, 22];

const initialRobotPositions = [49, 60, 145, 253];

const robotsPositionSequence = [
    [49, 108, 145, 253],
    [49, 108, 154, 253],
    [49, 108, 138, 253],
    [49, 108, 143, 253],
    [49, 111, 143, 253],
    [49, 127, 143, 253],
    [49, 125, 143, 253],
    [49, 125, 137, 253],
    [49, 125, 137, 141],
    [48, 125, 137, 141],
    [48, 29, 137, 141],
    [32, 29, 137, 141],
    [37, 29, 137, 141],
    [245, 29, 137, 141],
    [245, 21, 137, 141],
    [253, 21, 137, 141],
    [253, 21, 140, 141],
    [253, 21, 140, 29],
    [253, 21, 140, 22],
    [253, 21, 172, 22],
    [29, 21, 172, 22],
    [30, 21, 172, 22],
];


//run interface code

drawBoard(boardWalls, targetPositions);

const robots = createRobots(initialRobotPositions);

runSequence(robots, robotsPositionSequence);

