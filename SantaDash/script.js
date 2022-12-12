var c, controller, rectangle, loop;
const button = document.getElementById('button')

c = document.querySelector("canvas").getContext("2d");

c.canvas.height = 300
c.canvas.width = 700

let present = new Image();
present.src = './images/present.png';

let santa = new Image();
santa.src = './images/santaSpriteSheet.png';

var spawnLineX = c.canvas.width + 30;
var spawnRate = 1500;
//speed
var spawnRateOfDescent = 5;
var lastSpawn = -1;
var objects = [];
var startTime = Date.now();

var score = 0
var highscore = 0
var alive = true
let timeSpeed = 3000

let frameWidth = 150;
let frameHeight = 150;
let currentFrame = 0;
let maxFrame = 15

rectangle = {
    height: 50, 
    jumping: true,
    width: 36,
    x: 100,
    y: 0,
    y_velocity: 0
}

controller = {
    up: false,
    keyListener: function(event){
        let key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {
            case 32:
                controller.up = key_state
                break;
        }
    },
    touchListener: function(){
        controller.up = true
    },
    touchListenerStop: function(){
        controller.up = false
    }

}


function spawnRandomObject() {

    var object = {
        x: spawnLineX,
        y: c.canvas.height - 16 - 50,
    }
    objects.push(object);
}

loop = function() {

    if(spawnRateOfDescent > 20){
        if(timeSpeed > 500){
            timeSpeed -= 0.05
        }
    } else{
        spawnRateOfDescent +=  0.002
    }
    // console.log(spawnRateOfDescent)

    score += 0.00015

    if(score > highscore){
        highscore = score
    }

    currentFrame++

    if(currentFrame == 15){
        currentFrame = 0
    }

    var time = Date.now();

    if (time > (lastSpawn + spawnRate)) {
        lastSpawn = time;
        spawnRate = (Math.random() * timeSpeed) + 1000
        spawnRandomObject();
    }

    if(controller.up && rectangle.jumping == false){
        rectangle.y_velocity -= 25; 
        rectangle.jumping = true
    }

    rectangle.y_velocity += 0.8 //gravity
    rectangle.y += rectangle.y_velocity
    rectangle.y_velocity *= 0.9 //friction
    
    //if rect is below floor line
    if(rectangle.y > c.canvas.height - 16 - 50){
        rectangle.jumping = false
        rectangle.y = c.canvas.height - 16 - 50
        rectangle.y_velocity = 0
    }

    c.clearRect(0, 0, c.canvas.width, c.canvas.height)
    c.drawImage(santa, (frameWidth * currentFrame) + 30, 15, frameWidth - 60, frameHeight - 30, rectangle.x, rectangle.y, rectangle.width, rectangle.height)
  
    c.fillStyle = "#3d2d00"
    c.fillRect(0, c.canvas.height - 16, c.canvas.width, 16)

    c.fillStyle = "black";
    c.font = "20px Georgia";
    c.fillText((Math.round(score * 1000)) + '/' + (Math.round(highscore * 1000)), 20, 30);

    objects.forEach((object, index) => {
        if(objects[index].x < - 50){
            objects.splice(index, 1)
        }
        if(rectangle.x < object.x + 50 && rectangle.x + rectangle.width > object.x && rectangle.y < object.y + 50 && rectangle.y + rectangle.height > object.y){
            alive = false
        }
        object.x -= spawnRateOfDescent;
        c.drawImage(present, object.x, object.y, 50, 50)
    })

    if(alive){
        window.requestAnimationFrame(loop)
    }else{
        button.style.display = 'block'
        c.canvas.style.animationPlayState = 'paused'
    }

}

function reset(){
    c.canvas.style.animationPlayState = 'initial'
    score = 0
    alive = true
    spawnRateOfDescent = 5;
    timeSpeed = 3000
    // lastSpawn = -1;
    objects = [];
    startTime = Date.now();
    currentFrame = 0;

    rectangle.jumping = true
    rectangle.x = 100
    rectangle.y = 0
    rectangle.y_velocity = 0 

    controller.up = false

    button.style.display = 'none'

    loop()
}

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener)
window.addEventListener("touchstart", controller.touchListener)
window.addEventListener("touchend", controller.touchListenerStop)
loop()