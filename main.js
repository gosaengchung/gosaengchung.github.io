let shared;
let clickCount;
let rotateDeg;
let moveXpos;
let moveYpos;

function preload() {
  partyConnect(
    "wss://demoserver.p5party.org",
    "hello_party"
  );
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  clickCount = partyLoadShared("clickCount", { value: 0 });
  rotateDeg = partyLoadShared("rotate", { value: 0 });
  moveXpos = partyLoadShared("moveXpos", { x: [0] });
  moveYpos = partyLoadShared("moveYpos", { y: [0] });
}

function setup() {
  createCanvas(400, 400);
  noStroke();

  if (partyIsHost()) {
    clickCount.value = 0;
    shared.x = 200;
    shared.y = 200;
  }
}

function mousePressed() {
  shared.x = mouseX;
  shared.y = mouseY;
  clickCount.value++;
}

function draw() {
  background('#ffcccc');
  fill("#000066");
  rotateDeg.value = rotationX;

  textAlign(CENTER, CENTER);
  text(clickCount.value, width / 2, height / 2);
  text(radians(rotateDeg.value), width / 2, 100);


  moveXpos.x.push(radians(rotateDeg.value));

  if (keyIsPressed) {
    if (key === 'w') {
      moveYpos.y.push(-0.5);
    } else if (key === 's') {
      moveYpos.y.push(0.5);
    }
  } else {
    moveYpos.y.push(0);
  }

  shared.x += moveXpos.x[0];
  shared.y += moveYpos.y[0];

  moveXpos.x[0] = moveXpos.x[1];
  moveYpos.y[0] = moveYpos.y[1];

  moveXpos.x.pop();
  moveYpos.y.pop();

  ellipse(shared.x, shared.y, 100, 100);
}