const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 1200;
const CANVAS_HEIGHT = canvas.height = 900;

const carImage = new Image();
carImage.src = 'Images/car.png';

let x = 0;

// COLORS
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const RED = "#FF0000";
const GREEN = "#00FF00";
const BLUE = "#0000FF";
const YELLOW = "#F7FF00";
const AQUA = "#00FFF7";
const PURPLE = "#CD00FF";
const PINK = "#FF00D8";
const GREY = "#D3D3D3";


class Game{

    constructor(){

        this.nodeList = [];
        this.vertexList = [];
    }

    nextNodeToCheck(){
        returnNode = null;
        currentLowestF = null;
        this.nodeList.forEach((node) => {
            // If we still need to check this node
            if (node.visited == false){
                // If this node has an F value (meaning it's been connected by another node)
                if (node.f != null){
                    // If no node has been selected yet, select this one because its the lowest so far
                    if (currentLowestF == null){
                        currentLowestF = node.f;
                        returnNode = node;
                    }
                    // Select the smallest f value node
                    if (node.f < currentLowestF){
                        currentLowestF = node.f;
                        returnNode = node;
                    }
                }
            }


        });
        return returnNode;
    }



    updateConnectedNodes(currentNode){

        // Get a list of all nodes to be updated (connected ones) 
        let toCheckNodeList = [];
        currentNode.forEach((connectedPathIdAndCost) => {
            let connectedNode = idToNode(connectedPathIdAndCost[0])
            if (connectedNode.visited == false){
                toCheckNodeList.push((connectedNode), connectedPathIdAndCost[1]);
            }
        });

        currentNodeG = node.g;


        // Go through each node, if the f value is undefined or lower than previous f value, update node accordingly
        toCheckNodeList.forEach((nodeAndCost) => {

            let node = nodeAndCost[0];
            let travelToNodeCost = nodeAndCost[1];

            // If f is undefineed, set it
            if (node.f == null){
                node.g = travelToNodeCost;
                node.f = node.g + node.heuristic;
                node.previousNode = currentNode;
            }

            // if this value of f is lower than previous, then set it
            if ((currentNodeG + travelToNodeCost + node.heuristic) < node.f){
                node.g = travelToNodeCost + currentNodeG;
                node.f = node.g + node.heuristic;
                node.previousNode = currentNode;
            }

        });

        // Set this node to visited!
        currentNode.visited = true;

    }


    
    updateAdjacencyList(){

    }

    idToNode(id){
        let returnNode = null;
        if (this.nodeList){
            this.nodeList.forEach((node) => {
                console.log("checking");
                if (node.id == id){
                    console.log("id found");
                    returnNode = node;
                    
                }
            });
            // NO ID FOUND
        }
        return returnNode;
        
    }


}

class Node{

    constructor(id, x, y, isItStart, isItEnd){
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = YELLOW;

        this.isItStart = isItStart;
        this.isItEnd = isItEnd; 
        this.visited = false;

        // g is the cost from the start 
        this.g = null;
        // heuristic is the approximate added cost depending on distance from end
        this.heuristic = null;
        // f = g + h
        this.f = null;
        this.previousNode = null;

        // E.G. [(2, 5), (3, 10), (7, 3)]
        // [nodeID, CostToTravel]
        // Travel to node 2 for cost: 5
        this.connectedPathIdAndCost = [];


        this.width = 50;
        this.height = 50;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
    }


}


class Box{
    constructor(x, y, width, height, color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    draw(){
        drawBox(this.x, this.y, this.width, this.height, this.color);
    }
}




class Screen{

    constructor(Id, name, buttonList){
        this.Id = Id;
        this.name = name;
        this.buttonList = buttonList;

        // DRAWING ORDER:
        // 1. BACKGROUND OBJECTS
        // 2. FOREGROUND OBJECTS
        // 3. UI OBJECTS
        this.drawBackgroundObjectList = [];
        this.drawForegroundObjectList = [];
        this.drawUIObjectList = [];

        this.activeScreen = false;

    }

    addBackgroundObject(obj){
        this.drawBackgroundObjectList.push(obj);
    }
    addForegroundObject(obj){
        this.drawForegroundObjectList.push(obj);
    }
    addUIObject(obj){
        this.drawUIObjectList.push(obj);
    }

    addButton(btn){
        this.buttonList.push(btn);
    }

    draw(){
        // When drawing, first do background, then objects, then buttons
        if (this.activeScreen){
            // BACKGROUND OBJEECTS
            this.drawBackgroundObjectList.forEach((object) => {
                object.draw();
            });

            // FOREGROUND OBJECTS
            this.drawForegroundObjectList.forEach((object) => {
                object.draw();
            });

            // UI OBJECTS
            this.drawUIObjectList.forEach((object) => {
                object.draw();
            });

        }


    }
    loadButtons(){
        this.buttonList.forEach((button) => {
            button.update();
        });
    }


}





class Button{
    constructor(Id, x, y, width, height, boxColor, boxHoverColor, text, textColor, textHoverColor){
        this.Id = Id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.boxColor = boxColor;
        this.boxHoverColor = boxHoverColor;
        this.text = text;
        this.textColor =  textColor;
        this.textHoverColor = textHoverColor;
        // state = [default, hover, clicked]
        this.state = [true, false, false];

        this.activeBoxColor = boxColor;
        this.activeTextColor = textColor;

        this.leftClickDown = false;
        this.leftClickUp = false;
    }

    update(){
        this.hoverCheck(mouseHoverPos);
    }


    draw() {

        drawBox(this.x, this.y, this.width, this.height, this.activeBoxColor);
        writeText(this.text, 0, true, this.x + (this.width / 2), this.y + (this.height / 2), this.activeTextColor ,this.width * 0.95);

    }

    updateStateColor(){
        // DEFAULT
        if (this.state[0]){
            this.activeBoxColor = this.boxColor;
            this.activeTextColor = this.textColor;
        }
        // HOVER
        if (this.state[1]){
            this.activeBoxColor = this.boxHoverColor;
            this.activeTextColor = this.textHoverColor;
        }
        // CLICKEED
        if (this.state[2]){
            
        }
    }

    hoverCheck(mousePos) {
        // IF MOUSE POS IN BOX
        if ((mousePos[0] > this.x) && (mousePos[0] < this.x + this.width))
        {
            if ((mousePos[1] > this.y) && (mousePos[1] < this.y + this.height))
            {
                this.state = [false, true, false];
                this.updateStateColor();
                this.clickCheck();
            }
            // IF MOUSE NOT IN BOX POS
            else{
                this.state = [true, false, false]
                this.updateStateColor();
            }
        }
        // IF MOUSE NOT IN BOX POS
        else{
            this.state = [true, false, false]
            this.updateStateColor();
        }
        

    }

    // ONLY USED IN hoverCheck METHOD IN Button CLASS. THIS CHECKS FOR CLICK WHILE HOVERED 
    clickCheck(){
        if (click){
            // LOG THE ID
            if (this.Id == 0){
                clickFirstScreen();
            }
            if (this.Id == 1){
                clickTutorialBtn();
            }
            console.log("CLICKED ON BUTTON");

            this (this.Id == 10){
                clickStepBtn();

            }
        }
    }



}

function drawBox(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function clickFirstScreen(){
    console.log("xsflkdsf");
    firstScreen.activeScreen = false;
    secondScreen.activeScreen = true;

    console.log("did the stuff");

}

function clickTutorialBtn(){
    secondScreen.activeScreen = false;
    playScreen.activeScreen = true;

}

function clickStepBtn(){


}



function writeText(text, styleId, centered, x, y, color, maxWidth){

    // THERE WILL BE A COUPLE PRE-SET TEXT STYLES, CHOOSE WHICH STYLE WITH NUMBER
    if (styleId == 0)
    {
        ctx.font = "30px Comic Sans MS";
        
    } 

    ctx.fillStyle = color;

    if (centered){
        ctx.textAlign = "center";
    }
    ctx.fillText(text, x, y, maxWidth);
    


}





// -=-=- FINDING OUT THE USER'S MOUSE POSITION -=-=- 
var globalMouseClickX = 0;
var globalMouseClickY = 0;
var globalMouseHoverX = 0;
var globalMouseHoverY = 0;

var click = false;
// var clickDown = false;
canvas.addEventListener("click", function(e){
    globalMouseClickX = e.x;
    globalMouseClickY = e.y;
})
canvas.addEventListener("mousemove", function(e){
    globalMouseHoverX = e.x;
    globalMouseHoverY = e.y;
})

document.body.onmousedown = function(){
    // console.log("LEFT CLICKED DOWN");
    click = true;

}

// ASSUMING THAT THE CANVAS IS CENTERED ON THE PAGE (ITS IN DIRECT CENTER)
// WHEN IMPLEMENTING ON tipucs.co.uk, NEED TO CHANGE THIS FUNCTION, THERES 2 OPTIONS:
// OPTION 1: LINK TO ANOTHER PAGE WHICH HAS THE SIMULATION IN THE DIRECT CENTER
// OPTION 2: ADD SIMULATION AT THE BOTTOM AND ADJUST THE Y VALUE OF CANVASY TO FIT THE ACTUAL CANVAS.
function mouseClickPosInCanvas()
{
    var canvasX;
    var canvasY;
    canvasX = globalMouseClickX - (window.innerWidth / 2) + (CANVAS_WIDTH / 2);
    canvasY = globalMouseClickY - (window.innerHeight / 2) + (CANVAS_HEIGHT / 2);

    return [canvasX, canvasY];

}

function mouseHoverPosInCanvas()
{
    var canvasX;
    var canvasY;
    canvasX = globalMouseHoverX - (window.innerWidth / 2) + (CANVAS_WIDTH / 2);
    canvasY = globalMouseHoverY - (window.innerHeight / 2) + (CANVAS_HEIGHT / 2);

    return [canvasX, canvasY];

}

// let myBtn = new Button(0, 50, 50, 300, 100, YELLOW, GREEN, "TESTING TEXT", BLACK, WHITE);

let startGameBtn = new Button(0, 400, 500, 400, 150, YELLOW, GREEN, "Click To Start!", BLACK, WHITE);

let tutorialGameBtn = new Button(1, 400, 300, 400, 150, YELLOW, GREEN, "Tutorial", BLACK, WHITE);

let levelGameBtn = new Button(2, 400, 500, 400, 150, YELLOW, GREEN, "Play", BLACK, WHITE);

let doConnectedNodeBtn = new Button(10, 50, 50, 200, 150, RED, GREEN, "Next Step", BLACK, WHITE);

// listOfActiveButtons = [myBtn]

// FIRST SCREEN
let firstScreen = new Screen(0, "firstScreen", [startGameBtn]);
firstScreen.activeScreen = true;

let firstScreenBG = new Box(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, AQUA);
firstScreen.addBackgroundObject(firstScreenBG);
firstScreen.addUIObject(startGameBtn);

// SECOND SCREEN
let secondScreen = new Screen(1, "secondScreen", [tutorialGameBtn, levelGameBtn]);

let secondScreenBG = new Box(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, PURPLE);
secondScreen.addBackgroundObject(secondScreenBG);
secondScreen.addUIObject(tutorialGameBtn);
secondScreen.addUIObject(levelGameBtn);

// PLAY SCREEN
let playScreen = new Screen(2, "secondScreen", [doConnectedNodeBtn]);

playScreen.addUIObject(doConnectedNodeBtn);


screenList = [firstScreen, secondScreen, playScreen]


testGame = new Game();

testNode = new Node(3, 100, 100, false, false);

testNode2 = new Node(4, 100, 100, false, false);

testGame.nodeList.push(testNode);
testGame.nodeList.push(testNode2);


function mainLoop(){

    mouseClickPos = mouseClickPosInCanvas();
    // console.log(mouseClickPos);
    mouseHoverPos = mouseHoverPosInCanvas();
    // console.log(mouseHoverPos);
    // console.log();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    
    screenList.forEach((screen) => {
        if (screen.activeScreen){
            screen.draw();
            screen.loadButtons();
        }
    });
    // listOfActiveButtons.forEach((button) => {
    //     // console.log("doing");
    //     button.draw();
    //     button.hoverCheck(mouseHoverPos);
    // });

    click = false;
    requestAnimationFrame(mainLoop);

}
mainLoop()