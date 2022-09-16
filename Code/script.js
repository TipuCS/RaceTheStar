const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 1200;
const CANVAS_HEIGHT = canvas.height = 900;

const carImage = new Image();
carImage.src = 'Images/car.png'

let x = 0;


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
    }



    draw() {

        ctx.fillStyle = this.activeBoxColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // writeText("TESTING TEXT", 0, true, this.x + (this.width / 2), this.y + (this.height / 2), this.activeTextColor ,this.width * 0.95)

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
            this.activeTextColor = textHoverColor;
        }
        // 
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
                console.log("HOVERING");
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
canvas.addEventListener("click", function(e){
    globalMouseClickX = e.x;
    globalMouseClickY = e.y;
})
canvas.addEventListener("mousemove", function(e){
    globalMouseHoverX = e.x;
    globalMouseHoverY = e.y;
})
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

let myBtn = new Button(0, 50, 50, 300, 100, (0, 0, 0), (0, 255, 200), "TESTING TEXT", (255, 0, 0), (255, 200, 0));

listOfActiveButtons = [myBtn]

function mainLoop(){

    mouseClickPos = mouseClickPosInCanvas();
    // console.log(mouseClickPos);
    mouseHoverPos = mouseHoverPosInCanvas();
    // console.log(mouseHoverPos);
    // // console.log(canvasY);
    // console.log();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    listOfActiveButtons.forEach((button) => {
        console.log("doing");
        button.draw();
        button.hoverCheck(mouseHoverPos);
    });


    // ctx.fillRect(50, 50, 100, 100);

    // ctx.drawImage(carImage, 0, 0, 100, 100);
    
    requestAnimationFrame(mainLoop);

}
mainLoop()