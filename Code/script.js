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



class Screen{

    constructor(Id, name, buttonList, objectList, backgroundColor){
        this.Id = Id;
        this.name = name;
        this.buttonList = buttonList;
        this.objectList = objectList;
        this.backgroundColor = backgroundColor;

        this.activeScreen = false;

    }



    draw(){
        // When drawing, first do background, then objects, then buttons
        if (this.activeScreen){
            // BACKGROUND
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // OBJECTS
            this.objectList.forEach((object) => {
                // console.log("doing");
                object.update();
            });

            // BUTTONS
            this.buttonList.forEach((button) => {

                button.update();

            });

        }


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
        this.draw();
        this.hoverCheck(mouseHoverPos);
    }


    draw() {

        ctx.fillStyle = this.activeBoxColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        }
    }



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

// function drawRect(ctx, ){
//     ctx.drawImage()
// }

// console.log(ctx)




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
// document.body.onmouseup = function(){
//     console.log("LEFT CLICKED UP");
//     click = true;

// }

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

// listOfActiveButtons = [myBtn]
let firstScreen = new Screen(0, "firstScreen", [startGameBtn], [], AQUA);
firstScreen.activeScreen = true;

let secondScreen = new Screen(1, "secondScreen", [tutorialGameBtn, levelGameBtn], [], PINK);

let playScreen = new Screen(2, "secondScreen", [], [], GREY);



// secondScreen.activeScreen = true;

function mainLoop(){

    mouseClickPos = mouseClickPosInCanvas();
    // console.log(mouseClickPos);
    mouseHoverPos = mouseHoverPosInCanvas();
    // console.log(mouseHoverPos);
    // console.log();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    
    firstScreen.draw();
    secondScreen.draw();
    playScreen.draw();
    // listOfActiveButtons.forEach((button) => {
    //     // console.log("doing");
    //     button.draw();
    //     button.hoverCheck(mouseHoverPos);
    // });

    click = false;
    requestAnimationFrame(mainLoop);

}
mainLoop()