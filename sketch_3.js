let targetDate = new Date("2025-09-08T11:00:00");
let grid = null;
let numGliders = 5;

let gliderGun = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
  [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

let acorn =[
  [0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 0, 1, 1, 1]
]
function toBool(num) {
  return num > 0;
}

function life(cell, n) {
  if (n < 2) {
    return false;
  }
  if (n == 2 && cell) {
    return true;
  }
  if (n == 3) {
    return true;
  }
  return false;
}

function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function randInt(min, max) {
  return floor(random(min, max));
}

function randBool() {
  return random(-10, 10) > 0;
}

function makeMatrix(rows, columns) {
  let out = []
  for (let i = 0; i < rows; i++) {
    out.push([]);
    for (let j = 0; j < columns; j++) {
      out[i].push(false);
    }
  }
  return out;
}

class Grid {
  constructor() {
    this.rows = 100;
    this.columns = 100;
    this.grid = makeMatrix(this.rows, this.columns);
    this.old = makeMatrix(this.rows, this.columns);
    this.resize();
  }

  drawCell(i, j) {
    if (i < 0 || j < 0 || i >= this.rows || j >= this.columns) {
      console.log("out of bounds");
      return;
    }

    if (this.grid[i][j]) {
      fill(192, 64, 64);
      let size = this.heartSize;
      drawHeart(size * (j-1), size * (i-1), size);
    }
  }

  draw() {
    for (let i = 1; i < this.rows-1; i++) {
      for (let j = 1; j < this.columns-1; j++) {
        this.drawCell(i, j);
      }
    }
  }

  resize() {
    this.heartSize = max(windowHeight, windowWidth)/(this.rows-3);
  }

  neighbours(i, j) {
    let out = 0;
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (this.grid[i+r][j+c]) {
          out++;
        }
      }
    }
    if (this.grid[i][j]) {
      out--;
    }
    return out;
  }

  update() {
    for (let i = 1; i < this.rows-1; i++) {
      for (let j = 1; j < this.columns-1; j++) {
        let cell = this.grid[i][j];
        let neighbours = this.neighbours(i, j);
        this.old[i][j] = life(cell, neighbours);
      }
    }
    let meep = this.grid;
    this.grid = this.old;
    this.old = meep;
  }

  stamp(i, j, figure) {
    for (let r = 0; r < figure.length && i+r < this.rows; r++) {
      for (let c = 0; c < figure[r].length && j+c < this.columns; c++) {
        this.grid[i+r][j+c] = toBool(figure[r][c]);
      }
    }
  }
}

function setup() {
  frameRate(15);
  createCanvas(windowWidth, windowHeight);
  noStroke();
  grid = new Grid();
  grid.stamp(5, 5, gliderGun);
  grid.stamp(20, 80, acorn);
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
  grid.draw();
  grid.update();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  grid.resize();
}
