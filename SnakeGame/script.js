const button = document.getElementById('start')
const scoreTag = document.getElementById('score')
const highscoreTag = document.getElementById('highscore')

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const santaHat = new Image();
santaHat.src = "./images/santaHat.png";

const foodImg = new Image();
foodImg.src = "./images/present.png";

const box = 40;

canvas.height = 16 * box;
canvas.width = 16 * box;

let snake = [];
let direction;
let score = 0;
let highscore = 0;

snake[0] = {
  x: 2 * box,
  y: 7 * box
}

let food = {
  x: 10 * box,
  y: 7 * box
}

document.addEventListener('keydown', function(e) {
  let key = e.keyCode
  if(key === 37 && direction != "right"){
    direction = "left"
  } else if(key == 38 && direction != "down"){
    direction = "up";
  } else if(key == 39 && direction != "left"){
    direction = "right";
  } else if(key == 40 && direction != "up"){
    direction = "down";
  }
})

function collision(head,array){
  for(let i = 0; i < array.length; i++){
    if(head.x == array[i].x && head.y == array[i].y){
      return true
    }
  }
  return false
}

function game(){
  
  let draw = setInterval(function() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    for( let i = 0; i < snake.length ; i++){
      c.fillStyle = `#009113`;
      c.fillRect(snake[i].x,snake[i].y,box,box);
    }
    c.drawImage(santaHat, snake[0].x + 10, snake[0].y - 15, box, box)
    c.drawImage(foodImg ,food.x, food.y, box, box)


    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( direction == "left") snakeX -= box;
    if( direction == "up") snakeY -= box;
    if( direction == "right") snakeX += box;
    if( direction == "down") snakeY += box;

    if(snakeX == food.x && snakeY == food.y){
      food = {
        x: Math.floor(Math.random()*15+1) * box,
        y: Math.floor(Math.random()*15+1) * box
      }
      score += 1
    } else{
      snake.pop(); 
    }

    let newHead = {
      x : snakeX,
      y : snakeY
    }

    if(snakeX < 0 || snakeX > 15 * box || snakeY < 0 || snakeY > 15 * box || collision(newHead, snake)){
      clearInterval(draw);
      button.style.display = 'block'
    }

    snake.unshift(newHead);

    if(score > highscore){
      highscore = score
      highscoreTag.textContent = highscore
    }
    scoreTag.textContent = score
  }, 100)
}

function reset() {
  button.style.display = 'none'
  snake = [];
  direction = null;
  score = 0
  snake[0] = {
    x: 2 * box,
    y: 7 * box
  }
  food = {
    x: 10 * box,
    y: 7 * box
  }
  game()
}

function myFunction(newDirection) {
  console.log(newDirection)
  if(newDirection == "right" && direction != "left"){
    direction = newDirection
  } else if(newDirection == "left" && direction != "right"){
    direction = newDirection
  } else if(newDirection == "up" && direction != "down"){
    direction = newDirection
  } else if(newDirection == "down" && direction != "up"){
    direction = newDirection
  }
}