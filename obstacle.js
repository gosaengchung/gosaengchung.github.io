let shared;
let clickCount;
let totalDeg;
let guests;
let me;

document.addEventListener("DOMContentLoaded", function() {
  const activateButton = document.getElementById('activateButton');
  activateButton.addEventListener('click', onClick);
});

function onClick() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', cb);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('devicemotion', cb);
  }
}

function cb(event) {
  console.log(event.rotationRate);
}

function preload() {
  partyConnect(
    "wss://demoserver.p5party.org",
    "party_circle"
  );
  shared = partyLoadShared("shared", { x: 100, y: 100 });
  clickCount = partyLoadShared("clickCount", { value: 0 });
  guests = partyLoadGuestShareds();
  me = partyLoadMyShared({ degX: 0 });
}

let game; // 게임 인스턴스를 전역으로 선언하여 draw 함수에서 접근 가능하게 함

function setup() {
  createCanvas(400, 400);
  noStroke();

  if (partyIsHost()) {
    clickCount.value = 0;
    shared.x = 200;
    shared.y = 200;
  }

  totalDeg = 0;

  game = new ObstacleGame(); // 장애물 피하기 게임 클래스 인스턴스 생성

  // 핸드폰 기울기 이벤트 리스너 추가
  window.addEventListener('devicemotion', handleMotionEvent);
}

function handleMotionEvent(event) {
  const acceleration = event.accelerationIncludingGravity;
  game.handleMotion(acceleration.x);
}

function draw() {
  background('#ffcccc');
  fill("#000066");

  me.degY = rotationY;

  for (let i = 0; i < guests.length; i++) {
    totalDeg += guests[i].degY;
  }

  textAlign(CENTER, CENTER);
  text(clickCount.value, width / 2, height / 2);
  text(radians(totalDeg), width / 2, 100);

  ellipse(shared.x, shared.y, 100, 100);

  totalDeg = 0;

  if (!game.gameOver) {
    game.update(); // 게임 업데이트
    game.display(); // 게임 화면 표시
  } else {
    textSize(32);
    fill(255, 0, 0);
    text("Game Over", width / 2, height / 2);
    game.showRestartButton(); // 게임 오버 시 다시 시작 버튼 표시
    noLoop(); // 게임 루프 정지
  }
}

class ObstacleGame {
  constructor() {
    this.player = { x: width / 2, y: height - 50, size: 20 };
    this.obstacles = [];
    this.speed = 2;
    this.spawnRate = 60;
    this.counter = 0;
    this.gameOver = false;

    // 다시 시작 버튼 생성 및 숨기기
    this.restartButton = createButton('Restart');
    this.restartButton.position(width / 2 - 40, height / 2 + 40);
    this.restartButton.mousePressed(() => this.reset());
    this.restartButton.hide();
  }

  reset() {
    this.player = { x: width / 2, y: height - 50, size: 20 };
    this.obstacles = [];
    this.counter = 0;
    this.gameOver = false;
    this.restartButton.hide();
    loop(); // 게임 루프 재시작
  }

  handleMotion(accelerationX) {
    // 기울기 값을 사용하여 플레이어 이동
    const sensitivity = 0.5; // 기울기 민감도 조절
    this.player.x += accelerationX * sensitivity;

    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > width) this.player.x = width;
  }

  update() {
    this.counter++;
    if (this.counter % this.spawnRate === 0) {
      this.spawnObstacle();
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].y += this.speed;

      if (this.obstacles[i].y > height) {
        this.obstacles.splice(i, 1);
      }

      if (this.isColliding(this.player, this.obstacles[i])) {
        this.gameOver = true; // 게임 오버 상태로 설정
        break;
      }
    }
  }

  display() {
    fill(0, 0, 255);
    ellipse(this.player.x, this.player.y, this.player.size, this.player.size);

    fill(255, 0, 0);
    for (let obstacle of this.obstacles) {
      rect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    }
  }

  spawnObstacle() {
    let size = 20;
    let x = random(0, width - size);
    this.obstacles.push({ x: x, y: 0, size: size });
  }

  isColliding(player, obstacle) {
    return (
      player.x < obstacle.x + obstacle.size &&
      player.x + player.size > obstacle.x &&
      player.y < obstacle.y + obstacle.size &&
      player.y + player.size > obstacle.y
    );
  }

  showRestartButton() {
    this.restartButton.show();
  }
}

let moveLeft = false;
let moveRight = false;

function keyPressed(event) {
  if (event.code === 'ArrowLeft') {
    moveLeft = true;
  } else if (event.code === 'ArrowRight') {
    moveRight = true;
  }
}

function keyReleased(event) {
  if (event.code === 'ArrowLeft') {
    moveLeft = false;
  } else if (event.code === 'ArrowRight') {
    moveRight = false;
  }
}
