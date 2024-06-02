let shared;
let clickCount;
let guests;
let me;
let game;

document.addEventListener("DOMContentLoaded", function() {
  const activateButton = document.getElementById('activateButton');
  if (activateButton) {
    activateButton.addEventListener('click', onClick);
  } else {
    console.error("Activate button not found.");
  }
});

function onClick() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', cb);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('deviceorientation', cb);
  }
}

function cb(event) {
  if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
    me.degX = radians(event.beta); // 기기의 x축 기울기 값을 라디안으로 변환하여 degX에 저장
    me.degY = radians(event.gamma); // 기기의 y축 기울기 값을 라디안으로 변환하여 degY에 저장
  }
}

function preload() {
  console.log("preload called");
  partyConnect(
    "wss://demoserver.p5party.org",
    "party_circle"
  );
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  clickCount = partyLoadShared("clickCount", { value: 0 });
  guests = partyLoadGuestShareds();
  me = partyLoadMyShared({ degX: 0, degY: 0 }); // degX 추가
}

function setup() {
  console.log("setup called");
  createCanvas(800, 600);
  noStroke();

  if (partyIsHost()) {
    clickCount.value = 0;
    shared.x = 200;
    shared.y = 200;
  }

  game = new MovingGame();
}

function draw() {
  background(150);

  game.update();
  game.draw();
}

function keyPressed() {
  game.handleKeyPressed();
}

class MovingGame {
  constructor() {
    this.clearThreshold = radians(30); // 클리어를 위한 각도 임계값
    this.success = false;
    this.restartButton = createButton('Restart');
    this.restartButton.position(width / 2 - 50, height / 2 + 20);
    this.restartButton.size(100, 50);
    this.restartButton.mousePressed(() => this.resetGame());
    this.restartButton.hide();
  }

  update() {
    if (!this.success && me && me.degY !== undefined) {
      if (abs(me.degY) > this.clearThreshold) { // y축 기울기 값이 임계값을 넘으면
        this.success = true; // 성공
        this.restartButton.show(); // 다시 시작 버튼 표시
      }
    }
  }

  draw() {
    textSize(32);
    textAlign(CENTER, CENTER);

    if (this.success) {
      fill(0, 255, 0);
      text('Success!', width / 2, height / 2);
    } else {
      fill(255);
      text('Tilt your phone to clear!', width / 2, height / 2);
    }
  }

  handleKeyPressed() {
    if (this.success && key === 'Enter') {
      this.resetGame();
    }
  }

  resetGame() {
    this.success = false;
    this.restartButton.hide();
  }
}
