let MOVEMENT_DURATION = 500; //in miliseconds - actual movement time
let MOVEMENT_INTERVAL = 500;  //in miliseconds - interval between each movement

let HOSTNAME = "http://localhost:8080";

const ERROR_MSG = "TIMEOUT REACHED";


document.documentElement.style.setProperty("--robot-movement-speed", MOVEMENT_DURATION / 1000 + "s");

const board = document.getElementById("board");
const executedMovesDOM = document.getElementById("executedMovesNbr");
const algorithmSelector = document.getElementById("algorithm-selector");
const algorithmDuration = document.getElementById("algorithm-duration");
const fileInput = document.getElementById("file-input");
let periodicRun;
let prevStepFunc, nextStepFunc;

const drawBoard = (walls, targets) => {

    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

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
    if(!newPositions) return;
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

    document.getElementById("run-automatic").classList.add("selected");
    document.getElementById("run-automatic-controls").style.display = "flex";

    periodicRun = setInterval(() => {
        if(i == positionSequence.length - 2) clearInterval(periodicRun);
    
        i++;
        updateRobotPositions(robots, positionSequence[i]);
        executedMovesDOM.innerHTML = i;
    }, MOVEMENT_DURATION + MOVEMENT_INTERVAL);
}

const runSequenceManually = (robots, positionSequence) => {
    let i = 0;

    document.getElementById("run-manually-controls").style.display = "block";
    document.getElementById("run-manually").classList.add("selected");

    prevStepFunc = document.getElementById("prev-step").addEventListener('click', () => {
        if(i > 0){
            i--;
            updateRobotPositions(robots, positionSequence[i]);
            executedMovesDOM.innerHTML = i;
        }
    })

    nextStepFunc = document.getElementById("next-step").addEventListener('click', () => {
        if(i < positionSequence.length - 1){
            i++;
            updateRobotPositions(robots, positionSequence[i]);
            executedMovesDOM.innerHTML = i;
        }
    })
}

/////////////////////////////////////////////////////////////////




let robotsPositionSequence = [];
let robots = [];

const STATES = {STOPPED: 0, AUTOMATIC: 1, MANUAL: 2};

let state = STATES.STOPPED;

const resetBoard = () => {
    clearInterval(periodicRun);
    updateRobotPositions(robots, robotsPositionSequence[0]);
    document.getElementById("run-manually-controls").style.display = "none";
    document.getElementById("run-automatic-controls").style.display = "none";
    document.getElementById("prev-step").removeEventListener('click', prevStepFunc);
    document.getElementById("next-step").removeEventListener('click', nextStepFunc);
    document.getElementById("run-automatic").classList.remove("selected");
    document.getElementById("run-manually").classList.remove("selected");

    document.getElementById("loading-indicator").innerHTML = "Running algorithm...";
    algorithmDuration.innerHTML = "";

    let resetNotifier = document.createElement("div");
    resetNotifier.classList.add("reset-notifier");
    document.body.appendChild(resetNotifier);
    setTimeout(() => resetNotifier.style.opacity = 0, 10);
    setTimeout(() => resetNotifier.parentNode.removeChild(resetNotifier), 1000);

    executedMovesDOM.innerHTML = 0;
    state = STATES.STOPPED;
}

document.getElementById("run-automatic").addEventListener('click', () => {
    resetBoard();
    runSequence(robots, robotsPositionSequence);
    state = STATES.AUTOMATIC;
})

document.getElementById("run-manually").addEventListener('click', () => {
    resetBoard();
    runSequenceManually(robots, robotsPositionSequence);
    state = STATES.MANUAL;
})

document.getElementById("speed_slider").oninput = function() {
    MOVEMENT_DURATION = 1000 / this.value; 
    MOVEMENT_INTERVAL = 1000 / this.value; 
    resetBoard();
    runSequence(robots, robotsPositionSequence);
}

fileInput.onchange = function(){
    if(!fileInput.files[0]) return;
    let formData = new FormData();
    formData.append('file', this.files[0]),
    resetBoard();
    fetch(HOSTNAME + "/board", {
        method: 'POST',
        body: formData,
        })
        .then((data) => data.json())
        .then(data => {
            drawBoard(data.walls, data.targets);
            robots = createRobots(data.robots);
            calculateAlgorithm();      
        });
}

const loadAlgorithms = () => {
    fetch(HOSTNAME + "/listAlgorithms")
    .then((data) => data.json())
    .then(data => {
        data.forEach(algorithmName => {
            let option = document.createElement("option");
            option.innerHTML = algorithmName;
            option.value = algorithmName;
            algorithmSelector.appendChild(option);
        });
    });
}

const calculateAlgorithm = () => {
    if(!fileInput.files[0]) return;
    resetBoard();
    board.style.visibility = "hidden";
    document.getElementById("run-automatic").disabled = true;
    document.getElementById("run-manually").disabled = true;
    fetch(HOSTNAME + "/runAlgorithm?algorithm=" + algorithmSelector.value)
    .then((data) => data.json())
    .then(data => {
        if(data.solution){
            robotsPositionSequence = data.solution;
            algorithmDuration.innerHTML = "Ran algorithm in " + data.time + "ms";
            board.style.visibility = "visible";
            document.getElementById("run-automatic").disabled = false;
            document.getElementById("run-manually").disabled = false;
        }else{
            algorithmDuration.innerHTML = "";
            document.getElementById("loading-indicator").innerHTML = ERROR_MSG;
        }
    });
}

algorithmSelector.onchange = () => calculateAlgorithm();


//////////////////////////////////////////////////

loadAlgorithms();