let targetDate = new Date("2025-09-08T14:00:00");

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function setup() {
  frameRate(5);
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
  fill(192, 64, 64);
  heart(random() * windowWidth, random() * windowHeight, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
