let targetDate = new Date("2025-09-08T11:00:00");

let G = 1;
let dt = 0.5;
let maxHeartSize = 100;
let minHeartSize = 30;
let maxHeartInitSpeed = 0.001;
let maxHearts = 32;
let minDistance = 5;
let density = 3;
let leftRect = null;

function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function randint(min, max) {
  return floor(random(min, max));
}

function pointOutsideCanvas() {
  let choice = randint(0, 4);
  if (choice == 0) {        // top
    return createVector(random(0, windowWidth), -maxHeartSize);
  } else if (choice == 1) { // bottom
    return createVector(random(0, windowWidth), windowHeight+maxHeartSize);
  } else if (choice == 2) { // left
    return createVector(-maxHeartSize, random(0, windowHeight));
  } else {                  // right
    return createVector(windowWidth+maxHeartSize, random(0, windowHeight));
  }
}

class Rect {
  constructor(topLeft, bottomRight) {
    this.topLeft = topLeft;
    this.bottomRight = bottomRight;
  }

  height() {
    return this.bottomRight.y - this.topLeft.y;
  }

  width() {
    return this.bottomRight.x - this.topLeft.x;
  }

  draw() {
    fill(0,0,0,0);
    stroke(0);
    rect(this.topLeft.x, this.topLeft.y, this.width(), this.height());
  }
}

function setLeftRect() {
  let topLeft = createVector(windowWidth/4, windowHeight/3);
  let bottomRight = p5.Vector.add(topLeft, createVector(50, 50));
  leftRect = new Rect(topLeft, bottomRight);
}

function pointInRect(rect) {
  let width = rect.bottomRight.x - rect.topLeft.x;
  let height = rect.bottomRight.y - rect.topLeft.y;

  let h_width = width/2;
  let h_height = height/2;
  
  let centerX = rect.topLeft.x + h_width;
  let centerY = rect.topLeft.y + h_height;
  return createVector(centerX + random(-h_width, h_width),
                      centerY + random(-h_height, h_height));
}

class Heart {
  constructor(pos, vel, mass) {
    this.set(pos, vel, mass);
  }

  set(pos, vel, mass) {
    this.pos = pos;
    this.mass = mass;
    this.vel = vel;
    this.acel = createVector(0, 0);
  }

  update_acel(hearts) {
    this.acel.x = 0;
    this.acel.y = 0;
    for (let i = 0; i < hearts.length; i++) {
      let other = hearts[i];
      if (other != this) {
        let offset = p5.Vector.sub(other.pos, this.pos);
        let dist = max(offset.mag(), minDistance);
        let a_inc = (G * other.mass) / (dist * dist);
        this.acel.add(offset.normalize().mult(a_inc));
      }
    }
  }

  update_state() {
    this.vel.add(p5.Vector.mult(this.acel, dt));
    this.pos.add(p5.Vector.mult(this.vel, dt));
  }

  draw() {
    fill(192, 64, 64);
    drawHeart(this.pos.x, this.pos.y, this.mass / density);
  }

  random() {
    this.pos = pointOutsideCanvas();
    let p = pointInRect(leftRect);
    let velDir = p5.Vector.sub(p, this.pos);
    this.vel = p5.Vector.mult(velDir, maxHeartInitSpeed);
    this.mass = random(minHeartSize, maxHeartSize);
    this.acel.x = 0;
    this.acel.y = 0;
    return this;
  }
}

let hearts = [];

function addHeart() {
  if (hearts.length < maxHearts) {
    hearts.push(new Heart(null, null, null).random());
  }
}

function outOfBounds(pos) {
  return pos.y < -3 * maxHeartSize ||
         pos.y > windowHeight + 3 * maxHeartSize ||
         pos.x > windowWidth  + 3 * maxHeartSize ||
         pos.x < -3 * maxHeartSize;
}

function updateHearts() {
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].update_acel(hearts);
  }

  for (let i = 0; i < hearts.length; i++) {
    hearts[i].update_state();
    if (outOfBounds(hearts[i].pos)) {
      hearts[i].random();
    }
  }
}

function drawHearts() {
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].draw();
  }
}

function setup() {
  //frameRate(5);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  setLeftRect();
}

function draw() {
  let now = new Date();
  let diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerText = "0 segundos.";
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
  setLeftRect();
}
