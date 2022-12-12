var particleCount = 300;
var particleMax = 1000;
var sky = document.querySelector(".sky");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = innerWidth;
var height = innerHeight;
var i = 0;
var active = false;
var snowflakes = [];
var snowflake;

var Snowflake = function () {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
  this.r = 0;

  this.reset();
};

Snowflake.prototype.reset = function () {
  this.x = Math.random() * width;
  this.y = Math.random() * -height;
  this.vy = 1 + Math.random() * 3;
  this.vx = 0.5 - Math.random();
  this.r = 1 + Math.random() * 2;
  this.o = 0.5 + Math.random() * 0.5;
};

function generateSnowFlakes() {
  snowflakes = [];
  for (i = 0; i < particleMax; i++) {
    snowflake = new Snowflake();
    snowflake.reset();
    snowflakes.push(snowflake);
  }
}

generateSnowFlakes();

function update() {
  ctx.clearRect(0, 0, width, height);

  if (!active) {
    return;
  }

  for (i = 0; i < particleCount; i++) {
    snowflake = snowflakes[i];
    snowflake.y += snowflake.vy;
    snowflake.x += snowflake.vx;

    ctx.globalAlpha = snowflake.o;
    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();

    if (snowflake.y > height) {
      snowflake.reset();
    }
  }

  requestAnimFrame(update);
}

function onResize() {
  width = innerWidth;
  height = innerHeight;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = "#FFF";

  var wasActive = active;
  active = width > 600;

  if (!wasActive && active) {
    requestAnimFrame(update);
  }
}

// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

onResize();
window.addEventListener("resize", onResize, false);

// sky.appendChild(canvas);

// var gui = new dat.GUI();
// gui
//   .add(window, "particleCount")
//   .min(1)
//   .max(particleMax)
//   .step(1)
//   .name("Particles count")
//   .onFinishChange(function () {
//     requestAnimFrame(update);
//   });


// const link = document.querySelectorAll('a')

// for(i = 0; i < link.length; i++){
//   link[i].style.transform = `rotate(${(Math.random() * 8) - 4}deg)`
// }



let currentTime = new Date().getTime()
let twelveDays = [
  new Date('December 12, 2022 00:00:00').getTime(),
  new Date('December 13, 2022 00:00:00').getTime(),
  new Date('December 14, 2022 00:00:00').getTime(),
  new Date('December 15, 2022 00:00:00').getTime(),
  new Date('December 16, 2022 00:00:00').getTime(),
  new Date('December 17, 2022 00:00:00').getTime(),
  new Date('December 18, 2022 00:00:00').getTime(),
  new Date('December 19, 2022 00:00:00').getTime(),
  new Date('December 20, 2022 00:00:00').getTime(),
  new Date('December 21, 2022 00:00:00').getTime(),
  new Date('December 22, 2022 00:00:00').getTime(),
  new Date('December 23, 2022 00:00:00').getTime(),
]

for(let i = 0; i < twelveDays.length; i++){
  if(currentTime > twelveDays[i]){
    document.getElementsByClassName('game')[i].style.display = 'grid';
  }
}