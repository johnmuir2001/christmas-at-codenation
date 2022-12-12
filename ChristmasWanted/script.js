const wantedImage = document.getElementById('wantedImage')
const time = document.getElementById("time")
const menu = document.getElementById("menu")
const levelText = document.getElementById("level")
const points = document.getElementById("points")
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

let santa = new Image();
santa.src = './images/santaHead.png';

let clause = new Image();
clause.src = './images/clauseHead.png';

let reindeer = new Image();
reindeer.src = './images/reindeerHead.png';

let elf = new Image();
elf.src = './images/elfHead.png';

let Ymin = 50
let Xmin = 50
if(innerHeight < 650){
    Ymin = 30
    Xmin = 30
    canvas.width = innerWidth
    canvas.height = innerHeight * 0.8
} else{
    canvas.width = 700
    canvas.height = 500
}

let Xmax = canvas.width - Xmin
let Ymax = canvas.height - Ymin

let seconds = 10;
let t;

let mouseX = 0;
let mouseY = 0;
let faces = [santa, clause, elf, reindeer];
let wanted = null;
let wantedX = 0;
let wantedY = 0;
let remainingFaces = null;
let level = 0
let spawnedFaces = []

function add() {
    time.textContent = (seconds > 9 ? seconds : ('0' + seconds).slice(-2));

    if(seconds <= 0){
        showMe()
        return
    }

    seconds--;

    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

canvas.addEventListener('click', (e) => {
    mouseX = e.x - canvas.offsetLeft
    mouseY = e.y - canvas.offsetTop

    if(mouseX > wantedX && mouseX < wantedX + Xmin && mouseY > wantedY && mouseY < wantedY + Ymin){
        seconds += 5
        c.clearRect(0, 0, canvas.width, canvas.height);
        faces.push(wanted[0]);
        wanted = null;
        spawnedFaces = []
        fadeOut('+5');
        spawn();
    }else{
        seconds -= 10
        fadeOut('-10');
    }
})

class Face {
    constructor(face, x, y, wanted) {
        this.face = face;
        this.x = x;
        this.y = y;
        this.wanted = wanted;
        this.visible = true;
    }
    
    draw(){
        if(this.visible){
            c.drawImage(this.face, this.x, this.y, Xmin, Ymin);
        }
    }
}

function spawn(){
    level++
    levelText.textContent = 'Level: ' + level 
    Math.floor(Math.random() * 4)

    wanted = faces.splice(Math.floor(Math.random() * faces.length), 1)

    wantedImage.src = wanted[0].src

    let wnatedLoc = Math.floor(Math.random() * 10 * level)
    wantedX = Math.random() * (Xmax - Xmin) + Xmin;
    wantedY = Math.random() * (Ymax - Ymin) + Ymin;

    c.fillRect(wantedX, wantedY, Xmin, Ymin)

    for(i = 0; i < 10 * level; i++){
        if(wnatedLoc == i){
            spawnedFaces.push(new Face(wanted[0], wantedX, wantedY, true))
        }
        spawnedFaces.push(new Face(faces[Math.floor(Math.random() * faces.length)], Math.random() * (Xmax - Xmin) + Xmin, Math.random() * (Ymax - Ymin) + Ymin, false))
    }
    spawnedFaces.forEach((face) => {
        face.draw()
    })
}

function fadeOut(text) {
    var alpha = 1.0,
        interval = setInterval(function () {
            points.textContent = text;
            points.style.left = (mouseX + canvas.offsetLeft) + 'px';
            points.style.top = (mouseY + canvas.offsetTop) + 'px';
            points.style.color = "rgba(192, 151, 76, " + alpha + ")";
            points.style.fontFamily = "'Old Standard TT', serif";
            alpha = alpha - 0.05;
            if (alpha < 0) {
                points.textContent = '';
                clearInterval(interval);
            }
        }, 50); 
}

function play() {
    menu.style.display = 'none';
    time.textContent = '10'
    c.clearRect(0, 0, canvas.width, canvas.height);
    level = 0
    seconds = 10
    spawnedFaces = []
    timer();
    spawn();
}

function showMe() {
    clearTimeout(t);
    c.clearRect(0, 0, canvas.width, canvas.height);
    spawnedFaces.forEach((face) => {
        if(face.wanted == false){
            face.visible = false
        }
        face.draw()
    })
    faces.push(wanted[0]);
    wanted = null;
    spawnedFaces = []
    setTimeout(() => {
        menu.style.display = 'flex';
    }, 2000);
}

