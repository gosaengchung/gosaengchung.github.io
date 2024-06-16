class Camera {
  constructor() {
    this.x = 400;
    this.y = 300;
  }

  update(player) {
    // 카메라 위치를 플레이어의 위치로 업데이트
    // this.x = player.x - width / 2;
    // this.y = player.y - height / 2;
  
    this.x = lerp(this.x, player.x - width / 2, 0.3);
    this.y = lerp(this.y, player.y - height / 2, 0.3);
  }

  apply() {
    // 모든 객체를 카메라의 좌표계에 맞춰서 그리기
    translate(-this.x, -this.y);
  }
}
