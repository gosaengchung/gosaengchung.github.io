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
  console.log("Activate button clicked");
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          console.log("Permission granted");
          window.addEventListener('deviceorientation', cb);
        } else {
          console.log("Permission denied");
        }
      })
      .catch(error => {
        console.error("Error requesting permission:", error);
      });
  } else {
    console.log("DeviceOrientationEvent.requestPermission is not a function");
    window.addEventListener('deviceorientation', cb);
  }
}

function cb(event) {
  console.log("Device orientation event triggered");
  if (event.gamma !== null) {
    me.degY = radians(event.gamma);
    console.log("degY:", me.degY);
  }
  if (event.beta !== null) {
    me.degX = radians(event.beta);
    console.log("degX:", me.degX);
  }
  // party.js와 동기화
  partySetShared(me);
  console.log("Shared me:", me);
}

function preload() {
  console.log("preload called");
  partyConnect(
    "wss://demoserver.p5party.org",
    "party_circle"
  );
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  guests = partyLoadGuestShareds();
  me = partyLoadMyShared({ degX: 0, degY: 0 }); // degX, degY 추가
  console.log("me initialized:", me);
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

function draw() {
  background(150);
  totalDegX = 0; // 합산된 회전 값을 초기화
  totalDegY = 0;
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] && guests[i].degX !== undefined && guests[i].degY !== undefined) {
      totalDegX += guests[i].degX; // 각 게스트의 X축 기울기를 합산
      totalDegY += guests[i].degY; // 각 게스트의 Y축 기울기를 합산
    }
  }
  console.log("totalDegX:", totalDegX, "totalDegY:", totalDegY);
  game.update();
  game.draw();
  game.degmatch();
  textAlign(CENTER, CENTER); // 텍스트 정렬 설정
  fill("#000066"); // 텍스트 색상 설정
  text(totalDegX.toFixed(2) + " DegX", width / 2, 50); // 합산된 기울기 값을 라디안으로 변환하여 화면에 표시
  text(totalDegY.toFixed(2) + " DegY", width / 2, 80);
}

class MovingGame {
  constructor() {
    this.directions = [];
    this.currentDirections = [];
    this.round = 1;
    this.maxRounds = 5;
    this.baseTimeLimit = 30000; // 기본 30초
    this.startTime = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton = createButton('Restart');
    this.restartButton.position(width / 2 - 50, height / 2 + 20);
    this.restartButton.size(100, 50);
    this.restartButton.mousePressed(() => this.resetGame());
    this.restartButton.hide();
  }

  startNewRound() {
    // 만약 라운드가 다 달성되면 게임이 종료되고 재시작 버튼이 나옴
    if (this.round > this.maxRounds) {
      this.success = true;
      this.gameOver = true;
      this.restartButton.show();
      return;
    }

    this.directions = [];
    for (let i = 0; i < 2 * this.round + 3; i++) {
      this.directions.push(this.randomDirection());
    }
    this.currentDirections = [...this.directions];
    this.startTime = millis();
  }

  randomDirection() {
    const directions = ['UP', 'LEFT', 'DOWN', 'RIGHT'];  //string으로 direction을 저장
    return random(directions);
  }

  getTimeLimit() {
    return this.baseTimeLimit + this.round * 1000; // 라운드마다 1초 추가
  }

  update() {
    if (this.gameOver) {
      return;
    }

    // 시간 초과시 게임오버 및 재시작 버튼 등장
    if (millis() - this.startTime > this.getTimeLimit()) {
      this.gameOver = true;
      this.restartButton.show();
    }
  }

  draw() {
    background(220);

    if (!this.gameStarted) {
      this.drawStartScreen();
      return;
    }

    if (this.gameOver) {
      if (this.success) {
        this.drawSuccessScreen();
      } else {
        this.drawGameOverScreen();
      }
      return;
    }
    //방향키 화면에 띄우기
    this.drawDirections();
    //타이머 화면에 띄우기
    this.drawTimer();
  }

  //게임시작시 화면
  drawStartScreen() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Press any key to start', width / 2, height / 2 - 100);
  }

  //시간 초과시 화면
  drawGameOverScreen() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Times Up! You Lost!', width / 2, height / 2 - 40);
    this.restartButton.show();
  }

  //게임완료 시 화면
  drawSuccessScreen() {
    textSize(32);
    textAlign(CENTER, CENTER);
    text('Congratulations! You Won!', width / 2, height / 2 - 40);
    this.restartButton.show();
  }

  //화면에 방향키 띄우기
  drawDirections() {
    textSize(32);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.currentDirections.length; i++) {
      text(this.getArrowSymbol(this.currentDirections[i]), width / 2 + (i - this.currentDirections.length / 2) * 50, height / 2);
    }
  }
  //화면에 타이머 띄우기
  drawTimer() {
    let elapsedTime = millis() - this.startTime;
    let timerWidth = map(elapsedTime, 0, this.getTimeLimit(), width, 0);
    fill(255, 0, 0);
    rect(0, height - 20, timerWidth, 20);
  }

  handleKeyPressed() {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startNewRound();
      return;
    }

    if (this.gameOver) {
      return;
    }
  }

  //방향키대로 기울이는지 확인
  degmatch() {
    let inputDirection = null;
    if (totalDegY > 1) {
      inputDirection = 'RIGHT';
    } else if (totalDegY < -1) {
      inputDirection = 'LEFT';
    } else if (totalDegX > 1) {
      inputDirection = 'DOWN';
    } else if (totalDegX < -1) {
      inputDirection = 'UP';
    }

    // 첫 번째 방향과 현재 방향을 비교하여 일치하면 첫 번째 방향만 제거
    if (inputDirection && this.currentDirections.length > 0 && inputDirection === this.currentDirections[0]) {
      this.currentDirections.shift(); // 첫 번째 방향만 제거
      console.log("Input matched:", inputDirection, "Remaining directions:", this.currentDirections);
      if (this.currentDirections.length === 0) {
        this.round++;
        this.startNewRound();
      }
    }
  }

  //리셋게임
  resetGame() {
    this.round = 1;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton.hide();
    this.startNewRound();
  }

  //입력한 방향을 방향키로 적용하는 함수
  getArrowSymbol(direction) {
    switch (direction) {
      case 'UP':
        return '↑';
      case 'LEFT':
        return '←';
      case 'DOWN':
        return '↓';
      case 'RIGHT':
        return '→';
    }
  }
}

function mousePressed() {
  if (game && typeof game.handleKeyPressed === 'function') {
    game.handleKeyPressed();
  } else {
    console.error("game.handleKeyPressed is not a function or game is not defined");
  }
}
