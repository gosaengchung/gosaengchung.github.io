class GameMap {
  constructor(width, height, imgs) {
    this.width = width; //1600
    this.height = height; //1200
    this.imgs = imgs;
    this.obstacles = [ //타일 한 칸당 80px로 계산
      { x: 0, y: 0, width: 1600, height: 220 }, //top wall
      { x: 480, y: 760, width: 80, height: 100 }, //spawn wall left
      { x: 640, y: 420, width: 320, height: 120 }, //spawn wall middle
      { x: 960, y: 760, width: 160, height: 100 }, //spawn wall right


      { x: 0, y: 440, width: 320, height: 100 }, //zone 1 wall 1
      { x: 240, y: 480, width: 80, height: 140 }, //zone 1 wall 2

      { x: 0, y: 840, width: 240, height: 100 }, //zone 2 wall top
      { x: 0, y: 1080, width: 480, height: 100 }, //zone 2 wall bottom

      { x: 1280, y: 360, width: 320, height: 100 }, //zone 3 wall top

      { x: 1360, y: 840, width: 240, height: 100 }, //zone 4 wall top
      { x: 1120, y: 1080, width: 80, height: 100 }, //zone 4 wall bottom
    ];
    this.triggers = [
      { x: 560, y: 460, width: 480, height: 420, message: "spawn zone \n press Q to interact" },

      { x: 0, y: 500, width: 240, height: 300, message: "zone 1" }, //왼쪽 위
      { x: 0, y: 920, width: 400, height: 280, message: "zone 2" }, //왼쪽 아래

      { x: 1280, y: 440, width: 320, height: 360, message: "zone 3" }, //오른쪽 위
      { x: 1200, y: 920, width: 400, height: 280, message: "zone 4" } //오른쪽 아래
    ];
  }

  display() {
    // fill(100);
    // rect(0, 0, this.width, this.height);
    noSmooth();
    this.update();

    // obstacle
    // fill(255, 0, 0, 100);
    fill(255, 0, 0, 0); //obstacle 투명화
    for (let obstacle of this.obstacles) {
      rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
  }


  displayTriggers() {
    // 트리거 영역 그리기
    // fill(0, 255, 0, 100);
    fill(0, 255, 0, 0); //트리거 영역 투명화
    for (let trigger of this.triggers) {
      rect(trigger.x, trigger.y, trigger.width, trigger.height);
    }
  }

  checkTriggers(player) {
    for (let trigger of this.triggers) {
      if (player.isInZone(trigger)) {
        return trigger;
      }
    }
    return null;
  }

  update() {
    let img = this.imgs[progress]
    image(img, 0, 0, this.width, this.height);
  }
}