let shared;
let clickCount;
let guests;
let me;
let game;
let totalDegX;
let totalDegY;

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
  me = partyLoadMyShared({ degX: 0, degY: 0 }); // degX, degY 추가
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
  totalDegX = 0;
  totalDegY = 0;
}

function mousePressed() {
  shared.x = mouseX;
  shared.y = mouseY;
  clickCount.value++;
  game.mousePressed(); // 미니게임 1 마우스 클릭 처리
}

function draw() {
  background(150);
  totalDegX = 0; // 합산된 회전 값을 초기화
  totalDegY = 0;
  for (let i = 0; i < guests.length; i++) {
    totalDegX += guests[i].degX; // 각 게스트의 y축 기울기를 합산
    totalDegY += guests[i].degY;
  }
  game.draw();

  textAlign(CENTER, CENTER); // 텍스트 정렬 설정
  fill("#000066"); // 텍스트 색상 설정
  text(clickCount.value, width / 2, height / 2); // 클릭 수를 화면에 표시
  text(totalDegX.toFixed(2) + " rad", width / 2, 100); // 합산된 기울기 값을 라디안으로 변환하여 화면에 표시
  text(totalDegY.toFixed(2) + " rad", width / 2, 150);

  // console.log(totalDeg); // 합산된 기울기 값을 콘솔에 출력

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
      if (totalDegX > this.clearThreshold && totalDegY > this.clearThreshold) { // y축 기울기 값이 임계값을 넘으면
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
