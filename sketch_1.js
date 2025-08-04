let targetDate = new Date("2025-09-08T11:00:00");
let buoyancy = 0.0003;
let turbulence = 0.001;
let maxHeartSize = 60;
let minHeartSize = 10;
let maxHearts = 100;
let freq = 300;

function drawHeart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}

class Heart {
  constructor() {
    this.reset();
  }

  update() {
    let acel_Y = -(this.size * buoyancy);
    let acel_X = sin(this.pos.y * freq) * this.size * turbulence;
    let acel = createVector(acel_X, acel_Y);
    this.vel.add(acel);
    this.pos.add(this.vel);
  }

  draw() {
    fill(192, 64, 64);
    drawHeart(this.pos.x, this.pos.y, this.size);
  }

  reset() {
    let pos = createVector(random() * windowWidth, maxHeartSize + windowHeight);
    let size = minHeartSize + random() * (maxHeartSize - minHeartSize);
    this.set(pos, size);
  }

  set(pos, size) {
    this.pos = pos;
    this.size = size;
    this.vel = createVector(0, 0);
  }
}

let hearts = [];

function addHeart() {
  if (hearts.length < maxHearts) {
    hearts.push(new Heart());
  }
}

function outOfBounds(pos) {
  return pos.y < -maxHeartSize ||
         pos.x > windowWidth + maxHeartSize ||
         pos.x < -maxHeartSize;
}

function updateHearts() {
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].update();
    if (outOfBounds(hearts[i].pos)) {
      hearts[i].reset();
    }
  }
}

function drawHearts() {
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].draw();
  }
}

function setup() {
  // frameRate(5);
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  let now = new Date();
  let diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerText = "00:00:00:00";
    return;
  }

  let days = floor(diff / (1000 * 60 * 60 * 24));
  let hours = floor((diff / (1000 * 60 * 60)) % 24);
  let minutes = floor((diff / (1000 * 60)) % 60);
  let seconds = floor((diff / 1000) % 60);

  let format = (n) => n.toString().padStart(2, '0');
  let display = `Faltam ${format(days)} dias, ${format(hours)} horas,\n${format(minutes)} minutos e ${format(seconds)} segundos`;

  document.getElementById("countdown").innerText = display;

  background(255, 192, 192);
  updateHearts();
  drawHearts();
  addHeart();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
