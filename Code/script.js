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

// const carImage = new Image();
// carImage.src = 'Images/car.png';

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

// GRID
const GRID_LENGTH = 50;
const GRID_HEIGHT = 50;



// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      CLASSES
// ---------------------------------------------------------------------------------------------------------------------------------

// -=-=-=-=- Game Class -=-=-=-=- 

// -=-=- Attributes -=-=-
// nodeList (List) -> A list of all nodes
// heuristicMult (Integer) -> a multiplier to calculate heuristics
// isMapComplete (Boolean) -> check if, when creating the map, is there a start and end node. if not, can't run this map
// isSimulationComplete (Boolean) -> check if the simulation is done
// 

// -=-=- Methods -=-=-
// updateNodeList()
// anyNodeRemaining()
// nextNodeToCheck()
// updateConnectedNodes(currentNode)
// costOfPath(firstNode, secondNode)
// idToNode(id)
// updateAllHeuristic()

// What should be done:
// Complete - Made
// Method: SetMap(map) -> input a map which sets the node arrangement
//                        first Check if every node is valid by checking if they have an x, y and a list (could be empty) for connected nodes
//                        run "isMapRunable()" to check for start/end node 
//                        Sets "nodeList" to the map by creating Nodes
//                        updateHeuristics of all nodes

// Incomplete
// Method: runNextNode() -> 
//                          Check boolean "isMapComplete" if false, then don't run this method
//                          Check boolean "isMapComplete" if true, then continue
//                          get the next node to check with method "getNextNode()"
//                          if "getNextNode()" is null, don't continue, set "isSimulationComplete" to true
//                          if "getNextNode()" returns a node, get all connected nodes and put them in a list "connectedNodeList"
//                          for each node in "connectedNodeList", run the node's method "updateValues(node, distance)"
//                          get the distance from method distanceBetweenPoints()
//                          
// 

// Complete
// Method: isMapRunable() -> Find out if map has all the requirements to run "runNextNode()", this includes:
//                          Check if there is a start and end node
//                           

// Complete
// Method: getNextNode() -> Check boolean "isMapComplete", only run if true
//                          If no node is found, return "null"
//                          check if the first Node is already "visited", if not, return the first Node
//                          Go through nodeList and for every visited node, get all the connected Nodes from method "getConnectedNodeList(Node)"
//                          add all connected Nodes to a list "nodesToCheckList" (make sure there are no duplicates by checking if node is already in list)
//                          if "nodesToCheckList" has a length of 0, return null
//                          go through all nodes in the "nodesToCheckList" and return node with lowest f value

// Complete
// Method: getConnectedNodeList(Node) -> for every node id in the "connectedNodeList", get the node with "getNodeFromId(node)"
//                                       if the node returns "null" then do nothing
//                                       if a node is returned, add it to a list
//                                       for every node in the nodeList, check if that node's connectedNodeList contains the original node
//                                       if the other node, contains original node, add the other node to the list
//                                       return the list (could be empty)

// Complete
// Method: getNodeFromId(node) -> Loop through nodeList and return the node with the correct id
//                                if no node is found, return "null"


// -=-=-=-=- Node Class -=-=-=-=- 

// -=-=-=- Attributes -=-=-=-=-
// visited (boolean) -> if this node's connected node's have been checked
// checked (boolean) -> if this node has been checked by any of it's connected nodes

// g (int) -> shortest distance
// heuristic -> Distance from end to this node
// f -> g + heuristic
 
// -=-=-=- Methods -=-=-=-
// updateValues(previousNode, distanceFromPrevious) -> if node not visited
//                                                  if checked is false, set g to previousNode.g + distanceFromPrevious, set f to new g + heuristic,
//                                                      set previousNodeId (node's attribute) to previousNode.id
//                                                  if checked is true, check if previousNode.g + distanceFromPrevious is less than
//                                                      previously set g, if so, 


// console.log("testing", 0/100)

let offScreenCanvas = document.createElement('canvas');
let offScreenCtx = offScreenCanvas.getContext('2d');


// HOW THE GAME WILL WORK:
// USER SPAWNS IN AT STARTNODE
// WHILE USER NOT AT END NODE:
//      GET USER'S NEXT POSSIBLE NODES
//      IF USER PRESS A: MOVE TO NODE ON LEFT
//      IF USER PRESS D: MOVE TO NODE ON RIGHT
//      IF USER PRESS S: TRY MOVING BACK (IF NO PREVIOUS NODES THEN DO NOTHING (MAYBE PLAY A SOUND ERROR))
//      IF USER PRESS W: GO TO THIS NODE 
// 
// 
class Player{
    constructor(spawnNode){
        this.x = 0;
        this.y = 0;
        this.atNode = spawnNode;
        this.nextNode;
        this.angle = 0;
        this.drewCar = false;
        this.carImage;
        this.width = 50;
        this.height = 20;
        this.layerToDraw = "foreground";

        this.updatedOptions = false;
        this.options = [];
        this.selectedOptionIndex;

        this.animating = false;
        this.percentageComplete = 0;

        this.updateCord(this.atNode);

    }

    update(gameObj){
        // console.log("doing");
        if (this.updatedOptions == false){
            this.getOptions(this.atNode, gameObj);
            this.updatedOptions = true;
            // this.closestNodeToAngle(angle);

            // set the selectedOptionIndex to the closest angle node to the previous node

            this.selectedOptionIndex = this.closestIndexNodeToAngle(this.angle);   
        }

        this.draw();

        if (this.animating == false){
            
            if (aDown){
                // console.log("turn it left");
                this.turnLeft();
                // console.log("facing node id:", this.options[this.selectedOptionIndex][0].id);
            }
            if (dDown){
                // console.log("turn it right");
                this.turnRight();
                // console.log(this.selectedOptionIndex);
            }
            if (wDown){
                // console.log("go forward");
                this.goForward();
                // console.log(this.selectedOptionIndex);
            }
        }else{
            let atNodeX = gridCordToPixelCord(this.atNode.x);
            let atNodeY = gridCordToPixelCord(this.atNode.y);
            let toNodeX = gridCordToPixelCord(this.nextNode.x);
            let toNodeY = gridCordToPixelCord(this.nextNode.y);
            // console.log("at node:", this.atNode);
            // console.log("next node:", this.nextNode);
            this.animateMovement([atNodeX, atNodeY], [toNodeX, toNodeY], 200);
        }
    }
    
    turnLeft(){
        // turn true if do the turn
        let turnLeftSuccess = false;
        let currentAngle = this.options[this.selectedOptionIndex][1];
        // console.log("currentAngle: ", currentAngle);
        let tempSelectedOptionIndex = this.selectedOptionIndex - 1
        if (tempSelectedOptionIndex == -1){
            tempSelectedOptionIndex = this.options.length - 1
        }
        // get angle of closest node to left
        let leftNodeAngle = this.options[tempSelectedOptionIndex][1];
        // console.log("leftNodeAngle: ", leftNodeAngle);

        if (leftNodeAngle > currentAngle){
            let extraSpace = 180 - currentAngle
            if (extraSpace > 0){
                let overlapWithLeftNode = 360 - leftNodeAngle;
                if (extraSpace > overlapWithLeftNode){
                    turnLeftSuccess = true;
                }
            }
        }
        if (currentAngle > leftNodeAngle){
            let differenceInAngle = currentAngle - leftNodeAngle;
            if (differenceInAngle <= 180){
                turnLeftSuccess = true;
            }
        }
        
        if (turnLeftSuccess){
            this.selectedOptionIndex -= 1
            if (this.selectedOptionIndex == -1){
                this.selectedOptionIndex = this.options.length - 1
            }
            this.drewCar = false;
        }

    }

    turnRight(){
        // turn true if do the turn
        let turnRightSuccess = false;
        let currentAngle = this.options[this.selectedOptionIndex][1];
        // console.log("currentAngle: ", currentAngle);
        let tempSelectedOptionIndex = this.selectedOptionIndex + 1
        if (tempSelectedOptionIndex == this.options.length){
            tempSelectedOptionIndex = 0;
        }
        // get angle of closest node to left
        let rightNodeAngle = this.options[tempSelectedOptionIndex][1];
        // console.log("rightNodeAngle: ", rightNodeAngle);

        if (currentAngle > rightNodeAngle){
            let extraSpace = 180 - (360 - currentAngle)
            if (extraSpace > 0){
                let overlapWithRightNode = rightNodeAngle;
                if (extraSpace > overlapWithRightNode){
                    turnRightSuccess = true;
                }
            }
        }
        if (rightNodeAngle > currentAngle){
            let differenceInAngle = rightNodeAngle - currentAngle;
            if (differenceInAngle <= 180){
                turnRightSuccess = true;
            }
        }
        
        if (turnRightSuccess){
            this.selectedOptionIndex += 1
            if (this.selectedOptionIndex == this.options.length){
                this.selectedOptionIndex = 0
            }
            this.drewCar = false;
        }
    }
    goForward(){
        this.nextNode = this.options[this.selectedOptionIndex][0];
        this.animating = true;
        // this.updatedOptions = false;
    }

    // speed is the pixels to move per cycle
    animateMovement(fromPosition, toPosition, speed){

        let changeInX = toPosition[0] - fromPosition[0];
        let changeInY = toPosition[1] - fromPosition[1];

        // console.log("changeInX: ", changeInX);
        // console.log("changeInY:", changeInY);
        
        let totalDistance = distanceBetweenPoints(fromPosition, toPosition);
        // console.log("totalDistance:", totalDistance);
        let percentageIncrease = speed/totalDistance;
        // console.log("percentageIncrease:", percentageIncrease);
        let newPercentage = this.percentageComplete + percentageIncrease;

        // console.log("newPercentage:", newPercentage);

        let newX = ((newPercentage/100) * changeInX) + fromPosition[0];

        // console.log("newX:", newX);

        let newY = ((newPercentage/100) * changeInY) + fromPosition[1];

        // console.log("newY:", newY);

        this.percentageComplete = newPercentage;
        
        this.x = newX;
        this.y = newY;
        this.drewCar = false;

        if (this.percentageComplete > 100){
            this.animating = false;
            this.atNode = this.nextNode;
            this.updateCord(this.atNode);
            this.updatedOptions = false;
            this.percentageComplete = 0;
        }

    }

    getOptions(node, gameObj){
        let x = gridCordToPixelCord(node.x);
        let y = gridCordToPixelCord(node.y);
        let nodeAndAngleList = [];
        let connectedNodeList = gameObj.getConnectedNodeList(node);
        // find angle of every node
        connectedNodeList.forEach((connectedNode) => {
            let connectedNodeX = gridCordToPixelCord(connectedNode.x);
            let connectedNodeY = gridCordToPixelCord(connectedNode.y);
            let angle = findBearingBetweenPoints([x, y], [connectedNodeX, connectedNodeY]);
            nodeAndAngleList.push([connectedNode, angle]);
        });
        
        // BUBBLE SORT THE OPTIONS IN CORRECT ORDER

        for(let i = 0; i < nodeAndAngleList.length;i++){

            for(let j = 0; j < nodeAndAngleList.length-1-i;j++){
                let leftAngle = nodeAndAngleList[j][1];
                let rightAngle = nodeAndAngleList[j+1][1];
                if (leftAngle > rightAngle){
                    nodeAndAngleList = swap(nodeAndAngleList, j, j+1);
                }
            }
        }

        this.options = [];
        nodeAndAngleList.forEach((nodeAndAngle) => {
            this.options.push(nodeAndAngle);
        })

    }

    closestIndexNodeToAngle(originalAngle){

        // console.log("started checking closest index");
        originalAngle += 90;
        if (originalAngle >= 360){
            originalAngle -= 360;
        }
        // console.log("original Angle:", originalAngle);

        let closestNode = null;
        let closestNodeAngle = 0;
        let closestNodeIndex = 0;

        this.options.forEach((nodeAndAngle, index) => {
            
            let node = nodeAndAngle[0];
            let angle = nodeAndAngle[1];
            let leftDifference = null;
            let rightDifference = null;
            if (originalAngle > angle){
                leftDifference = originalAngle - angle
                rightDifference = (360 - originalAngle) + angle;
            }else{ // Angle > originalAngle
                leftDifference = angle - originalAngle
                rightDifference = (360 - angle) + originalAngle;
            }
            let smallestAngle = null;
            if (leftDifference > rightDifference){
                smallestAngle = rightDifference;
            }else{
                smallestAngle = leftDifference;
            }
            if (closestNode == null){
                closestNode = node;
                closestNodeAngle = smallestAngle;
                closestNodeIndex = index;
            }else{
                if (smallestAngle < closestNodeAngle){
                    closestNode = node;
                    closestNodeAngle = smallestAngle;
                    closestNodeIndex = index;
                }
            }
        });
        return closestNodeIndex;
    }

    draw(){
        if (!this.drewCar){
            this.angle = this.options[this.selectedOptionIndex][1];
            this.angle -= 90;
            if (this.angle < 0){
                this.angle += 360;
            }
            let temporaryImage = drawPngOnCurrentScreen("playerCar.png", this.x, this.y, this.width, this.height, this.angle, this.layerToDraw);
            this.deleteCarPng(this.carImage);
            this.carImage = drawPngOnCurrentScreen("playerCar.png", this.x, this.y, this.width, this.height, this.angle, this.layerToDraw);
            this.deleteCarPng(temporaryImage);
            4
            this.drewCar = true;
        }
    }

    updateCord(node){
        this.x = gridCordToPixelCord(node.x);
        this.y = gridCordToPixelCord(node.y);
    }

    deleteCarPng(carImage){
        screenList.forEach((screen) => {
            if (this.layerToDraw == "foreground"){
                screen.removeForegroundObject(carImage);
            }
            if (this.layerToDraw == "background"){
                screen.removeBackgroundObject(carImage);
            }
        });
    }
}

class MyImage{
    constructor(imageName, xCenter, yCenter, imageWidth, imageHeight){
        this.imageName = imageName;
        this.image = new Image();
        this.image.src = "Images/" + this.imageName;
        this.x = xCenter;
        this.y = yCenter;

        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this._rotated = false;
        this.currentRotation = 30;

        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCtx = this.offScreenCanvas.getContext('2d');

        this.offScreenCanvas.width = CANVAS_WIDTH;
        this.offScreenCanvas.height = CANVAS_HEIGHT;
    }

    draw(){
        this.offScreenCtx.fillStyle = RED;
        // this.offScreenCtx.fillRect(this.x, this.y, this.imageWidth, this.imageHeight);
        this.offScreenCtx.translate(this.x, this.y); 
        if (!this._rotated){
            this.offScreenCtx.rotate((Math.PI / 180) * this.currentRotation);
            this._rotated = true;
        }
        this.offScreenCtx.drawImage(this.image, -(this.imageWidth / 2), -( this.imageHeight / 2), this.imageWidth, this.imageHeight);

        this.offScreenCtx.translate(-this.x, -this.y);
        ctx.drawImage(this.offScreenCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    setRotation(degree){
        this._rotated = false;
        this.currentRotation = degree;
    }

    moveImage(x, y){
        this.x = x;
        this.y = y;
        this.draw();
    }

    testRotation(){
        this.offScreenCtx.drawImage(this.image, -(this.imageWidth / 2), -( this.imageHeight / 2), this.imageWidth, this.imageHeight);
        ctx.drawImage(this.offScreenCanvas, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

class Game{
    constructor(){
        // nodeList (List) -> A list of all nodes
        // heuristicMult (Integer) -> a multiplier to calculate heuristics
        // isMapComplete (Boolean) -> check if, when creating the map, is there a start and end node. if not, can't run this map
        // isSimulationComplete (Boolean) -> check if the simulation is done
        this.nodeList = [];
        this.heuristicMult = 1;
        this.isMapComplete = false;
        this.isSimulationComplete = false;
        this.isHeuristicCalculated = false;

        this.pngList = [];
        this.resetGame = true;

        this.playerPlaying = true;
        this.playerCar;
        this.finishLine;
        this.startLight;


    }

    update(){
        if (this.isMapComplete){
            let nextNode = this.getNextNode();
            if (nextNode == this.getEndNode()){
                this.isSimulationComplete = true;
            }

            if (this.resetGame){
                this.removeAllPng();

                this.createFinishLine();
                this.createStartLight();
                this.createCar();
                this.nodeToDrawRoadFor = [];
                this.nodeList.forEach((node) => {
                    node.connectedPathId.forEach((id) => {
                        this.createRoad(node, id);
                    });
                });
                this.resetGame = false;
            }

            if (this.playerPlaying){

                this.playerCar.update(this);

            }
        }
    }

    createRoad(node, connectedNodeID){
        let connectedNode = idToNode(connectedNodeID);
        let roadList = drawRoadLine([gridCordToPixelCord(node.x), gridCordToPixelCord(node.y)], [gridCordToPixelCord(connectedNode.x), gridCordToPixelCord(connectedNode.y)], 20, 35);
        roadList.forEach((road) => {
            this.pngList.push(road);
        });
    }

    removeAllPng(){
        while (this.pngList.length > 0){
            screenList.forEach((screen) => {
                if (screen.activeScreen){
                    // console.log("removing from screen", screen);
                    screen.removeBackgroundObject(this.pngList[0]);
                    this.pngList.splice(0, 1);
                }
            });
        }
    }

    removePng(pngObj, layer){
        screenList.forEach((screen) => {
            if (screen.activeScreen){
                // console.log("removing from screen", screen);
                if (layer == "foreground"){
                    screen.removeForegroundObject(pngObj);
                }
                if (layer == "background"){
                    screen.removeBackgroundObject(pngObj);
                }
                let index = this.pngList.indexOf(pngObj)
                if (index != -1){
                    this.pngList.splice(index, 1);
                }
            }
        });
    }

    createFinishLine(){
        let endNode = this.getEndNode();
        if (this.finishLine == null){
            this.finishLine = drawPngOnCurrentScreen("finishLine.png", gridCordToPixelCord(endNode.x) - 10, gridCordToPixelCord(endNode.y) - 40, 75, 75, 0, "foreground");
        }
        else{
            this.removePng(this.finishLine, "foreground");
            this.finishLine = drawPngOnCurrentScreen("finishLine.png", gridCordToPixelCord(endNode.x) - 10, gridCordToPixelCord(endNode.y) - 40, 75, 75, 0, "foreground");
        }
        this.pngList.push(this.finishLine);
    }

    createStartLight(){
        let startNode = this.getStartNode();
        if (this.startLight == null){
            this.startLight = drawPngOnCurrentScreen("startLight.png", gridCordToPixelCord(startNode.x) + 10, gridCordToPixelCord(startNode.y) - 50, 175, 100, 0, "foreground");
        }else{
            this.removePng(this.startLight, "foreground");
            this.startLight = drawPngOnCurrentScreen("startLight.png", gridCordToPixelCord(startNode.x) + 10, gridCordToPixelCord(startNode.y) - 50, 175, 100, 0, "foreground");
        }
        this.pngList.push(this.startLight);
    }

    createCar(){
        let startNode = this.getStartNode();
        if (this.playerCar == null){
            this.playerCar = new Player(startNode);
        }else{
            this.playerCar.atNode = startNode;
            this.playerCar.updateCord(this.playerCar.atNode);
            this.playerCar.updatedOptions = false;
            this.playerCar.drewCar = false;
        }
    }

    deleteCar(){

    }


    setMap(map){

        // reset nodeList
        this.nodeList = [];

        // index 0: xPos (from 1-50)
        // index 1: yPos (from 1-50)
        // index 2: connected Nodes list of indexes (index in the map)
        // index 3: 0 = startNode, 1 = endNode
        if (this.isMapValid(map)){
            this.isMapComplete = true;

            for (let i=0; i < map.length; i++){
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
                
                let newNode = new Node(i, gridX, gridY, start, end);
                if (map[i][2]){
                    if (map[i][2].indexOf(i) != -1){
                        map[i][2].splice(map[i][2].indexOf(i), 1);
                    }
                    newNode.connectedPathId = map[i][2];
                }
                else{
                    newNode.connectedPathId = [];
                }
            
                this.nodeList.push(newNode);
                playScreen.addBackgroundObject(newNode);
            
            }
            testGame.updateAllHeuristic();
        }
    }

    // THINGS NOT ACCOUNTED FOR:
    // WRONG TYPE OF VARIABLE IN A "nodeDetailList", AKA STRING/BOOLEAN INSTEAD OF xPos being integer

    isMapValid(map){
        // index 1: xPos (from 1-50)
        // index 2: yPos (from 1-50)
        // index 3: connected Nodes list of indexes (index in the map)
        // index 4: 0 = startNode, 1 = endNode

        // are all nodes valid? check if they have x, y, connectedNodeList (can be empty), theres one start and one end
        let numOfStartNode = 0;
        let numOfEndNode = 0;
        let areAllNodeValid = true;
        map.forEach((nodeDetailList) => {

            let thisOneValid = false;
            // if correct num of items
            if (nodeDetailList.length == 3 || nodeDetailList.length == 4){
                // accounting for normal nodes
                let xPos = nodeDetailList[0];
                let yPos = nodeDetailList[1];
                let connectedNodeList = nodeDetailList[2];
                // if x Value in the grid cord AND if y Value in grid cord
                if (((xPos > 0) && (xPos < GRID_LENGTH)) && ((yPos > 0) && (yPos < GRID_LENGTH))){
                    // if it's a list (or object i guess)
                    if (typeof (connectedNodeList) == "object"){
                        thisOneValid = true;
                    }
                } 
                // if it's start or end node,
                if (nodeDetailList.length == 4){
                    if (nodeDetailList[3] == 0){
                        numOfStartNode += 1;
                    }
                    if (nodeDetailList[3] == 1){
                        numOfEndNode += 1;
                    }
                    if ((nodeDetailList[3] != 0) && (nodeDetailList[3] != 1)){
                        thisOneValid = false;
                    }
                }
            }
            if (thisOneValid == false){
                areAllNodeValid = false;
            }
        });
        if ((numOfStartNode != 1) || (numOfEndNode != 1)){
            areAllNodeValid = false;
        }
        // console.log("areAllNodeValid: ", areAllNodeValid);
        return areAllNodeValid;
    }

    runNextNode(){
        if (!this.isHeuristicCalculated){
            this.updateAllHeuristic();
            this.isHeuristicCalculated = true;
        }
        if (!this.isSimulationComplete){
            let nextNode = this.getNextNode();
            // console.log(nextNode);
            if (nextNode == null){
                this.isSimulationComplete = true;
            }
            if (nextNode == this.getEndNode()){
                this.isSimulationComplete = true;
                return;
            }
            let connectedNodeList = this.getConnectedNodeList(nextNode);

            if (connectedNodeList == null){
                this.isSimulationComplete = true;
                return;
            }

            connectedNodeList.forEach((node) => {
                if (node.visited == false){
                    let distance = distanceBetweenPoints([node.x, node.y],[nextNode.x, nextNode.y]);
                    node.updateValues(nextNode, distance);
                }
            })
            nextNode.visited = true;
        }
        updateNextNodeBoxText();
    }

    getNextNode(){

        if (this.isMapComplete){
            // console.log("getting next node!");
            // console.log("map complete");

            let startNode = this.getStartNode();
            if (!startNode.visited){return startNode;}
            let nodesToCheckList = [];
            this.nodeList.forEach((node) => {
                // console.log("checking node id:", node.id);
                if (node.visited){
                    // console.log("node is visited, grabbing nodes next to it.");
                    let connectedNodeList = this.getConnectedNodeList(node);
                    // console.log("nodes connected to id: ",node.id, " are:", connectedNodeList);
                    connectedNodeList.forEach((connectedNode) => {
                        if (connectedNode.visited == false){
                            if (nodesToCheckList.indexOf(connectedNode) == -1){nodesToCheckList.push(connectedNode);}
                        }
                    });
                }
            });

            let smallestFNode = null;
            nodesToCheckList.forEach((node) => {
                if (smallestFNode == null){
                    smallestFNode = node;
                }
                if (node.f < smallestFNode.f){
                    smallestFNode = node;
                }
            });
            // console.log("got node:", smallestFNode);
            return smallestFNode;

        }
        return null;

    }

    getConnectedNodeList(node){

        if (node == null){
            return null;
        }

        let connectedNodeList = [];

        node.connectedPathId.forEach((id) => {
            let connectedNode = this.getNodeFromId(id);
            connectedNodeList.push(connectedNode);
        });

        this.nodeList.forEach((thisNode) => {
            if (thisNode.connectedPathId.indexOf(node.id) != -1){
                if (connectedNodeList.indexOf(thisNode) == -1){
                    connectedNodeList.push(thisNode);
                }
            }
        });
        return connectedNodeList;
    }

    getStartNode(){
        let returnNode = null;
        this.nodeList.forEach((node) => {
            if (node.isItStart){returnNode = node;}
        });
        return returnNode;
    }

    getEndNode(){
        let returnNode = null;
        this.nodeList.forEach((node) => {
            if (node.isItEnd){returnNode = node;}
        });
        return returnNode;
    }

    getNodeFromId(id){
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
        let endNode = this.getEndNode();
        this.nodeList.forEach((node) => {
            // IF NOT END NODE
            if (node.isItEnd == false){
                // CALCULATE DISTANCE
                let distance = distanceBetweenPoints([node.x, node.y], [endNode.x, endNode.y]);
                // MULTIPLY H BY MULTIPLIER
                distance *= this.heuristicMult;
                node.heuristic = distance;
            }
        });
    }
    addNode(node){
        this.nodeList.push(node);
        this.resetNode();
        playScreen.addBackgroundObject(node);
        // this.updateAllHeuristic();
    }

    removeAllNode(){

        // console.log("nodelist before:", this.nodeList);
        while (this.nodeList.length != 0){
            this.removeNode(this.nodeList[0]);
        }

    }

    removeNode(nodeToRemove){
        testGame.nodeList.forEach((node) => {

            // if the node is ID is in connectedPathId of any node, remove the ID from connectedPathId
            let index = node.connectedPathId.indexOf(nodeToRemove.id);
            if (index != -1){
                node.connectedPathId.splice(index, 1);
            }

        });
        // remove node from nodeList
        let index = testGame.nodeList.indexOf(nodeToRemove);
        testGame.nodeList.splice(index, 1);

        // remove node from background Object
        playScreen.removeBackgroundObject(nodeToRemove);

        // reset all nodes;
        testGame.resetNode();
    }

    resetNode(){
        this.nodeList.forEach((node) => {
            node.g = null;
            node.f = null;
            node.previousNode = null;
            node.visited = false;
            node.checked = false;
            node.partOfFinalLine = false;
        });
        testGame.isSimulationComplete = false;
    }
}

class Node{

    constructor(id, x, y, isItStart, isItEnd){
        this.id = id;
        this.x = x;
        this.y = y;


        this.isItStart = isItStart;
        this.isItEnd = isItEnd; 

        this.defaultColor = YELLOW;
        if (this.isItStart){this.defaultColor = GREEN;}
        if (this.isItEnd){this.defaultColor = RED;}
        this.activeColor = this.defaultColor;
        this.selectedColor = PURPLE;
        this.hoverColor = BLUE;
        this.finalLineColor = BLUE;

        this.drewRoadPng = false;

        this.isItHovered = false;
        this.isItSelected = false;

        this.partOfFinalLine = false;

        this.visited = false;
        this.selected = false;
        this.checked = false;
        // g is the cost from the start. (-1 means not set)
        this.g = null;
        // heuristic is the approximate added cost depending on distance from end
        this.heuristic = null;
        // f = g + h (-1 means not set)
        this.f = null;
        // previousNode is the prior node connection (-1 means not set)
        this.previousNode = null;

        // E.G. [(2, 5), (3, 10), (7, 3)]
        // [nodeID, CostToTravel]
        // Travel to node 2 for cost: 5
        this.connectedPathId = [];
    }

    updateValues(previousNode, distanceFromPrevious){
        if (this.checked){
            let newG = previousNode.g + distanceFromPrevious;
            let newF = newG + this.heuristic;
            if (newF < this.f){
                this.g = newG;
                this.f = newF;
                this.previousNode = previousNode.id;
            }
        }

        if (!this.checked){
            this.g = previousNode.g + distanceFromPrevious;
            this.f = this.heuristic + this.g;
            this.previousNode = previousNode.id;
            this.checked = true;
        }
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
        writeText(this.text, this.textSize, this.styleId, false, this.x + (this.width / 2), this.y + (this.height / 2) +
         (this.textSize / 2), BLACK, this.width);
    }


}


class Editing{
    
    constructor(gameObj){

        this.editingEnabled = false;
        this.hoveringNode = -1;
        this.holdingNode = -1;
        this.distanceToCheckNode = 25;
        this.mousePosX = 0;
        this.mousePosY = 0;

        this.gameObj = gameObj;

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
            // testGame.createRoadPng();
        }
        this.sameIteration = false;
        
    }

    addNode(){
        // console.log("started adding node");

        let newHoveringNode = this.closestNodeWithinRange();
        this.mousePosToCordGrid();


        // console.log(this.mousePosX, this.mousePosY);

        let nextSmallest = getNextSmallestIdNode();

        let tempNode = new Node(nextSmallest, pixelToCord(this.mousePosX), pixelToCord(this.mousePosY), false, false);
        tempNode.draw();
        // createdMap.push(tempNode);
        // testGame.updateNodeList();

        // let removeTempNode = true;

        if (click){
            testGame.addNode(tempNode);
            // testGame.updateNodeList();
            
        }
        // console.log("ended adding node");
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
                testGame.removeNode(deleteNode);
                testGame.resetGame = true;
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
                    // console.log("CLICKED ON HOVERED NODE");
                    this.holdingNode = this.hoveringNode;
                    this.holdingNode.isItSelected = true;
                    this.holdingNode.isItHovered = false;
                    this.hoveringNode = -1;
                    testGame.resetGame = true;
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
                    // console.log("CLICKED ON THE NEW HOVERED NODE");

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
                    testGame.resetGame = true;
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
                testGame.resetGame = true;
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
        testGame.nodeList.forEach((node) =>{
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

        testGame.nodeList.forEach((node) => {

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
        writeText(this.text, textSize, 0, true, this.x + (this.width / 2), this.y + (this.height / 2) + (textSize / 2), this.activeTextColor 
        ,this.width * 0.95);

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
                clickPlayBtn();
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
                randomNodeBtnFunc(testGame);
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
    let finalRouteNodes = [];
    if (testGame.isSimulationComplete){
        // GET A LIST OF ALL NODE ID IN FINAL LINE
        currentID = testGame.getEndNode().id;

        while (currentID != null){
            finalRouteNodes.push(currentID);
            previousNodeID = testGame.getNodeFromId(currentID).previousNode;
            currentID = previousNodeID;
        }
        finalRouteNodes.forEach((id) => {
            node = testGame.getNodeFromId(id);
            node.partOfFinalLine = true;
        });
        // console.log("finalRouteNodes: ", finalRouteNodes);
    }
    
    
}

function getRandomInt(min, max) {
    let difference = max - min + 1
    return min + Math.floor(Math.random() * difference);
  }


function getNextSmallestIdNode(){
    let idList = [];

    testGame.nodeList.forEach((node) => {
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

function drawPngOnCurrentScreen(pngName, xCenter, yCenter, width, height, angle, depth){
    let pngToReturn;
    let madePng = false;
    screenList.forEach((screen) => {
        if (screen.activeScreen && !madePng){
            tempImg = new MyImage(pngName, xCenter, yCenter, width, height);
            tempImg.setRotation(angle);
            // console.log("rotate:", angle);
            if (depth == "foreground"){
                screen.addForegroundObject(tempImg);
            }
            if (depth == "background"){
                screen.addBackgroundObject(tempImg);
            }
            pngToReturn = tempImg;
            madePng = true;
        }
    });
    return pngToReturn;
}

function drawRoadLine(fromPos, toPos, widthOfRoad, heightOfRoad){
    let changeInY = toPos[1] - fromPos[1];
    let changeInX = toPos[0] - fromPos[0];
    angleDegree = findBearingBetweenPoints(fromPos, toPos);
    let totalDistance = distanceBetweenPoints(fromPos, toPos);
    numOfRoads = Math.floor(totalDistance / heightOfRoad) + 1;

    returnRoadList = [];
    for(i=0;i<numOfRoads;i++){
        tempRoadPng = drawPngOnCurrentScreen("normalRoad.png", fromPos[0] + ((i + 0.5) * (changeInX/numOfRoads)), fromPos[1] + ((i+0.5) * (changeInY/numOfRoads)), widthOfRoad, heightOfRoad, angleDegree, "background");
        returnRoadList.push(tempRoadPng);
    }
    return returnRoadList;
}

function findBearingBetweenPoints(fromPos, toPos){

    let changeInY = toPos[1] - fromPos[1];
    let changeInX = toPos[0] - fromPos[0];

    // console.log(changeInX);
    // console.log(changeInY);
    
    let angleRad = Math.atan((Math.abs(changeInX)/Math.abs(changeInY)));
    // console.log("degree before:", ((angleRad * 180)/Math.PI))
    // console.log("angleRad:", angleRad);
    if (changeInX > 0){
        // Line going down
        if (changeInY > 0){
            angleRad = (Math.PI) - angleRad;
        }
        // Line going up
        if (changeInY < 0){
            // angleRad = (Math.PI) - angleRad;
        }
        if (changeInY == 0){
            angleRad = 0.5 * Math.PI;
        }
    }
    // Line going left
    if (changeInX < 0){
        // Line going down
        if (changeInY > 0){
            // console.log("going left and down");
            angleRad = (Math.PI) + angleRad;
        }
        // Line going up
        if (changeInY < 0){
            angleRad = (2 * Math.PI) - angleRad;
        }
        if (changeInY == 0){
            angleRad = 1.5 * Math.PI;
        }
    }
    // Going straight up or down
    if (changeInX == 0){
        // Going straight down
        if (changeInY > 0){
            angleRad = Math.PI;
        }
        // going straight up
        if (changeInY < 0){
            angleRad = 0;
        }
    }
    // console.log("degree after:", ((angleRad * 180)/Math.PI))

    let angleDegree = ((angleRad * 180)/Math.PI);
    return angleDegree;

}



// ---------------------------------------------------------------------------------------------------------------------------------
//                                                        BUTTON FUNCTION
// ---------------------------------------------------------------------------------------------------------------------------------

function clickFirstScreen(){
    firstScreen.activeScreen = false;
    secondScreen.activeScreen = true;

}

function clickPlayBtn(){
    secondScreen.activeScreen = false;
    playScreen.activeScreen = true;
    // testGame.createRoadPng();
    // playerObj.draw();
}

function clickStepBtn(){
    
    testGame.runNextNode();
    // testGame.resetRoadPng();
    // playerObj.draw();
    
}


function getFinalRoute(){
    if (testGame.isMapComplete){

        let endNode = idToNode(idOfEndNode());
        let startNode = idToNode(idOfStartNode());

        // if the program completed
        if (endNode.checked){
            let currentNode = endNode;
            let currentRoute = [];

            while (currentNode.id != startNode.id){

                currentRoute.push(currentNode.id);
                currentNode = idToNode(currentNode.previousNode);

            }
            currentRoute.push(currentNode.id);
            return currentRoute;
        }
        else{
            return null;
        }
        console.log("returning null from finalRoute");
        return null;

    }
}


function updateNextNodeBoxText(){
    
    nextNode = testGame.getNextNode();
    // console.log(nextNode);
    if (nextNode == null){
        nextNodeBox.text = "Next Node: COMPLETE";
        getFinalRoute();
    }
    else{
        nextNodeBox.text = "Next Node:" + nextNode.id;
    }
}

function idOfStartNode(){
    let id = -1;
    testGame.nodeList.forEach((node) => {
        if (node.isItStart){
            id = node.id;
        }

    });
    return id;
}

function idOfEndNode(){
    let id = -1;
    testGame.nodeList.forEach((node) => {
        if (node.isItEnd){
            id = node.id;
        }

    });
    return id;
}

function idToNode(id){
    let nodeWithTheId = -1;
    testGame.nodeList.forEach((node) => {
        if (node.id == id){
            nodeWithTheId = node;
        }

    });
    return nodeWithTheId;
}

function clickMapLogBtn(){
    console.log("-=-=-=- CLICKED MAP LOG BUTTON -=-=-=-");

    // GET LAST NODE

    console.log(testGame.nodeList);
    let currentStr = "[";
    testGame.nodeList.forEach((obj) => {

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
    testGame.nodeList.forEach((node) => {
        node.g = null;
        node.f = null;
        node.previousNode = null;
        node.visited = false;
        node.checked = false;
        node.partOfFinalLine = false;
        // if (node.id == 0){
        //     visited = false;
        // }
    });
    testGame.isSimulationComplete = false;
    updateNextNodeBoxText();

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
        testGame.resetGame = true;
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
        testGame.resetGame = true;
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

function placeRandomNode(minimumDistance, minGridX, maxGridX, minGridY, maxGridY, startOrEndOrDefault, attemptsBeforeGivingUpMinimumDistance){

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
    let attemptNumber = 1;
    while (isNewNodeReady == false){
        // console.log("attempt number:", attemptNumber);
        let xPos = getRandomInt(minGridX, maxGridX);
        let yPos = getRandomInt(minGridY, maxGridY);
        // console.log("random nums:");
        // console.log(xPos);
        // console.log(yPos);

        let nodeReady = true;
        testGame.nodeList.forEach((node) => {
            // console.log("checking distance from: ", node.id);
            distanceBetweenNodeAndNewNode = distanceBetweenPoints([node.x, node.y], [xPos, yPos]);
            // console.log("removed distance: " + (minimumDistanceFromNode - (attemptNumber / attemptsBeforeGivingUpMinimumDistance)))
            if (distanceBetweenNodeAndNewNode < (minimumDistanceFromNode - (attemptNumber / attemptsBeforeGivingUpMinimumDistance))){
                // console.log("failed");
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
    
    testGame.addNode(randNode);
}

function connectNodeToRandomNode(node){
    let listOfDefaultNode = [];
    testGame.nodeList.forEach((node) => {
        if (!node.isItStart && !node.isItEnd){
            let numOfConnectionsOut = node.connectedPathId.length;
            let numOfConnectsIn = 0;
            testGame.nodeList.forEach((node2) => {

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
    let originalNode = testGame.getNodeFromId(nodeId);

    testGame.nodeList.forEach((node) =>{
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
    testGame.nodeList.forEach((node) => {

        let currentAddition = [];

        currentAddition.push(node.id);
        currentAddition.push([]);
    
        let currentClosestNodeIdAndDistance = closestNodeNotInList(node.id, []);
        currentAddition[1].push(currentClosestNodeIdAndDistance);
    
        while(currentClosestNodeIdAndDistance[0] != -1){
    
            currentClosestNodeIdAndDistance = closestNodeNotInList(node.id, currentAddition[1]);
            if (currentClosestNodeIdAndDistance[0] != -1){
                currentAddition[1].push(currentClosestNodeIdAndDistance);
            }
        }
        currentFinalList.push(currentAddition);
    });
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
// 3. Get x number of routes (randomly) with atleast half of the number of nodes on the
//           map (making sure all nodes have atleast a single connection, if not, add a route with it)
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
            for(i = 0; i < testGame.nodeList.length; i++){
                // console.log(i);
                node = testGame.nodeList[i];
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

function swap(list, index1, index2){
    let temp = list[index1];
    list[index1] = list[index2];
    list[index2] = temp;
    return list;
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

function randomNodeBtnFunc(testGame){
    // REMOVE ALL NODES
    createMapWithMinimumOptimalRoute(5);
    testGame.resetGame = true;
}

function createMapWithMinimumOptimalRoute(minimumNumberOfNodeInOptimalRoute){
    testGame.isMapComplete = false;
    testGame.removeAllNode();

    placeRandomNode(10, 5, 10, 40, 45, 1, 100);
    placeRandomNode(10, 40, 45, 10, 15, 2, 100);
    placeRandomNode(10, 2, 48, 10, 48, 0, 100);
    placeRandomNode(10, 2, 48, 10, 48, 0, 100);
    testGame.isMapComplete = true;
    closestConnectionList = getFinalListForClosestNode();
    // console.log(closestConnectionList);
    orderToConnectLine = getOrderForFinal(closestConnectionList);
    orderToConnectLine.forEach((id) =>{
        connectClosestLines(id, closestConnectionList, 2);
    });
    let doneMaking = false;
    let counter = 0;

    while (!doneMaking){
        while (!testGame.isSimulationComplete){
            clickStepBtn();
        }
        if (testGame.getEndNode().checked){
            if (getFinalRoute().length >= minimumNumberOfNodeInOptimalRoute){
                doneMaking = true;
                clickResetMapBtn();
            }
            else{
                testGame.isMapComplete = false;
                testGame.removeAllNode();
    
                placeRandomNode(10, 5, 10, 40, 45, 1, 100);
                placeRandomNode(10, 40, 45, 15, 15, 2, 100);
                for(i=0;i<(counter/10 + minimumNumberOfNodeInOptimalRoute);i++){
                    placeRandomNode(10, 2, 48, 10, 48, 0, 5);
                }
                testGame.isMapComplete = true;
                closestConnectionList = getFinalListForClosestNode();
                orderToConnectLine = getOrderForFinal(closestConnectionList);
                orderToConnectLine.forEach((id) =>{
                    connectClosestLines(id, closestConnectionList, 2);
                });
                counter += 1;       
            }
        }
        else{
            console.log("end node has not been checked");
        }
        // console.log("counter:", counter);
    }

}

function getRotation(ctx) {
    let t = ctx.getTransform();
    let rad = Math.atan2(t.b, t.a);
    if (rad < 0) { // angle is > Math.PI
      rad += Math.PI * 2;
    }
    // 180 degree = pie rad
    // 1 degree = pie/180 rad
    let degree = rad * (180 / Math.PI);
    // degree = ((rad*Math.PI) / 180);
    return degree;
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


var aHeld = false;
var aDown = false;

var dHeld = false;
var dDown = false;

var wHeld = false;
var wDown = false;

var sHeld = false;
var sDown = false;

document.addEventListener('keydown', function(event) {

    if (event.key == "a" && !aHeld){
        aHeld = true;
        aDown = true;
    }
    if (event.key == "d" && !dHeld){
        dHeld = true;
        dDown = true;
    }
    if (event.key == "w" && !wHeld){
        wHeld = true;
        wDown = true;
    }
    if (event.key == "s" && !sHeld){
        sHeld = true;
        sDown = true;
    }
}, true);

document.addEventListener('keyup', function(event) {
    if (event.key == "a") {
        aHeld = false;
    }
    if (event.key == "d") {
        dHeld = false;
    }
    if (event.key == "w") {
        wHeld = false;
    }
    if (event.key == "s") {
        sHeld = false;
    }

}, true);


// ASSUMING THAT THE CANVAS IS CENTERED ON THE PAGE (ITS IN DIRECT CENTER)
// WHEN IMPLEMENTING ON tipucs.co.uk, NEED TO CHANGE THIS FUNCTION, THERES 2 OPTIONS:
// OPTION 1: LINK TO ANOTHER PAGE WHICH HAS THE SIMULATION IN THE DIRECT CENTER
// OPTION 2: ADD SIMULATION AT THE BOTTOM AND ADJUST THE Y VALUE OF CANVASY TO FIT THE ACTUAL CANVAS.
var canvasX;
var canvasY;
function mouseClickPosInCanvas()
{
    canvasX = globalMouseClickX - (window.innerWidth / 2) + (CANVAS_WIDTH / 2);
    canvasY = globalMouseClickY - (window.innerHeight / 2) + (CANVAS_HEIGHT / 2);

    return [canvasX, canvasY];

}

function mouseHoverPosInCanvas()
{
    canvasX = globalMouseHoverX - (window.innerWidth / 2) + (CANVAS_WIDTH / 2);
    canvasY = globalMouseHoverY - (window.innerHeight / 2) + (CANVAS_HEIGHT / 2);
    return [canvasX, canvasY];

}



// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      DECLARING VARIABLES
// ---------------------------------------------------------------------------------------------------------------------------------


// -=-=-=-=-=-=-=-=- GAME OBJECT -=-=-=-=-=-=-=-=-
testGame = new Game();


// let map = [[5, 35, [], 0],[4, 19, [0]],[37, 48, []],[26, 32, [10,9,8,5,4,3,2,12,11,7,6]],[44, 10, [], 1],[23, 44, []],[29, 44, []],[42, 35, []],[42, 28, []],[30, 17, []],[22, 17, []],[10, 28, []],[9, 36, [0]]];
// let map = [[5, 35, [], 0],[4, 19, [0,3,5]],[10, 45, [0,6]],[15, 32, [0,7]],[25, 11, [10]],[13, 18, [4]],[37, 48, [8,9]],[26, 32, [4,8,5,2,9,10,11]],[48, 30, [9]],[33, 37, [10]],[44, 10, [], 1],[28, 45, [6]]];

let map = [[5, 35, [], 0],[4, 19, [0,3,5]],[10, 45, [0,6]],[15, 32, [0,7]],[25, 11, [10]],[13, 18, [4]],
             [37, 48, [8,9]],[25, 30, [4,8]],[48, 30, [9]],[33, 37, [10]],[44, 10, [], 1]];
// let map = [[5, 35, [], 0],[4, 19, []],[10, 45, []],[15, 32, []],[36, 22, []],[13, 18, []],[37, 48, []],
//              [25, 30, []],[48, 30, []],[33, 37, []],[44, 10, [], 1]];
// let map = [[6, 45, [2,3,4,5], 0],[42, 10, [], 1],[4, 32, []],[9, 35, []],[22, 33, []],[35, 38, []],[16, 20, []],
// [5, 18, []],[9, 27, []],[21, 15, []],[9, 10, []],[33, 23, []],[40, 32, []],[32, 14, []],[47, 16, []]];



// -=-=-=-=-=-=-=-=- FIRST SCREEN -=-=-=-=-=-=-=-=-


let startGameBtn = new Button(0, pToP(25), pToP(60), pToP(50), pToP(20), YELLOW, GREEN, "Click To Start!", BLACK, WHITE);

let firstScreenBG = new Box(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, AQUA);

let firstScreen = new Screen(0, "firstScreen", [startGameBtn]);
firstScreen.activeScreen = true;
firstScreen.addBackgroundObject(firstScreenBG);
firstScreen.addUIObject(startGameBtn);


// -=-=-=-=-=-=-=-=- SECOND SCREEN -=-=-=-=-=-=-=-=-

let playGameBtn = new Button(1, pToP(25), pToP(20), pToP(50), pToP(20), YELLOW, GREEN, "Play", BLACK, WHITE);

let secondScreenBG = new Box(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, PURPLE);

let secondScreen = new Screen(1, "secondScreen", [playGameBtn]);
secondScreen.addBackgroundObject(secondScreenBG);
secondScreen.addUIObject(playGameBtn);

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

testGame.setMap(map);

// -=-=-=-=-=-=-=-=- EDITING SETUP -=-=-=-=-=-=-=-=-

editObj = new Editing(testGame);
playScreen.addUpdateObject(editObj);

// -=-=-=-=-=-=-=-=- IMAGE SETUP -=-=-=-=-=-=-=-=-


// let myRoadImage = new MyImage("normalRoad.png", 300, 250, 100, 100);

screenList = [firstScreen, secondScreen, playScreen];

// -=-=-=-=-=-=-=-=- PLAYER SETUP -=-=-=-=-=-=-=-=-


// ---------------------------------------------------------------------------------------------------------------------------------
//                                                      MAIN PROGRAM LOOP
// ---------------------------------------------------------------------------------------------------------------------------------

playScreen.addUpdateObject(testGame);

// let tempCarImage = drawPngOnCurrentScreen("car.png", 250, 250, 100, 100, 0, "foreground");

// console.log(firstScreen.drawForegroundObjectList);
// console.log(firstScreen.drawBackgroundObjectList);
// console.log(firstScreen.drawUIObjectList);

function mainLoop(){
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

    if (click){
        if (playScreen.activeScreen){
        
        }
    }
    // if (aDown){
    //     console.log("down");
    // }

    // myCarImage.draw();

    colorFinalPath();
    click = false;
    aDown = false;
    dDown = false;
    wDown = false;
    sDown = false;
    requestAnimationFrame(mainLoop);
}

mainLoop()