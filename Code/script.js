// CURRENT TO DO:
// Automatically find the distance value between nodes instead of manually entering them
// ensure the g value is being correctly updated during each cycle
// 

// THIS IS THE NEWEST EDITION, LETS ASSUME I MADE THE NEW UPDATES (EVEN THOUGH I HAVEN'T, THIS IS FOR TESTING!)
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^




// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      SETUP
// ---------------------------------------------------------------------------------------------------------------------------------
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 750;
const CANVAS_HEIGHT = canvas.height = 750;

const carImage = new Image();
carImage.src = 'Images/car.png';

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      CONSTANTS
// ---------------------------------------------------------------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      CLASSES
// ---------------------------------------------------------------------------------------------------------------------------------

class Game{

    constructor(){

        this.nodeList = [];
        this.vertexList = [];

        this.heuristicMult = 1;
    }


    updateNodeList(){
        this.nodeList = createdMap;
        playScreen.resetBackgroundNode();
    }

    anyNodeRemaining(){
        // GO through every node, if they are not visited and they are not final node, then there are nodes to search
        let returning = false;
        this.nodeList.forEach((node) => {
            if (node.visited == false && node.isItEnd == false){
                returning = true;
            }
        });
        // console.log("-=-=- nodes remaining:" + returning);
        return returning;
    }


    // FINDS LOWEST F VALUE 
    nextNodeToCheck(){

        if (this.anyNodeRemaining() == false){

            // console.log("completed the search");
            return false;

        }
        // console.log("NOT COMPLETED SEARCH")

        if (this.anyNodeRemaining() == true){
            // console.log("-=-=-=- FINDING NEXT NODE -=-=-=-");
            let returnNode = null;
            let currentLowestF = -1;
            this.nodeList.forEach((node) => {

                // console.log("lowest F:" + currentLowestF);
                // console.log("-=-=-inspecting node ID:" + node.id);
                // If we still need to check this node
                if (node.visited == false){
                    // console.log("Node not visited")
                    
                    // If this node has an F value (meaning it's been connected by another node)
                    if (node.f != -1){
                        // console.log("Contains an F value");
                        // If no node has been selected yet, select this one because its the lowest so far
                        if (currentLowestF == -1){
                            // console.log("Node set to returnNode");
                            currentLowestF = node.f;
                            returnNode = node;
                        }
                        // Select the smallest f value node
    
                        if (node.f < currentLowestF){
                            // console.log("Node set to returnNode");
                            currentLowestF = node.f;
                            returnNode = node;
                            // console.log("lowest node so far with value:" + currentLowestF);
                        }
                    
                    }
                    else{
                        // console.log("not connected by visited");
                    }
                }
                else{
                    // console.log("visited");
                }
    
            });
            // IF START NODE NOT VISITED, THEN USE THAT NODE
            this.nodeList.forEach((node) => {
                if (node.isItStart){
    
                    if (node.visited == false){
                        // console.log("start Node not visited, using start node.");
                        returnNode = node;
                        node.g = 0;
                        node.f = node.g + node.heuristic;
                    }
    
                }
            });
    
            console.log("returning node:" + returnNode.id);
            return returnNode;
            
        }
        console.log("incompleted searching for next node");
    }


    updateConnectedNodes(currentNode){

        // Get a list of all nodes to be updated (connected ones)

        // console.log("selected node:", currentNode);

        let toCheckNodeList = [];

        currentNode.connectedPathId.forEach((connectedPathId) => {
            // GET CONNECTED NODE OBJECT
            let connectedNode = this.idToNode(connectedPathId);

            // FIND COST OF PATH
            let connectedPathCost = this.costOfPath(currentNode, connectedNode);

            if (connectedNode.visited == false){
                // ADD TO LIST
                toCheckNodeList.push([connectedNode, connectedPathCost]);
            }
        });
        // THEN CHECK IF THE CURRENTNODE IS IN ANY OTHER NODE'S PATHID

        // LOOP THROUGH ALL NODES
        createdMap.forEach((node) => {

            // IF NODE'S PATHID LIST CONTAINS CURRENTNODE'S ID
            if (node.connectedPathId.includes(currentNode.id)){
                // IF NODE IS NOT IN THE CHECKNODELIST ALREADY
                if (toCheckNodeList.includes(node) == false){
                    // ADD NODE TO THE CHECKLIST
                    let connectedPathCost = this.costOfPath(currentNode, node);
                    toCheckNodeList.push([node, connectedPathCost]);
                }
            }

        });

        // console.log("connected Nodes to be checked:", toCheckNodeList);

        let currentNodeG = currentNode.g;


        // Go through each node, if the f value is undefined or lower than previous f value, update node accordingly
        // console.log("updating connected nodes");
        toCheckNodeList.forEach((nodeAndCost) => {
            let node = nodeAndCost[0];
            // console.log("-=-=- checking node:" + node.id);
            if (node.visited){
                // console.log("node already visited, skipped.")
            }
            else{
                let travelToNodeCost = nodeAndCost[1];

            // console.log("node to be updated:", node);
            // console.log("the cost to travel to this node:", travelToNodeCost);

            // If connected node's g is undefined, set it

            if (node.g == -1){
                // console.log("this node is new, setting g, f, previousNode")
                node.g = currentNode.g + travelToNodeCost;
            }

            // If connected Node's f is undefined, set it 
            if (node.f == -1){
                node.f = node.g + node.heuristic;
            }
            // if connected node has no previous node, then set it
            if (node.previousNode == -1){
                node.previousNode = currentNode.id;
            }

            // If the connected node's f value is higher than new g value, replace higher value with smaller

            if ((currentNodeG + travelToNodeCost + node.heuristic) < node.f){
                console.log("this node's previous f value is higher than current, so update it.");
                console.log("-=-= previous:");
                console.log("node.g = ",node.g);
                console.log("node.f = ",node.f);
                node.g = travelToNodeCost + currentNodeG;
                node.f = node.g + node.heuristic;
                node.previousNode = currentNode.id;
                console.log("-=-= after:");
                console.log("node.g = ",node.g);
                console.log("node.f = ",node.f);
            }
            }
            

        });
        // Set this node to visited!
        // console.log("set visited to true!");
        currentNode.visited = true;

    }


    costOfPath(firstNode, secondNode){
        let firstDistanceX = firstNode.x;
        let firstDistanceY = firstNode.y;
        let secondDistanceX = secondNode.x;
        let secondDistanceY = secondNode.y;

        let distanceX = secondDistanceX - firstDistanceX;
        let distanceY = secondDistanceY - firstDistanceY;

        let distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));

        return distance;

    }

    idToNode(id){
        let returnNode = null;
        if (this.nodeList){
            this.nodeList.forEach((node) => {
                if (node.id == id){
                    returnNode = node;
                    
                }
            });
            // NO ID FOUND
        }
        return returnNode;
        
    }

    updateAllHeuristic(){
        // GET THE END NODE
        let endNode = null;
        this.nodeList.forEach((node) => {

            if (node.isItEnd){
                endNode = node;
            }

        });

        // GET X AND Y OF END NODE
        let endX = endNode.x;
        let endY = endNode.y;

        
        // GET X AND Y OF EACH NODE

        this.nodeList.forEach((node) => {

            // IF NOT END NODE
            if (node.isItEnd == false){

                let startX = node.x;
                let startY = node.y;

                // CALCULATE DISTANCE

                let distanceX = endX - startX;
                let distanceY = endY - startY;

                // console.log(distanceX);
                // console.log(distanceY);

                let distance = Math.round(Math.sqrt((distanceX ** 2) + (distanceY ** 2)));

                // console.log(distanceX ** 2);
                
                // MULTIPLY H BY MULTIPLIER
                distance *= this.heuristicMult;
                
                node.heuristic = distance;

            }

        });

    }

}

class Node{

    constructor(id, x, y, isItStart, isItEnd){
        this.id = id;
        this.x = x;
        this.y = y;

        this.isItStart = isItStart;
        this.isItEnd = isItEnd; 
        this.visited = false;

        this.defaultColor = YELLOW;
        if (this.isItStart){
            // console.log("SET THE START");
            this.defaultColor = GREEN;
        }
        if (this.isItEnd){
            this.defaultColor = RED;
        }
        this.activeColor = this.defaultColor;

        this.selectedColor = PURPLE;

        this.hoverColor = BLUE;

        this.isItHovered = false;
        this.isItSelected = false;

        this.partOfFinalLine = false;
        this.finalLineColor = BLUE;

        // g is the cost from the start. (-1 means not set)
        this.g = -1;
        // heuristic is the approximate added cost depending on distance from end
        this.heuristic = 0;
        // f = g + h (-1 means not set)
        this.f = -1;
        // previousNode is the prior node connection (-1 means not set)
        this.previousNode = -1;

        // E.G. [(2, 5), (3, 10), (7, 3)]
        // [nodeID, CostToTravel]
        // Travel to node 2 for cost: 5
        this.connectedPathId = [];

    }

    draw(){
        // update color depending on if it's selected by mouse
        this.updateColor();
        // console.log("DRAWING THE NODE");
        this.drawConnectionLines();
        drawCircleGrid(this.x, this.y, this.activeColor);
        this.writeIdAndCord(); 
    }

    updateColor(){
        // FIRST CHECK IF IT'S SELECTED
        if (this.isItSelected){
            this.activeColor = this.selectedColor;
        }
        else{
            // THEN CHECK IF IT'S HOVERED
            if (this.isItHovered){
                this.activeColor = this.hoverColor;
            }
            else{
                this.activeColor = this.defaultColor;
            }
        }

    }

    drawConnectionLines(){

        this.connectedPathId.forEach((Id) => {

            let connectedNode = idToNode(Id);
            let color = null;
            if (this.visited || connectedNode.visited == true){
                color = GREEN;
            }
            else{
                color = RED;
            }
            if (this.partOfFinalLine && connectedNode.partOfFinalLine){
                color = this.finalLineColor;
            }
            drawLineGrid([this.x, this.y],[connectedNode.x, connectedNode.y], color);

        });
    }

    writeIdAndCord(){
        let lengthOfABox = CANVAS_WIDTH / 50
        let heightOfABox = CANVAS_HEIGHT / 50
        let x = this.x * lengthOfABox
        let y = this.y * heightOfABox

        writeText(this.id, 20, 0, false, x, y + 3, BLACK, 100);
        writeText("g: " + Math.round(this.g), 20, 0, false, x, y + 30, BLACK, 100);
        writeText("h: " + Math.round(this.heuristic), 20, 0, false, x, y + 60, BLACK, 100);
        writeText("f: " + Math.round(this.f), 20, 0, false, x, y + 90, BLACK, 100);
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

class InfoBox{
    constructor(x, y, width, height, color, text, textSize, styleId){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.text = text;
        this.textSize = textSize;
        this.styleId = styleId;
    }
    draw(){
        drawBox(this.x, this.y, this.width, this.height, this.color);
        this.write();
    }
    write(){
        writeText(this.text, this.textSize, this.styleId, false, this.x + (this.width / 2), this.y + (this.height / 2) + (this.textSize / 2), BLACK, this.width);
    }


}


class Editing{
    
    constructor(){

        this.editingEnabled = false;
        this.hoveringNode = -1;
        this.holdingNode = -1;
        this.distanceToCheckNode = 25;
        this.mousePosX = 0;
        this.mousePosY = 0;


        this.sameIteration = false;

        // index 0 = move
        // index 1 = add Lines
        // index 2 = delete nodes
        // index 3 = add nodes

        this.enableState = [false, false, false, false];
    }

    enableNewState(index){
        this.sameIteration = true;
        for (let i=0;i < this.enableState.length;i++){
            this.enableState[i] = false;
        }
        this.enableState[index] = true;
    }
    disableState(index){
        this.enableState[index] = false;
    }

    update(){

        if (this.editingEnabled && !this.sameIteration){

            if (this.enableState[0]){
                this.leftClickMove();
            }
            if (this.enableState[1]){
                this.leftClickAddLine();
            }
            if (this.enableState[2]){
                this.deleteNode();
            }
            if (this.enableState[3]){
                this.addNode();
            }

        }
        this.sameIteration = false;
        
    }

    addNode(){
        console.log("started adding node");

        let newHoveringNode = this.closestNodeWithinRange();
        this.mousePosToCordGrid();


        console.log(this.mousePosX, this.mousePosY);

        let nextSmallest = getNextSmallestIdNode();

        let tempNode = new Node(nextSmallest, pixelToCord(this.mousePosX), pixelToCord(this.mousePosY), false, false);
        tempNode.draw();
        // createdMap.push(tempNode);
        // testGame.updateNodeList();

        // let removeTempNode = true;

        if (click){
            createdMap.push(tempNode);
            testGame.updateNodeList();
            
        }
        console.log("ended adding node");
    }

    deleteNode(){

        let newHoveringNode = this.closestNodeWithinRange();

        // IF HOVERING OVER A NODE
        if (newHoveringNode != -1){
                
            // IF YOU WERE ALREADY HOVERING OVER A NODE, THEN UNHOVER THAT NODE
            if (this.hoveringNode != -1){
                this.hoveringNode.isItHovered = false;
            }
            // SET THE NEW NODE TO THE HOVERING NODE
            this.hoveringNode = newHoveringNode;
            this.hoveringNode.isItHovered = true;
            
            // CLICKED WHILE HOVERING NODE
            if (click){
                // DELETE NODE
                let deleteNode = this.hoveringNode;
                createdMap.forEach((node) => {

                    // if the node is ID is in connectedPathId of any node, remove the ID from connectedPathId
                    let index = node.connectedPathId.indexOf(deleteNode.id);
                    if (index != -1){
                        node.connectedPathId.splice(index, 1);
                    }

                });
                let index = createdMap.indexOf(deleteNode);
                createdMap.splice(index, 1);

                console.log("CLICKED ON NODE");
                testGame.updateNodeList();
                // this.holdingNode = this.hoveringNode;
                // this.holdingNode.isItSelected = true;
                // this.holdingNode.isItHovered = false;
                // this.hoveringNode = -1;
                
            }
        }
        // IF NOT HOVERING OVER A NODE
        if (newHoveringNode == -1){
            if (this.hoveringNode != -1){
                this.hoveringNode.isItHovered = false;
            }
            this.hoveringNode = -1;
        }


    }


    leftClickAddLine(){

        let newHoveringNode = this.closestNodeWithinRange();

        // HOVER If no node is clicked
        if (this.holdingNode == -1){
            // DO HOVERING
            // IF HOVERING OVER A NODE
            if (newHoveringNode != -1){
                
                // IF YOU WERE ALREADY HOVERING OVER A NODE, THEN UNHOVER THAT NODE
                if (this.hoveringNode != -1){
                    this.hoveringNode.isItHovered = false;
                }
                // SET THE NEW NODE TO THE HOVERING NODE
                this.hoveringNode = newHoveringNode;
                this.hoveringNode.isItHovered = true;
                
                // CLICKED WHILE HOLDING NODE
                
                if (click){
                    this.sameIteration = true;
                    console.log("CLICKED ON HOVERED NODE");
                    this.holdingNode = this.hoveringNode;
                    this.holdingNode.isItSelected = true;
                    this.holdingNode.isItHovered = false;
                    this.hoveringNode = -1;
                    
                }

            }
            // IF NOT HOVERING OVER A NODE
            if (newHoveringNode == -1){
                if (this.hoveringNode != -1){
                    this.hoveringNode.isItHovered = false;
                }
                this.hoveringNode = -1;
            }
        }
        // IF HOLDING A NODE
        if (this.holdingNode != -1 && this.sameIteration == false){

            // If you hovered over a node but aren't anymore
            if (newHoveringNode == -1 && this.hoveringNode != -1){
                // disable the previously-hovered node
                this.hoveringNode.isItHovered = false;
                this.hoveringNode = -1;
            }
            // if you are hovering over a new node
            if (newHoveringNode != -1 && newHoveringNode != this.holdingNode){
                
                // IF YOU WERE ALREADY HOVERING OVER A NODE, THEN UNHOVER THAT NODE
                if (this.hoveringNode != -1){
                    this.hoveringNode.isItHovered = false;
                }
                // SET THE NEW NODE TO THE HOVERING NODE
                this.hoveringNode = newHoveringNode;
                this.hoveringNode.isItHovered = true;
                
                // CLICKED WHILE HOVERING NODE ON NEW NODE
                if (click){
                    // this.sameIteration = true;
                    console.log("CLICKED ON THE NEW HOVERED NODE");

                    // IS THERE A LINE FROM "this.holdingNode" and "this.hoveringNode"

                    

                    let holdNodeHasHoverNode = this.holdingNode.connectedPathId.includes(this.hoveringNode.id);

                    let hoverNodeHasHoldNode = this.hoveringNode.connectedPathId.includes(this.holdingNode.id);



                    // THERE IS ALREADY A LINE 
                    if (holdNodeHasHoverNode || hoverNodeHasHoldNode){

                        if (holdNodeHasHoverNode){
                            let index = this.holdingNode.connectedPathId.indexOf(this.hoveringNode.id);
                            this.holdingNode.connectedPathId.splice(index, 1);
                        }
                        if (hoverNodeHasHoldNode){
                            let index = this.hoveringNode.connectedPathId.indexOf(this.holdingNode.id);
                            this.hoveringNode.connectedPathId.splice(index, 1);
                        }
                    }
                    // IF NO LINE, ADD ONE
                    else{

                        this.holdingNode.connectedPathId.push(this.hoveringNode.id);

                    }


                }

            }



            // IF CLICK, DISABLE THE CLICK
            // this.moveNodeToMousePos(this.holdingNode);
            if (click){

                this.holdingNode.isItSelected = false;
                this.holdingNode = -1;
            }

        }
        this.sameIteration = false;

    }



    leftClickMove(){

        this.mousePosToCordGrid();
        
        // if a node is in range
        let newHoveringNode = this.closestNodeWithinRange();

        // HOVER If no node is clicked
        if (this.holdingNode == -1){
            // DO HOVERING
            // IF HOVERING OVER A NODE
            if (newHoveringNode != -1){
                
                // IF YOU WERE ALREADY HOVERING OVER A NODE, THEN UNHOVER THAT NODE
                if (this.hoveringNode != -1){
                    this.hoveringNode.isItHovered = false;
                }
                // SET THE NEW NODE TO THE HOVERING NODE
                this.hoveringNode = newHoveringNode;
                this.hoveringNode.isItHovered = true;
                
                // CLICKED WHILE HOLDING NODE
                
                if (click){
                    this.sameIteration = true;
                    console.log("CLICKED ON HOVERED NODE");
                    this.holdingNode = this.hoveringNode;
                    this.holdingNode.isItSelected = true;
                    this.holdingNode.isItHovered = false;
                    this.hoveringNode = -1;
                    
                }

            }
            // IF NOT HOVERING OVER A NODE
            if (newHoveringNode == -1){
                if (this.hoveringNode != -1){
                    this.hoveringNode.isItHovered = false;
                }
                this.hoveringNode = -1;
            }
        }
        // IF HOLDING A NODE
        if (this.holdingNode != -1 && this.sameIteration == false){
            // IF CLICK, DISABLE THE CLICK
            this.moveNodeToMousePos(this.holdingNode);
            if (click){
                this.holdingNode.isItSelected = false;
                this.holdingNode = -1;
            }

        }
        this.sameIteration = false;

    }

    mousePosToCordGrid(){
        this.mousePosX = mouseHoverPos[0];
        this.mousePosY = mouseHoverPos[1];

        let cordX = pixelToCord(this.mousePosX);
        let cordY = pixelToCord(this.mousePosY);

        // console.log(cordX, cordY);
        return [cordX, cordY];


    }

    moveNodeToMousePos(node){
        this.mousePosX = mouseHoverPos[0];
        this.mousePosY = mouseHoverPos[1];
        let cordX = pixelToCord(this.mousePosX);
        let cordY = pixelToCord(this.mousePosY);

        node.x = cordX;
        node.y = cordY;

    }

    closestNodeWithinRange(){

        let currentClosestNode = -1;
        let currentClosestDistance = -1;

        this.mousePosX = mouseHoverPos[0];
        this.mousePosY = mouseHoverPos[1];
        createdMap.forEach((node) =>{
            let nodeX = gridCordToPixelCord(node.x);
            let nodeY = gridCordToPixelCord(node.y);

            let distanceBetweenMouseAndNode = distanceBetweenPoints([nodeX, nodeY], [this.mousePosX, this.mousePosY])

            if (distanceBetweenMouseAndNode < this.distanceToCheckNode){
                // console.log("within 100 pixels of node!");

                // if no node set within range, then set this one
                if (currentClosestDistance == -1){
                    currentClosestDistance = distanceBetweenMouseAndNode
                    currentClosestNode = node;
                }
                else{
                    if (distanceBetweenMouseAndNode < currentClosestDistance){
                        currentClosestDistance = distanceBetweenMouseAndNode
                        currentClosestNode = node;
                    }
                }

            }
        });
        return currentClosestNode;

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

        this.updateObjectList = [];

        this.activeScreen = false;

    }

    addBackgroundObject(obj){
        this.drawBackgroundObjectList.push(obj);
    }

    removeBackgroundObject(obj){
        let index = this.drawBackgroundObjectList.indexOf(obj);
        if (index != -1){
            this.drawBackgroundObjectList.splice(index, 1);
        }
    }

    resetBackgroundNode(){

        this.drawBackgroundObjectList = [];

        createdMap.forEach((node) => {

            this.addBackgroundObject(node);

        });

    }

    addForegroundObject(obj){
        this.drawForegroundObjectList.push(obj);
    }

    removeForegroundObject(obj){
        let index = this.drawForegroundObjectList.indexOf(obj);
        if (index != -1){
            this.drawForegroundObjectList.splice(index, 1);
        }
    }

    addUIObject(obj){
        this.drawUIObjectList.push(obj);
    }

    removeUIObject(obj){
        let index = this.drawUIObjectList.indexOf(obj);
        if (index != -1){
            this.drawUIObjectList.splice(index, 1);
        }
    }

    addButton(btn){
        this.buttonList.push(btn);
        this.addUIObject(btn);
    }

    removeButton(btn){
        // remove from button list
        let index = this.buttonList.indexOf(btn);
        if (index != -1){
            this.buttonList.splice(index, 1);
        }
        // remove from UIObject List
        this.removeUIObject(btn);
    }

    addUpdateObject(obj){
        this.updateObjectList.push(obj)
    }

    draw(){
        // When drawing, first do background, then foreground, then UI
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
    updateObjects(){
        this.updateObjectList.forEach((object) =>{
            object.update();
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
        let textSize = 30;
        writeText(this.text, textSize, 0, true, this.x + (this.width / 2), this.y + (this.height / 2) + (textSize / 2), this.activeTextColor ,this.width * 0.95);

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
        // console.log("done hover check");
        

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
            if (this.Id == 3){
                clickStepBtn();
                // console.log("done clicking step button");
            }
            if (this.Id == 4){
                clickMapLogBtn();
            }
            if (this.Id == 5){
                clickResetMapBtn();
            }
            if (this.Id == 6){
                enableEditingBtnFunc();
            }
            if (this.Id == 7){
                moveNodeBtnFunc();
            }
            if (this.Id == 8){
                editNodeConnectionBtnFunc();
            }
            if (this.Id == 9){
                removeNodeBtnFunc();
            }
            if (this.Id == 10){
                addNodeBtnFunc();
            }
            if (this.Id == 11){
                randomNodeBtnFunc();
            }
            // console.log("done checking all button");
        }
    }

}

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                              FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------------------

function percentageToPixel(percentage){

    return percentage * (CANVAS_WIDTH/100);
}
function pToP(percentage){
    return percentageToPixel(percentage);
}

function drawBox(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// 1000 px across
// 1000 px down

function pixelToCord(pixel){

    return Math.round(pixel/(CANVAS_HEIGHT/50));

}

function drawBoxGrid(gridX, gridY, color){
    lengthOfABox = CANVAS_WIDTH / 50
    heightOfABox = CANVAS_HEIGHT / 50
    x = gridX * lengthOfABox
    y = gridY * heightOfABox
x/lengthOfABox
x/

    drawBox(x, y, lengthOfABox, heightOfABox, color);

}

// Visually represent the grid
function drawAllGridBox(){

    for (i=0; i < 50; i++){
        for (j=0; j<50; j++){
            if (i % 2 == 0){
                color = BLACK;
                if (j % 2 == 0){
                    color = WHITE;
                }
            }
            else{
                color = WHITE;
                if (j % 2 == 0){
                    color = BLACK;
                }
            }
            drawBoxGrid(i, j, color);
        }
    }

}

function drawCircle(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();  
}

function drawCircleGrid(gridX, gridY, color){
    lengthOfABox = CANVAS_WIDTH / 50
    heightOfABox = CANVAS_HEIGHT / 50
    radius = lengthOfABox;
    x = gridX * lengthOfABox;
    y = gridY * heightOfABox;

    drawCircle(x, y, radius, color);

}

function drawLine(fromPos, toPos, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(fromPos[0], fromPos[1]);
    ctx.lineTo(toPos[0], toPos[1]);
    ctx.stroke();
}

function drawLineGrid(fromGridPos, toGridPos, color){
    lengthOfABox = CANVAS_WIDTH / 50;
    heightOfABox = CANVAS_HEIGHT / 50;
    fromCord = [fromGridPos[0] * lengthOfABox, fromGridPos[1] * heightOfABox];
    toCord = [(toGridPos[0] * lengthOfABox), (toGridPos[1] * heightOfABox)];

    drawLine(fromCord, toCord, color);
}

function writeText(text, textSize, styleId, centered, x, y, color, maxWidth){

    // THERE WILL BE A COUPLE PRE-SET TEXT STYLES, CHOOSE WHICH STYLE WITH NUMBER
    if (styleId == 0)
    {
        ctx.font = textSize.toString() + "px Arial";
        
    } 

    ctx.fillStyle = color;

    if (centered){
        ctx.textAlign = "center";
    }
    ctx.fillText(text, x, y, maxWidth);
    
}

function gridCordToPixelCord(gridCord){

    // 50 = 750
    // 1 = 750/50

    return gridCord * (CANVAS_HEIGHT/50);
}

function distanceBetweenPoints(point1, point2){
    let distanceX = point2[0] - point1[0];
    let distanceY = point2[1] - point1[1];

    let totalDistance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));

    return totalDistance;
}


function colorFinalPath(){
    // IF COMPLETED THE SEARCH
    nextNode = testGame.nextNodeToCheck();
    let finalRouteNodes = [];
    if (nextNode.id == idOfEndNode()){
        // GET A LIST OF ALL NODE ID IN FINAL LINE
        currentID = idOfEndNode();

        while (currentID != 0){
            finalRouteNodes.push(currentID);
            previousNodeID = idToNode(currentID).previousNode
            previousNode = idToNode(previousNodeID)
            currentID = previousNode.id;
        }
        finalRouteNodes.push(currentID);
        // console.log(finalRouteNodes);
    }

    finalRouteNodes.forEach((id) => {

        node = idToNode(id);
        node.partOfFinalLine = true;
    });
}

function getRandomInt(min, max) {
    let difference = max - min + 1
    return min + Math.floor(Math.random() * difference);
  }


function getNextSmallestIdNode(){
    let idList = [];

    createdMap.forEach((node) => {
        idList.push(node.id);
    });
    let nextSmallestNumFound = false;
    let i = 0;
    let nextSmallest = null;
    while (nextSmallestNumFound == false){
        // is "i" in the idList?
        let index = idList.indexOf(i);
        if (index == -1){
            nextSmallest = i;
            nextSmallestNumFound = true;
        }
        i += 1;
    }
    return nextSmallest;

}

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                        BUTTON FUNCTION
// ---------------------------------------------------------------------------------------------------------------------------------

function clickFirstScreen(){
    firstScreen.activeScreen = false;
    secondScreen.activeScreen = true;

}

function clickTutorialBtn(){
    secondScreen.activeScreen = false;
    playScreen.activeScreen = true;

}

function clickStepBtn(){

    // console.log(testGame);
    
    testGame.updateAllHeuristic();

    nextNode = testGame.nextNodeToCheck();
    // console.log("THE NEXT NODE -=-=-=-=-=-=-=-= :",nextNode);

    if (isAlgorithmComplete() == false){
        testGame.updateConnectedNodes(nextNode);
        updateNextNodeBoxText();
    }
}

function isAlgorithmComplete(){
    nextNode = testGame.nextNodeToCheck();
    if (nextNode == null){
        return false;
    }
    if ((nextNode == false) || (nextNode.id == idOfEndNode())){
        return true;
    }
    return false;
}


function getFinalRoute(){
    if (isAlgorithmComplete()){

        let endNode = idToNode(idOfEndNode());
        let startNode = idToNode(idOfStartNode());

        let currentNode = endNode;

        let currentRoute = [];


        while (currentNode.id != startNode.id){

            currentRoute.push(currentNode.id);
            currentNode = idToNode(currentNode.previousNode);

        }
        currentRoute.push(currentNode.id);
        console.log("final route:", currentRoute);
        return currentRoute;

    }
}


function updateNextNodeBoxText(){
    
    nextNode = testGame.nextNodeToCheck();
    // console.log(nextNode);
    
    if (isAlgorithmComplete()){
        nextNodeBox.text = "Next Node: COMPLETE";
        getFinalRoute();
    }else{
        if (nextNode == null){
            nextNodeBox.text = "Next Node: COMPLETE";
        }
        else{
            nextNodeBox.text = "Next Node:" + nextNode.id;
        }
    }

}

function idOfStartNode(){
    let id = -1;
    createdMap.forEach((node) => {
        if (node.isItStart){
            id = node.id;
        }

    });
    return id;
}

function idOfEndNode(){
    let id = -1;
    createdMap.forEach((node) => {
        if (node.isItEnd){
            id = node.id;
        }

    });
    return id;
}

function idToNode(id){
    let nodeWithTheId = -1;
    createdMap.forEach((node) => {
        if (node.id == id){
            nodeWithTheId = node;
        }

    });
    return nodeWithTheId;
}

function clickMapLogBtn(){
    console.log("-=-=-=- CLICKED MAP LOG BUTTON -=-=-=-");

    // GET LAST NODE

    console.log(createdMap);
    let currentStr = "[";
    createdMap.forEach((obj) => {

        if (obj.isItStart){
            currentStr += "[" + obj.x + ", " + obj.y + ", [";
            if (obj.connectedPathId){
                currentStr += obj.connectedPathId.toString();
            }
            currentStr += "], 0],";
        }
        if (obj.isItEnd){
            currentStr += "[" + obj.x + ", " + obj.y + ", [";
            if (obj.connectedPathId){
                currentStr += obj.connectedPathId.toString();
            }
            currentStr += "], 1],";
        }
        if (!obj.isItStart && !obj.isItEnd){
            currentStr += "[" + obj.x + ", " + obj.y + ", [";
            if (obj.connectedPathId){
                currentStr += obj.connectedPathId.toString();
            }
            currentStr += "]],";
        }

    });
    currentStr = currentStr.slice(0, currentStr.length - 1);
    currentStr += "]";
    console.log(currentStr);
}

function clickResetMapBtn(){
    createdMap.forEach((node) => {
        node.g = -1;
        node.f = -1;
        node.previousNode = -1;
        node.visited = false;
        node.partOfFinalLine = false;
        if (node.id == 0){
            visited = true;
        }
    });
    updateNextNodeBoxText();
}

function mapToCreatedMap(map, createdMap){
    for (let i=0; i< map.length; i++){

        let gridX = map[i][0];
        let gridY = map[i][1];

        let isItStartOrEnd = map[i][3];

        let start = false;
        let end = false;

        if (isItStartOrEnd == 0){
            start = true;
        }
        if (isItStartOrEnd == 1){
            end = true;
        }
        
        newNode = new Node(i, gridX, gridY, start, end);
        if (map[i][2]){
            newNode.connectedPathId = map[i][2];
        }
        else{
            newNode.connectedPathId = [];
        }
    
        createdMap.push(newNode);
    
        playScreen.addBackgroundObject(newNode);
    
    }

}

function enableEditingBtnFunc(){

    // IF EDITING IS OFF THEN ENABLE IT
    if (editObj.editingEnabled == false){

        // Disable Next Step Btn
        playScreen.removeButton(doConnectedNodeBtn);

        // Disable Reset Map Button
        playScreen.removeButton(resetMapBtn);

        // Disable Next Node Counter
        playScreen.removeForegroundObject(nextNodeBox);

        // remove the Map 
        playScreen.removeButton(resetMapBtn);

        // Add Move Button
        playScreen.addButton(moveNodeBtn);

        // Add Edit Connection Button
        playScreen.addButton(editNodeConnectionBtn);

        // Add Log Map Button
        playScreen.addButton(logCurrentMapBtn);

        playScreen.addButton(addNodeBtn);
        
        playScreen.addButton(removeNodeBtn);

        playScreen.addButton(randomNodeBtn);

        // Enable Editing
        editObj.editingEnabled = true;
    }

    // IF EDITING IS ON THEN ENABLE IT
    else{

        // enable Next Step Btn
        playScreen.addButton(doConnectedNodeBtn);

        // enable Reset Map Button
        playScreen.addButton(resetMapBtn);

        // enable Next Node Counter
        playScreen.addForegroundObject(nextNodeBox);

        // add reset the Map Button 
        playScreen.addButton(resetMapBtn);

        // remove Move Button
        playScreen.removeButton(moveNodeBtn);

        // remove Edit Connection Button
        playScreen.removeButton(editNodeConnectionBtn);

        // remove Log Map Button
        playScreen.removeButton(logCurrentMapBtn);

        playScreen.removeButton(addNodeBtn);
        
        playScreen.removeButton(removeNodeBtn);

        playScreen.removeButton(randomNodeBtn);

        editObj.editingEnabled = false;
    }

}

function moveNodeBtnFunc(){
    // if move is disabled, enable it
    if (editObj.enableState[0] == false){
        editObj.enableNewState(0);
        moveNodeBtn.boxColor = GREEN;
        editNodeConnectionBtn.boxColor = RED;
        removeNodeBtn.boxColor = RED;
        addNodeBtn.boxColor = RED;
    }
    else{
        editObj.disableState(0);
        moveNodeBtn.boxColor = RED;
    }
}

function editNodeConnectionBtnFunc(){
    // if move is disabled, enable it
    if (editObj.enableState[1] == false){
        editObj.enableNewState(1);
        editNodeConnectionBtn.boxColor = GREEN;
        moveNodeBtn.boxColor = RED;
        removeNodeBtn.boxColor = RED;
        addNodeBtn.boxColor = RED;
    }
    else{
        editObj.disableState(1);
        editNodeConnectionBtn.boxColor = RED;
    }
}

function removeNodeBtnFunc(){
    // if add Node is disabled, enable it
    if (editObj.enableState[2] == false){
        editObj.enableNewState(2);
        removeNodeBtn.boxColor = GREEN;
        moveNodeBtn.boxColor = RED;
        editNodeConnectionBtn.boxColor = RED;
        addNodeBtn.boxColor = RED;
    }
    else{
        editObj.disableState(2);
        removeNodeBtn.boxColor = RED;
    }
}
function addNodeBtnFunc(){
    // if add Node is disabled, enable it
    if (editObj.enableState[3] == false){
        editObj.enableNewState(3);
        addNodeBtn.boxColor = GREEN;
        moveNodeBtn.boxColor = RED;
        editNodeConnectionBtn.boxColor = RED;
        removeNodeBtn.boxColor = RED;
    }
    else{
        editObj.disableState(3);
        addNodeBtn.boxColor = RED;
    }
}

// IF "startOrEndOrDefault" == 0 then default node
// IF "startOrEndOrDefault" == 1 then start node
// IF "startOrEndOrDefault" == 2 then end node

function placeRandomNode(minimumDistance, minGridX, maxGridX, minGridY, maxGridY, startOrEndOrDefault){

    let nodeType = "";

    if (startOrEndOrDefault == 0){
        nodeType = "default";
    }
    if (startOrEndOrDefault == 1){
        nodeType = "start";
    }
    if (startOrEndOrDefault == 2){
        nodeType = "end";
    }

    let minimumDistanceFromNode = minimumDistance;

    let isNewNodeReady = false;

    let newNodeX;
    let newNodeY;

    // I will try placing node 100 times, if it doesn't place one time (because the minimumDistance is too high)
    // THEN i will reduce the minimumDistance by 1 
    // AKA Place node 100 times, if failed, just place it closer than minimum distance
    let attemptNumber = 0;    

    while (isNewNodeReady == false){
        let xPos = getRandomInt(minGridX, maxGridX);
        let yPos = getRandomInt(minGridY, maxGridY);

        let nodeReady = true;
        createdMap.forEach((node) => {
            distanceBetweenNodeAndNewNode = distanceBetweenPoints([node.x, node.y], [xPos, yPos]);
            if (distanceBetweenNodeAndNewNode < (minimumDistanceFromNode - (attemptNumber / 100))){
                nodeReady = false;
            }
        });
        if (nodeReady){
            newNodeX = xPos;
            newNodeY = yPos;
            isNewNodeReady = true;
        }
        
        else{
            attemptNumber += 1;
        }
    }

    let id = getNextSmallestIdNode();
    
    let randNode = null;
    if (nodeType == "start"){
        randNode = new Node(id, newNodeX, newNodeY, true, false);
    }
    if (nodeType == "end"){
        randNode = new Node(id, newNodeX, newNodeY, false, true);

    }
    if (nodeType == "default"){
        randNode = new Node(id, newNodeX, newNodeY, false, false);
    }
    

    createdMap.push(randNode);
    testGame.updateNodeList();

}

function connectNodeToRandomNode(node){
    let listOfDefaultNode = [];
    createdMap.forEach((node) => {
        if (!node.isItStart && !node.isItEnd){
            let numOfConnectionsOut = node.connectedPathId.length;
            let numOfConnectsIn = 0;
            createdMap.forEach((node2) => {

                // if node
                if (node2.connectedPathId.indexOf(node.id) != -1){
                    numOfConnectsIn += 1;
                }

            });
            if (numOfConnectsIn + numOfConnectionsOut < 4){
                listOfDefaultNode.push(node);
            }
            
            
        }
    });

    let doneAdding = false;
    while (doneAdding == false){
        index = getRandomInt(0, listOfDefaultNode.length - 1);
        randNode = listOfDefaultNode[index].id;
        if (randNode.id != node.id){
            node.connectedPathId.push(listOfDefaultNode[index].id);
            listOfDefaultNode.splice(index, 1)
            doneAdding = true;
        }
    } 
    doneAdding = false;
    while (doneAdding == false){
        index = getRandomInt(0, listOfDefaultNode.length - 1);
        randNode = listOfDefaultNode[index].id;
        if (randNode.id != node.id){
            node.connectedPathId.push(listOfDefaultNode[index].id);
            doneAdding = true;
        }
    } 
}



function closestNodeNotInList(nodeId, listOfIdAndDistance){

    let currentClosestNodeId = -1;
    let currentClosestDistance = -1;
    let originalNode = idToNode(nodeId);

    createdMap.forEach((node) =>{
        // console.log("doing node:", node.id);
        let nodeIsOriginalNode = false;
        if (originalNode.id == node.id){
            nodeIsOriginalNode = true;
            // console.log("found original node");
        }

        // console.log(listOfIdAndDistance.length);

        let nodeAlreadyInList = false;
        listOfIdAndDistance.forEach((idAndDistance) => {

            if (idAndDistance[0] == node.id){
                nodeAlreadyInList = true;
                // console.log("node is in the list");
            }

        });
        
        if ((!nodeAlreadyInList) && (!nodeIsOriginalNode)){
            let distanceBetweenOriginalNodeAndThisNode = distanceBetweenPoints([node.x, node.y], [originalNode.x, originalNode.y]);
            // console.log("calculated distance: ", distanceBetweenOriginalNodeAndThisNode);

            // if no node set within range, then set this one
            if (currentClosestDistance == -1){
                currentClosestDistance = distanceBetweenOriginalNodeAndThisNode
                currentClosestNodeId = node.id;
            }
            else{
                if (distanceBetweenOriginalNodeAndThisNode < currentClosestDistance){
                    currentClosestDistance = distanceBetweenOriginalNodeAndThisNode
                    currentClosestNodeId = node.id;
                }
            }
        }

    });
    if (currentClosestNodeId == -1){
        return [-1, -1];
    }
    // console.log([currentClosestNodeId, currentClosestDistance]);
    return [currentClosestNodeId, currentClosestDistance];

}

// NEED A LIST OF:
// finalList = [[nodeId, [[1, 23], [2, 25]], []], [nodeId, [], [], []], ]


function getFinalListForClosestNode(){

    // for each node
    // run closestNodeNotInList to get the closest with distance
    // until returns [-1, -1]
    let currentFinalList = [];
    createdMap.forEach((node) => {

        let currentAddition = [];

        currentAddition.push(node.id);
        currentAddition.push([]);
    
        let currentClosestNodeIdAndDistance = closestNodeNotInList(node.id, []);
        currentAddition[1].push(currentClosestNodeIdAndDistance);
    
        while(currentClosestNodeIdAndDistance[0] != -1){
    
            // currentAddition[1].push(currentClosestNodeIdAndDistance);
    
            currentClosestNodeIdAndDistance = closestNodeNotInList(node.id, currentAddition[1]);
            if (currentClosestNodeIdAndDistance[0] != -1){
                currentAddition[1].push(currentClosestNodeIdAndDistance);
            }
        
    
        }
        currentFinalList.push(currentAddition);
        
    });

    // console.log(currentAddition);


    // console.log(currentFinalList);
    return currentFinalList;

}

function getOrderForFinal(closestConnectionList){

    let order = [];
    
    // console.log(closestConnectionList);

    tempClosestConnectionList = closestConnectionList.slice();
    startNode = idToNode(idOfStartNode());
    tempClosestConnectionList.forEach((connectionList) => {

        // 
        if (connectionList[0] == startNode.id){
            // console.log("found it");
            order.push(startNode.id);

            connectionList[1].forEach((nodeIdAndDistance) => {

                order.push(nodeIdAndDistance[0]);

            });

        }

    });
    return order;

}

function connectClosestLines(nodeId, closestConnectionList, numOfConnection){

    node = idToNode(nodeId);
    // console.log("currentClosestLines node:", nodeId);

    connectedNodesAndIdList = [];

    closestConnectionList.forEach((nodeIdAndConnections) => {
        if (nodeId == nodeIdAndConnections[0]){
            connectedNodesAndIdList = nodeIdAndConnections[1];
        }
    });

    let connectedTimes = 0;
    // console.log("LIST: ",connectedNodesAndIdList);
    for(i=0;i<connectedNodesAndIdList.length;i++){

        if (connectedTimes < numOfConnection){
            connectToNodeId = connectedNodesAndIdList[i][0];
            // console.log(connectToNodeId);
            connectToNode = idToNode(connectToNodeId);
            if ((node.connectedPathId.indexOf(connectToNodeId) == -1) && (connectToNode.connectedPathId.indexOf(nodeId) == -1)){

                node.connectedPathId.push(connectToNodeId);
                connectedTimes += 1;
            }
        }
        

    }

}








// HOW THE RANDOM BUTTON WILL WORK:
// 1. Get a list of all possible routes
//   - start from "start" node.
//   - go to all connected nodes
//   - from each connected node, check all connected nodes that aren't already in the list
//   - if at any point, node has no connected nodes then end the loop
//   - if the connected node is "end node" then add this to a global list

// 2. determine the distance each route travelled, order in terms of fastest to slowest
// 3. Get x number of routes (randomly) with atleast half of the number of nodes on the map (making sure all nodes have atleast a single connection, if not, add a route with it)
// 4. apply route connections to the final map.
// 5. complete

// 6. extra, be able to randomize the current layout's route with a button


// first currentNodeIdTravelledList will be empty
let finalRoutes = [];
function getAllCombinations(startNodeId, endNodeId, currentNodeIdTravelledList, maxLenList){

    if (currentNodeIdTravelledList.length > maxLenList){
        // console.log("this route is too long");
        return;
    }

    if (currentNodeIdTravelledList[currentNodeIdTravelledList.length - 1] == endNodeId){
        // console.log("this route has finished");
        // add this route to the final Routes
        finalRoutes.push(currentNodeIdTravelledList);
    }
    else{
        // if no list, then start with startNode
        // console.log("currentNodeList:", currentNodeIdTravelledList);
        if (currentNodeIdTravelledList.length == 0){
            // console.log("there is no map, started loop with first node");
            getAllCombinations(startNodeId, endNodeId, [startNodeId], maxLenList);   
        }
        else{
            // console.log("route not finished");
            let runRecursionOnList = [];
            for(i = 0; i < createdMap.length; i++){
                // console.log(i);
                node = createdMap[i];
                // console.log("currently on node:" ,node.id);
                // is this not node in the list? then start loop with this new one it,
                if (!currentNodeIdTravelledList.includes(node.id)){
                    // console.log("found new node to add: ", node.id);
                    let newCurrentNodeIdTravelledList = currentNodeIdTravelledList.slice();
                    newCurrentNodeIdTravelledList.push(node.id);
                    runRecursionOnList.push(newCurrentNodeIdTravelledList);
                    // console.log("done adding new node", node.id);
                }
            }
            // console.log("first loop run recursion on:", runRecursionOnList);
            runRecursionOnList.forEach((route) => {
                getAllCombinations(startNodeId, endNodeId, route, maxLenList);
            })
        }
    }

}

function calculateRouteDistance(routeList){

    for(i=0; i< routeList.length; i++){

        route = routeList[i];
        let totalDistance = 0;

        for(j=0; j<route.length - 1;j++){
            firstNode = idToNode(route[j]);
            secondNode = idToNode(route[j+1]);
            totalDistance += distanceBetweenPoints([firstNode.x, firstNode.y],[secondNode.x, secondNode.y]);
        }
        routeList[i].push(Math.floor(totalDistance));
    }
}

function bubbleSortRouteDistance(routeListAfterDistance){

    for(i=0;i<routeListAfterDistance.length;i++){
        // console.log("doing");

        for(j=0;j<routeListAfterDistance.length-1-i;j++){
            // console.log("doing2");

            
            let leftDistance = routeListAfterDistance[j][routeListAfterDistance[j].length-1];
            // console.log("leftDistance: ", leftDistance);
            
            let rightDistance = routeListAfterDistance[j+1][routeListAfterDistance[j+1].length-1];
            // console.log("rightDistance: ", rightDistance);
            if (leftDistance > rightDistance){
                swap(routeListAfterDistance, j, j+1);
                // console.log("swapped");
            }

        }
    }
}

function swap(list, index1, index2){
    let temp = list[index1];
    list[index1] = list[index2];
    list[index2] = temp;
}

function addConnectionToMap(firstId, secondId){


    fromNode = idToNode(firstId);
    toNode = idToNode(secondId);
    
    let alreadyConnected = false;
    if (fromNode.connectedPathId.indexOf(toNode) != -1){
        alreadyConnected = true;
    }
    if (toNode.connectedPathId.indexOf(fromNode) != -1){
        alreadyConnected = true;
    }
    if (!alreadyConnected){
        fromNode.connectedPathId.push(toNode.id);
    }
     
}

// addRouteToMap([1,2,3,4,54]);


function randomNodeBtnFunc(){
    // REMOVE ALL NODES

    createMapWithMinimumOptimalRoute(4);

}

function createMapWithMinimumOptimalRoute(minimumNumberOfNodeInOptimalRoute){


    createdMap = [];
    testGame.updateNodeList();

    placeRandomNode(10, 5, 10, 40, 45, 1);
    placeRandomNode(10, 40, 45, 10, 15, 2);
    placeRandomNode(10, 0, 48, 10, 48, 0);
    placeRandomNode(10, 0, 48, 10, 48, 0);
    testGame.updateNodeList();
    closestConnectionList = getFinalListForClosestNode();
    console.log(closestConnectionList);
    orderToConnectLine = getOrderForFinal(closestConnectionList);
    console.log("order:", orderToConnectLine);
    orderToConnectLine.forEach((id) =>{
        connectClosestLines(id, closestConnectionList, 2);
    });

    let doneMaking = false;
    let counter = 0;
    while (!doneMaking){
        while (isAlgorithmComplete() == false){
            clickStepBtn();
        }
        if (getFinalRoute().length >= minimumNumberOfNodeInOptimalRoute){
            doneMaking = true;
            clickResetMapBtn();
        }
        else{
            createdMap = [];
            testGame.updateNodeList();

            placeRandomNode(10, 5, 10, 40, 45, 1);
            placeRandomNode(10, 40, 45, 10, 15, 2);
            placeRandomNode(10, 0, 48, 10, 48, 0);
            for(i=0;i<counter/10;i++){
                placeRandomNode(10, 0, 48, 10, 48, 0);
                console.log("i: ", i);
            }
            
            testGame.updateNodeList();
            closestConnectionList = getFinalListForClosestNode();
            console.log(closestConnectionList);
            orderToConnectLine = getOrderForFinal(closestConnectionList);
            console.log("order:", orderToConnectLine);
            orderToConnectLine.forEach((id) =>{
                connectClosestLines(id, closestConnectionList, 2);
            });
            counter += 1;
            
        }
        console.log("counter:", counter);
    }

}

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      MOUSE REGISTER
// ---------------------------------------------------------------------------------------------------------------------------------


// -=-=- FINDING OUT THE USER'S MOUSE POSITION -=-=- 
var globalMouseClickX = 0;
var globalMouseClickY = 0;
var globalMouseHoverX = 0;
var globalMouseHoverY = 0;

var click = false;
var holding = false;

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
    holding = true;
    click = true;
}
document.body.onmouseup = function(){
    // console.log("LEFT CLICKED UP");
    holding = false;
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

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      DECLARING VARIABLES
// ---------------------------------------------------------------------------------------------------------------------------------


// -=-=-=-=-=-=-=-=- GAME OBJECT -=-=-=-=-=-=-=-=-
testGame = new Game();

// let map = [[5, 35, [1, 2, 3]], 
//             [7, 13, [3, 5]], 
//             [10, 45, [6]], 
//             [15, 32, [7]], 
//             [32, 15, [10]], 
//             [20, 15, [4]], 
//             [37, 48, [8, 9]], 
//             [25, 30, [4, 8]], 
//             [39, 30, [9]], 
//             [45, 45, [10]],
//             [47, 7]];








// let map = [
//     [5, 35, []], 
//     [5, 8, [0,3,5]],
//     [10, 45, [0, 6]],
//     [15, 32, [0, 7]],
//     [31, 7, [10]],
//     [19, 7, [4]],
//     [37, 48, [8,9]],
//     [25, 30, [4,8]],
//     [39, 30, [9]],
//     [45, 45, [10]]
//     ,[47, 7, []]];

// index 1: xPos (from 1-50)
// index 2: yPos (from 1-50)
// index 3: connected Nodes list of indexes (index in the map)
// index 4: 0 = startNode, 1 = endNode

// let map = [
//     [5, 35, [], 0],
//     [4, 19, [0,3,5]],
//     [10, 45, [0,6]],
//     [15, 32, [0,7]],
//     [36, 22, [10]],
//     [13, 18, [4]],
//     [37, 48, [8,9]],
//     [25, 30, [4,8]],
//     [48, 30, [9]],
//     [33, 37, [10]],
//     [44, 10, [], 1]
//                 ];



// let map = [[5, 35, [], 0],[4, 19, [0,3,5]],[10, 45, [0,6]],[15, 32, [0,7]],[25, 11, [10]],[13, 18, [4]],[37, 48, [8,9]],[25, 30, [4,8]],[48, 30, [9]],[33, 37, [10]],[44, 10, [], 1]];
// let map = [[5, 35, [], 0],[4, 19, []],[10, 45, []],[15, 32, []],[36, 22, []],[13, 18, []],[37, 48, []],[25, 30, []],[48, 30, []],[33, 37, []],[44, 10, [], 1]];
let map = [[6, 45, [], 0],[42, 10, [], 1],[4, 32, []],[9, 35, []],[22, 33, []],[35, 38, []],[16, 20, []],[5, 18, []],[9, 27, []],[21, 15, []],[9, 10, []],[33, 23, []],[40, 32, []],[32, 14, []],[47, 16, []]];

let createdMap = [];



// -=-=-=-=-=-=-=-=- FIRST SCREEN -=-=-=-=-=-=-=-=-


let startGameBtn = new Button(0, pToP(25), pToP(60), pToP(50), pToP(20), YELLOW, GREEN, "Click To Start!", BLACK, WHITE);

let firstScreenBG = new Box(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, AQUA);

let firstScreen = new Screen(0, "firstScreen", [startGameBtn]);
firstScreen.activeScreen = true;
firstScreen.addBackgroundObject(firstScreenBG);
firstScreen.addUIObject(startGameBtn);


// -=-=-=-=-=-=-=-=- SECOND SCREEN -=-=-=-=-=-=-=-=-

let tutorialGameBtn = new Button(1, pToP(25), pToP(20), pToP(50), pToP(20), YELLOW, GREEN, "Tutorial", BLACK, WHITE);

let levelGameBtn = new Button(2, pToP(25), pToP(50), pToP(50), pToP(20), YELLOW, GREEN, "Play", BLACK, WHITE);

let secondScreenBG = new Box(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, PURPLE);

let secondScreen = new Screen(1, "secondScreen", [tutorialGameBtn, levelGameBtn]);
secondScreen.addBackgroundObject(secondScreenBG);
secondScreen.addUIObject(tutorialGameBtn);
secondScreen.addUIObject(levelGameBtn);


// -=-=-=-=-=-=-=-=- GAME SCREEN -=-=-=-=-=-=-=-=-

let doConnectedNodeBtn = new Button(3, pToP(4), pToP(5), pToP(20), pToP(5), YELLOW, GREEN, "Next Step", BLACK, WHITE);

let logCurrentMapBtn = new Button(4, pToP(52), pToP(5), pToP(20), pToP(5), YELLOW, GREEN, "Log Map", BLACK, WHITE);

let resetMapBtn = new Button(5, pToP(28), pToP(5), pToP(20), pToP(5), YELLOW, GREEN, "Reset Map", BLACK, WHITE);

let nextNodeBox = new InfoBox(pToP(52), pToP(5), pToP(20), pToP(5), YELLOW, "Next Node: 0", 30, 0);

let enableEditingBtn = new Button(6, pToP(76), pToP(5), pToP(20), pToP(5), YELLOW, GREEN, "Enable Editing", BLACK, WHITE);

let moveNodeBtn = new Button(7, pToP(4), pToP(5), pToP(20), pToP(5), RED, YELLOW, "Move Node", BLACK, WHITE);

let editNodeConnectionBtn = new Button(8, pToP(28), pToP(5), pToP(20), pToP(5), RED, YELLOW, "Edit Connections", BLACK, WHITE);

let removeNodeBtn = new Button(9, pToP(28), pToP(12), pToP(20), pToP(5), RED, YELLOW, "Remove Node", BLACK, WHITE);

let addNodeBtn = new Button(10, pToP(4), pToP(12), pToP(20), pToP(5), RED, YELLOW, "Add Node", BLACK, WHITE);

let randomNodeBtn = new Button(11, pToP(76), pToP(12), pToP(20), pToP(5), YELLOW, GREEN, "Randomise Node", BLACK, WHITE);

let playScreen = new Screen(2, "secondScreen", []);
playScreen.addButton(doConnectedNodeBtn);
playScreen.addButton(resetMapBtn);    
playScreen.addForegroundObject(nextNodeBox);
playScreen.addButton(enableEditingBtn);


mapToCreatedMap(map, createdMap);
testGame.updateNodeList();

closestConnectionList = getFinalListForClosestNode();
    console.log(closestConnectionList);
    orderToConnectLine = getOrderForFinal(closestConnectionList);
    console.log("order:", orderToConnectLine);
    orderToConnectLine.forEach((id) =>{
        connectClosestLines(id, closestConnectionList, 1);
    });


// console.log(createdMap);
// getAllCombinations(0, 1, [], 4);
// console.log("final map:");
// console.log(finalRoutes);

// calculateRouteDistance(finalRoutes);
// console.log(finalRoutes);

// bubbleSortRouteDistance(finalRoutes);
// console.log(finalRoutes);


// for(i=0;i<30;i++){
//     if (finalRoutes[i].length == 5){
//         addConnectionToMap(finalRoutes[i][1], finalRoutes[i][2]);
//     }
// }

// -=-=-=-=-=-=-=-=- EDITING SETUP -=-=-=-=-=-=-=-=-

editObj = new Editing();
playScreen.addUpdateObject(editObj);



screenList = [firstScreen, secondScreen, playScreen];

// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      MAIN PROGRAM LOOP
// ---------------------------------------------------------------------------------------------------------------------------------



function mainLoop(){
    // console.log("looping");
    // console.log(playScreen);

    mouseClickPos = mouseClickPosInCanvas();
    
    mouseHoverPos = mouseHoverPosInCanvas();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    
    screenList.forEach((screen) => {
        if (screen.activeScreen){
            screen.draw();
            screen.loadButtons();
            screen.updateObjects();
        }
    });

    if (holding){
        // console.log("HOLDING");
    }
    colorFinalPath();

    click = false;
    requestAnimationFrame(mainLoop);

}
mainLoop()