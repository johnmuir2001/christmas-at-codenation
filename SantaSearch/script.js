const time = document.getElementById("time")
const levelDisplay = document.getElementById("level")
const menu = document.getElementById("menu")
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let lastPoint = {x: 0, y:0};
let newX;
let newY;

let a = 0
let startLooking = false
let fade = false
let seconds = 3;
let level = 0;
let t;
let fadeCountdown;
let searchWidth = 30;
let sleighs = [];

let imageX = 80;
let imageY = 50;

let sleighLeft = new Image();
sleighLeft.src = './images/sleighLeft.png';

let sleighRight = new Image();
sleighRight.src = './images/sleighRight.png';

if(innerWidth < 700){
    canvas.width = innerWidth
    canvas.height = innerHeight * 0.8
    imageX = 60;
    imageY = 30;
} else{
    canvas.width = 700
    canvas.height = 600
}

let Xmax = canvas.width - 80;
let Xmin = 80;
console.log(Xmax, Xmin)

let Ymax = canvas.height - 80;
let Ymin = 80;

function add() {
    time.textContent = 'Time ' + seconds;

    if(seconds <= 0){
        checkWin()
        clearTimeout(t);
        return
    }

    seconds--;

    timer();
}

function timer() {
    if(seconds == 3){
        time.textContent = 'Time ' + seconds;
        seconds--;
    }
    t = setTimeout(add, 1000);
}

class Sleigh {
    constructor(x, y, dx, dy) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.found = false
    }

    draw() {
        if(this.dx > 0){
            c.drawImage(sleighRight, this.x, this.y, imageX, imageY) 
        }else{
            c.drawImage(sleighLeft, this.x, this.y, imageX, imageY) 
        }
    }

    update() {
        if(this.x < 0 || this.x > canvas.width - imageX){
            this.dx = this.dx * -1
        } else if (this.y < 0 || this.y > canvas.height -imageY){
            this.dy = this.dy * -1
        }
        if(!startLooking){
            this.x = this.x + this.dx
            this.y = this.y + this.dy
        }

        if(newX > this.x && newX < this.x + imageX && newY > this.y && newY < this.y + imageY && startLooking){
            this.found = true
            c.globalCompositeOperation = 'source-over';
            this.draw()
        }
    }
}

function gameLoop(){
    if(!startLooking){
        window.requestAnimationFrame(gameLoop)
    } else{
        return
    }
    if(!fade){
        c.clearRect(0, 0, canvas.width, canvas.height)
    }

    sleighs.forEach((sleigh) => {
        sleigh.update()
        sleigh.draw()
    })

    if(fade){
        c.fillStyle = `rgba(0, 0, 0, ${a})`;
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.fill()
    }
}

canvas.addEventListener('mousemove', (e) => {
    newX = e.x - canvas.offsetLeft
    newY = e.y - canvas.offsetTop
    search()
})
canvas.addEventListener('touchmove', (e) => {
    newX = e.touches[0].clientX - canvas.offsetLeft
    newY = e.touches[0].clientY - canvas.offsetTop

    console.log(sleighs[0].x, sleighs[0].y, newX, newY)
    search()
})

function search(){
    if(startLooking){
        c.globalCompositeOperation = 'destination-out';

        c.beginPath()
        c.moveTo(lastPoint.x, lastPoint.y)
        c.lineCap = "round";
        c.lineWidth = searchWidth;
        c.lineTo(newX, newY)
        c.stroke()

        sleighs.forEach((sleigh) => {
            sleigh.update()
        })
    }
    lastPoint = {x: newX, y: newY}
}

function startGame() {
    menu.style.display = 'none'
    a = 0
    startLooking = false
    fade = false
    seconds = 3;
    level++;
    levelDisplay.textContent = 'Level ' + level
    found = 0;
    t = null
    fadeCountdown = null
    sleighs = []
    if(level <= 3){
        for(i = 0; i < level; i++){
            sleighs.push(new Sleigh((Math.floor(Math.random() * (Xmax - Xmin + 1)) + Xmin), (Math.floor(Math.random() * (Ymax - Ymin + 1)) + Ymin), (Math.random() + 8) - 4, (Math.random() + 8) - 4))
            console.log(sleighs[i].x)
        }
    } else{
        for(i = 0; i < Math.ceil(Math.random() * 5); i++){
            sleighs.push(new Sleigh((Math.floor(Math.random() * (Xmax - Xmin + 1)) + Xmin), (Math.floor(Math.random() * (Ymax - Ymin + 1)) + Ymin), (Math.random() + 8) - 4, (Math.random() + 8) - 4))
        }
        if(searchWidth > 5){
            searchWidth -= 1
        }
    }

    gameLoop()
    setTimeout(() => {
        fade = true
        fadeCountdown = setInterval(() => {
            if(a < 1){
                a += 0.05
            } else{
                clearInterval(fadeCountdown)
                startLooking = true
                timer()
            }
        }, 100);
    }, 3000);
}


function checkWin(){
    let found = 0
    startLooking = false

    c.clearRect(0, 0, canvas.width, canvas.height)
    c.globalCompositeOperation = 'source-over';

    sleighs.forEach((sleigh) => {
        sleigh.draw()
        if(sleigh.found){
            found++
        }
    })

    if(found == sleighs.length){
        setTimeout(() => {
            startGame()
        }, 2000);
    }else{
        setTimeout(() => {
            menu.style.display = 'flex'
        }, 2000);
        level = 0
    }
}