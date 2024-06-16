// 나사 생성 class
class Screw {
    constructor(x, y) {
      this.x = x; // 나사의 x 좌표
      this.y = y; // 나사의 y 좌표
      this.size = 40; // 나사의 크기
      this.depth = 0; // 나사의 깊이
      this.angle = 0; // 나사의 각도
      this.successed = false; // 나사 성공 여부
      this.imageIndex = 0; // 이미지 인덱스 초기화
      this.imageWidth = 75;
      this.imageHeight = 150;
      this.selected = false; // 나사 선택 여부 초기화
    }
  
    show() {
      push();
      translate(this.x, this.y + this.depth); // 나사의 위치로 이동
  
      // 나사 이미지 애니메이션 표시
      if (this.selected || this.successed) {
        image(screwSelectedImgs[this.imageIndex], -this.imageWidth / 2, -this.imageHeight / 2, this.imageWidth, this.imageHeight);
      } else {
        image(screwImgs[this.imageIndex], -this.imageWidth / 2, -this.imageHeight / 2, this.imageWidth, this.imageHeight);
      }
  
      pop();
    }
  
    update() {
      this.angle += PI / (2 * screwGame.frame); // 나사의 각도 업데이트
      if (this.angle >= TWO_PI) {
        this.angle = 0;
      }
    }
  
    highlight() {
      push();
      translate(this.x, this.y + this.depth); // 나사의 위치로 이동
      noFill();
      stroke(255, 0, 0);
      strokeWeight(3);
      ellipse(0, 0, this.size + 100, this.size + 100); // 하이라이트 그림
      pop();
    }
  
    isMouseOver() {
      return mapMouseX > this.x - this.imageWidth / 2 &&
        mapMouseX < this.x + this.imageWidth / 2 &&
        mapMouseY > this.y + this.depth - this.imageHeight / 2 &&
        mapMouseY < this.y + this.depth + this.imageHeight / 2;
    }
  
    move() {
      if (this.imageIndex < 3) { // 나사가 구멍 깊이보다 깊지 않은 경우
        this.updateImageIndex(); // 이미지 인덱스 업데이트
        if (!this.successed && this.imageIndex == 3) { // 나사가 성공적으로 들어간 경우
          screwGame.successed += 1; // 게임 성공 수 증가
          this.successed = true; // 나사 성공 상태로 설정
        }
      } else {
        this.imageIndex = 3; // 나사 깊이 고정
      }
    }
  
    updateImageIndex() {
      this.imageIndex = (this.imageIndex + 1); // 이미지 인덱스 업데이트
    }
  }