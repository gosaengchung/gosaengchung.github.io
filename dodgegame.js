class ObstacleGame {
    constructor() {
      this.player = { x: width / 2, y: height - 50, size: 120 };
      this.obstacles = [];
      this.speed = 2;
      this.spawnRate = 60;
      this.counter = 0;
      this.distanceTraveled = 0;
      this.totalDistance = 5000; // 총 이동 거리 (맵의 길이)
      this.gameOver = false;
      this.win = false; // Initialize win state
    }
  
    reset() {
      this.player = { x: width / 2, y: height - 50, size: 120 };
      this.obstacles = [];
      this.counter = 0;
      this.distanceTraveled = 0;
      this.gameOver = false;
      this.win = false; // 게임 초기화
      loop(); // 게임 루프 재시작
    }
  
    handleMotion(accelerationX) {
      // 기울기 값을 사용하여 플레이어 이동
      const sensitivity = 2; // 기울기 민감도 조절
      this.player.x += -accelerationX * sensitivity;
  
      if (this.player.x < 0) this.player.x = 0;
      if (this.player.x > width) this.player.x = width;
    }
  
    update() {
      this.counter++;
      this.distanceTraveled += this.speed; // 이동 거리 증가
  
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
          this.win = false; // 게임 오버 상태
          break;
        }
      }
  
      // 목적지에 도달하면 게임 성공 처리
      if (this.distanceTraveled >= this.totalDistance) {
        this.gameOver = true;
        this.win = true; // 게임 성공 상태
      }
    }
  
    display(t) { // 로봇 애니메이션을 위해 변수 t 로 frameCount를 받음
      // 플레이어 이미지
      imageMode(CENTER);
      fill(0, 0, 255, 100);
      dodgeImgFrame = int(t / 5) % 2;
      image(dodgeImgRobots[dodgeImgFrame], this.player.x, this.player.y, this.player.size, this.player.size);
  
      fill(255, 0, 0, 100);
      for (let obstacle of this.obstacles) {
        // 장애물 이미지
        noSmooth();
        push();
        translate(obstacle.x, obstacle.y);
        rotate(t / 80 * obstacle.r);
        image(dodgeImgObstacles[obstacle.i], 0, 0, obstacle.size, obstacle.size);
        pop();
      }

      if (this.win && this.gameOver) {
        imageMode(CENTER);
        fill(0, 0, 255, 100);
        dodgeImgFrame = int(t / 5) % 2;
        image(dodgeImgRobots[dodgeImgFrame], this.player.x, this.player.y, this.player.size, this.player.size);
        for (let obstacle of this.obstacles) {
            obstacle.x = -999;
            obstacle.y = -999;
        }
      }
      imageMode(CORNER); // 이미지모드 초기화
    }
  
    drawMiniMap() {
      let miniMapWidth = 50;
      let miniMapHeight = 200;
      let miniPlayerSize = 5;
  
      // 미니맵 배경
      fill(200);
      rect(width - miniMapWidth - 10, 10, miniMapWidth, miniMapHeight);
  
      // 주인공 위치 표시
      fill(105, 255, 127);
      let miniPlayerY = map(this.distanceTraveled, 0, this.totalDistance, 10 + miniMapHeight, 10);
      ellipse(width - miniMapWidth / 2 - 10, miniPlayerY, miniPlayerSize, miniPlayerSize);
  
      // 목적지 표시
      fill(0, 255, 0);
      rect(width - miniMapWidth - 10, 10, miniMapWidth, 5);
    }
  
    spawnObstacle() {
      let size = 80;
      let x = random(0, width - size);
  
      let i = int(random(0, 5)); // 랜덤 이미지 고르기
      let r = random(-3, 3); // 랜덤회전 속도
      this.obstacles.push({ x: x, y: 0, size: size, i: i, r: r });
    }
  
    isColliding(player, obstacle) {
      return (
        player.x < obstacle.x + obstacle.size &&
        player.x + player.size > obstacle.x &&
        player.y < obstacle.y + obstacle.size &&
        player.y + player.size > obstacle.y
      );
    }
  }