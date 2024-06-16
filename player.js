class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // this.img = img; -> 이건 sketch.js에서 정의되므로 필요없어진 것 같음.
    this.size = 80;
    this.speed = 10;
    this.lastDirection = null;
    this.directions = { up: false, down: false, left: false, right: false };
  }

  move(obstacles) {
    let nextX = this.x;
    let nextY = this.y;

    if (!shared.moveStop) {

      switch (this.lastDirection) {
        case 'up': // setDirection에서 정한 lastDirection이 up이면서 down은 false일 때
        if (this.directions.up && !this.directions.down) {
          if (this.checkCollision('up', obstacles)) { // 충돌 체크
            nextY -= this.speed;
          }
        }
        break;
      case 'down': // setDirection에서 정한 lastDirection이 down이면서 up은 false일 때
          if (this.directions.down && !this.directions.up) {
            if (this.checkCollision('down', obstacles)) { // 충돌 체크
              nextY += this.speed;
            }
          }
        break;
      case 'left': // setDirection에서 정한 lastDirection이 left이면서 right은 false일 때
          if (this.directions.left && !this.directions.right) {
            if (this.checkCollision('left', obstacles)) { // 충돌 체크
              nextX -= this.speed;
            }
          }
        break;
      case 'right': // setDirection에서 정한 lastDirection이 right이면서 left은 false일 때
          if (this.directions.right && !this.directions.left) {
            if (this.checkCollision('right', obstacles)) { // 충돌 체크
              nextX += this.speed;
            }
          }
        break;
      }

    }

    this.x = nextX;
    this.y = nextY;

    // 맵 경계를 벗어나지 않도록 제한
    this.x = constrain(this.x, this.size / 2, mapWidth - this.size / 2);
    this.y = constrain(this.y, this.size / 2, mapHeight - this.size / 2);
  }



  checkCollision(direction, obstacles) {
    let x = this.x;
    let y = this.y;
    switch (direction) { // x와 y값이 다음 프레임이 되었을 때 얼마가 되는지 미리 계산
      case 'up':
        y -= this.speed;
        break;
      case 'down':
        y += this.speed;
        break;
      case 'left':
        x -= this.speed;
        break;
      case 'right':
        x += this.speed;
        break;
    }

    for (let obstacle of obstacles) { // 미리 계산된 x와 y의 값이 벽을 뚫었다면 false를 반환하고 함수를 빠져 나감
      if (x + this.size / 2 > obstacle.x &&
        x - this.size / 2 < obstacle.x + obstacle.width &&
        y + this.size / 2 + 10 > obstacle.y &&
        y + 10 < obstacle.y + obstacle.height) {
        return false;
      }
    }
    return true; // 만약 뚫지 않았다면 true를 반환
  }

  isInZone(zone) { // 그냥 특정 zone에 들어가 있는가를 확인하기 위함. 여기서 'zone'은 gameMap 클래스에 있는 trigger존 종류임.
    return this.x > zone.x &&
      this.x < zone.x + zone.width &&
      this.y > zone.y &&
      this.y < zone.y + zone.height;
  }

  display(img) {
    noSmooth(); // 가장 자리를 뚜렷하게 표현
    
    // player를 그리되, 받은 img는 sketch에서 'currentPlayerImg'로 넣어줌. 
    // this.x - this.size / 2 와 같은 코드를 넣는 이유는 this.x와 this.y가 이미지의 정중앙으로 되게끔 하기 위함임
    image(img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  setDirection(direction, state) { // wasd키가 하나라도 눌리면 true를 넣어주고, 키를 떼는 순간 false를 넣음
    this.directions[direction] = state; // 방향을 받아서 constructor에 있는 up/down/left/right 중 하나의 상태를 변경
    if (state) { // 만약 받은 상태가 true라면 
      this.lastDirection = direction; // lastDirection을 현재 방향으로 설정
      this.lastDirection = direction; // 왜 2개가 똑같은 라인이...
    } else if (this.directions.up) { // 여기서부터 코드는 2개 이상 입력되었다가 한 키를 떼게 되었을 때를 결정함.
      this.lastDirection = 'up'; // 다른 키를 입력하고 있더라도 '위'키는 우선 순위 1순위로 반환됨
    } else if (this.directions.down) {
      this.lastDirection = 'down';
    } else if (this.directions.left) {
      this.lastDirection = 'left';
    } else if (this.directions.right) {
      this.lastDirection = 'right';
    } else { // 받은 상태는 false이고 모든 방향이 false일 경우
      this.lastDirection = null; // lastDirection에는 아무 것도 넣지 않는다.
    } 
  }
}
