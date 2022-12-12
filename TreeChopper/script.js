const axe = document.getElementById('axe');
const body = document.querySelector('body');
const menu = document.getElementById('menu');
const instructions = document.getElementsByClassName('instructions')[0];
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let trees = []
let zone = []
let points = []
const cycleLoop = [0, 1, 2, 3, 4, 5 ,6 ,7];
let frame = 0;
let width = 480;
let height = 480;
let scale = 1;
let scaledWidth = scale * width;
let scaledHeight = scale * height;
let mouseX = 0;
let speed = 30;
let alive = false;
let score = 0;

let tree = new Image();
tree.src = './images/christmasTreeSpriteSheet.png';

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    init()
})

document.addEventListener('mousemove', (e) => {
    if(alive){
        mouseX = e.x
        axe.style.top = `${e.y - 50}px`
        axe.style.left = `${e.x - 50}px`
    }
})

document.addEventListener('click', (e) => {
    zone.forEach((element, index) => {
        if(e.x < (element + 1) * (innerWidth /4) && e.x > (element) * (innerWidth /4)){
            let treeStage = trees[index].currentLoopIndex
            if(treeStage == 0 || treeStage == 1 || treeStage == 2){
                points.push(new Point('+0', index+1))
            } else if(treeStage == 3){
                points.push(new Point('+2', index+1))
                score += 2
            } else if(treeStage == 4){
                points.push(new Point('+4', index+1))
                score += 4
            } else if(treeStage == 5){
                points.push(new Point('+10', index+1))
                score += 10
            } else if(treeStage == 6){
                points.push(new Point('-5', index+1))
                score -= 5
            }
            trees[index].currentLoopIndex = 0
        }
    });
})

function Point(score, zone) {
    this.score = score;
    this.alpha = 1;
    this.zone = zone;
    this.xPos = (this.zone * innerWidth/4) - ((innerWidth/4)/2);
    this.yPos = innerHeight/3;

    this.draw = function() {
        c.fillStyle = "rgba(255, 0, 0, " + this.alpha + ")";
        c.textAlign = "center"; 
        c.font = "50px 'VT323'";
        c.fillText(this.score , this.xPos, this.yPos);
    }


    this.update = function() {
        this.alpha = this.alpha - 0.01
        this.yPos = this.yPos - 0.5
        
        this.draw()
    }
}

function Tree(x, y) {
    this.x = x;
    this.y = y;
    this.currentLoopIndex = 0;
    
    this.draw = function() {
        c.drawImage(tree, cycleLoop[this.currentLoopIndex] * width, 0, width, width, this.x, this.y, innerWidth/4, (innerWidth/4));
    }
    
    this.update = function(num) {

        if(num > 0.9){
            this.currentLoopIndex++
        }

        if (this.currentLoopIndex >= cycleLoop.length) {
            this.currentLoopIndex = 0;
        }
      
        this.draw()
    }
}

function init() {
    alive = true
    trees = []
    zone = []
    speed = 30;
    score = 0
    for(i = 0; i < 4; i++){
        trees.push(new Tree(i * innerWidth/4, (canvas.height - 64) - (innerWidth/4)))
        zone.push(i)
    }
}

function reset() {
    body.style.cursor = 'default';
    menu.style.display = 'flex';
    instructions.textContent = 'Score = ' + score
}

function gameLoop() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    c.fillStyle = "black";
    c.textAlign = "left"; 
    c.font = "50px 'VT323'";
    c.fillText(`SCORE: ${score}` , 30, 60);

    if(speed > 3){
        speed = speed - 0.005
    }
    frame++

    zone.forEach((z) => {
        if(mouseX > z * (innerWidth/4) && mouseX < (z+1) * (innerWidth/4)){
            c.fillStyle = "rgba(0, 0, 0, 0.1)"
            c.fillRect(z * (innerWidth/4), 0, innerWidth/4, innerHeight)
        }
    })

    points.forEach((score, index) => {
        if(score.alpha > 0){
            score.update()
        } else{
            points.splice(0, index + 1);
        }
    })

    if(frame > speed){
        trees.forEach((e) => {
            if(e.currentLoopIndex == 7){
                alive = false
                reset()
            }
            e.update(Math.random())
        })
        frame = 0
    }

    trees.forEach((e) => {
        e.update(0.1)
    })

    if(alive){
        window.requestAnimationFrame(gameLoop);
    }
}

gameLoop()

function start() {
    init()
    body.style.cursor = 'none';
    menu.style.display = 'none';
    window.requestAnimationFrame(gameLoop);
}