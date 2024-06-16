class MovingGame {
  constructor() {
    this.directions = [];
    this.currentDirections = [];
    this.round = 1;
    this.maxRounds = 3;
    this.baseTimeLimit = 3000000; // 기본 30초
    this.startTime = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton = createButton('Restart');
    this.restartButton.position(width / 2 - 100, height - 200);
    this.restartButton.size(100, 50);
    this.restartButton.mousePressed(() => this.resetGame());
    this.restartButton.hide();
    this.isButtonPressed = false;
    this.isButtonOver = false;
    this.isButtonPressedAgain = false;
    this.isButtonOverAgain = false;
    this.isButtonPressedClose = false;
    this.isButtonOverClose = false;
    this.currentBg = false;
    this.phase = 1;
  }

  startNewRound() {
    if (this.round > this.maxRounds) {
      this.success = true;
      this.gameOver = true;
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
    const directions = ['UP', 'LEFT', 'DOWN', 'RIGHT'];
    return random(directions);
  }


  getTimeLimit() {
    return this.baseTimeLimit + this.round * 100000; //
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (millis() - this.startTime > this.getTimeLimit()) {
      this.gameOver = true;
    }
  }

  draw(storedDegX,storedDegY) {

    if (!this.gameStarted) {
      this.drawStartScreen(storedDegX, storedDegY);
      return;
    }

    if (this.gameOver) {
      if (this.success) {
        this.drawSuccessScreen();
        if (progress == 3) {
          progress++;
        }
      } else {
        this.drawGameOverScreen();
      }
      return;
    }

    image(boostImgBg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);

    //스페이스바 누를때 버튼 누르는 이미지
    let boostButtonPressed = 0
    if (keyIsPressed && keyCode === 32) boostButtonPressed = 1;
    else boostButtonPressed = 0;
    image(boostButtonImgs[boostButtonPressed], shared.slime.x - 400, shared.slime.y - 300, 800, 600);

    let boostDirection = 0;
    if (storedDegY > 1.2) {
      boostDirection = 4;
    } else if (storedDegY < -1.2) {
      boostDirection = 3;
    } else if (storedDegX > 1.7) {
      boostDirection = 2;
    } else if (storedDegX < 1.2) {
      boostDirection = 1;
    }


    image(boostImgs[boostDirection], shared.slime.x - 400, shared.slime.y - 300, 800, 600);
    image(boostSpacebar, shared.slime.x - 400, shared.slime.y - 300, 800, 600 );

    this.drawDirections();
  }

  drawStartScreen(storedDegX, storedDegY) {
    if (this.phase == 1) {image(boostIntroBg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);
      let img;
      if (this.isButtonPressed) {
        img = buttonStartPressedImg;
      } else if (this.isButtonOver) {
        img = buttonStartOverImg;
      } else {
        img = buttonStartImg;
      }
      noSmooth();
      image(img, shared.slime.x - buttonWidth / 2, shared.slime.y + 200 - buttonHeight / 2 - 10, buttonWidth, buttonHeight);
    } else if (this.phase == 2) {
      image(boostIntroBg2, shared.slime.x - 400, shared.slime.y - 300, 800, 600); // 2번째 화면
      let boostDirection = 0;
      if (storedDegY > 1.2) {
        boostDirection = 4;
      } else if (storedDegY < -1.2) {
        boostDirection = 3;
      } else if (storedDegX > 1.7) {
        boostDirection = 2;
      } else if (storedDegX < 1.2) {
        boostDirection = 1;
      }  
      image(boostStickImgs[boostDirection], shared.slime.x - 400, shared.slime.y - 300, 800, 600); // 연습화면에서 기어봉 조작 연습
      let img;
      if (this.isButtonPressed) {
        img = buttonStartPressedImg;
      } else if (this.isButtonOver) {
        img = buttonStartOverImg;
      } else {
        img = buttonStartImg;
      }
      image(img, shared.slime.x - buttonWidth / 2 + 220, shared.slime.y + 150 - buttonHeight / 2 + 60, buttonWidth, buttonHeight);
    } else {this.gameStarted = true};
  }

  drawGameOverScreen() {
    // textSize(32);
    // textAlign(CENTER, CENTER);
    // text('Times Up! You Lost!', width / 2, height / 2 - 40);

    image(boostImgBg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);

    image(gameoverBg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);

    // this.restartButton.show();

    let img;
    if (this.isButtonPressedAgain) {
      img = buttonAgainPressedImg;
    } else if (this.isButtonOverAgain) {
      img = buttonAgainOverImg;
    } else {
      img = buttonAgainImg;
    }
    image(img, shared.slime.x - buttonWidth / 2, shared.slime.y + 200 - buttonHeight / 2 - 10, buttonWidth, buttonHeight);
  }

  drawSuccessScreen() {
    // textSize(32);
    // textAlign(CENTER, CENTER);
    // text('Congratulations! You Won!', width / 2, height / 2 - 40);

    image(boostImgBg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);

    image(successBg, shared.slime.x - 400, shared.slime.y - 300, 800, 600);


    // this.restartButton.show();

    // let img;
    // if (this.isButtonPressedClose) {
    //   img = buttonClosePressedImg;
    // } else if (this.isButtonOverClose) {
    //   img = buttonCloseOverImg;
    // } else {
    //   img = buttonCloseImg;
    // }
    // image(img, shared.slime.x - buttonWidth / 2, shared.slime.y + 200 - buttonHeight / 2 - 10, buttonWidth, buttonHeight);
  }

  drawDirections() {
    textSize(40);
    fill('#A6E31E');
    stroke('#31293d');
    strokeWeight(10);
    textAlign(CENTER, CENTER);
    for (let i = 0; i < this.currentDirections.length; i++) {

    text(this.getArrowSymbol(this.currentDirections[i]), shared.slime.x + (i - (this.currentDirections.length - 1) / 2) * 60, shared.slime.y - 185);
    
  }
    textSize(32);
  }

  handleKeyPressed() {
    if (this.currentBg == false){
      this.phase++;
    } else if (!this.gameStarted) {
      this.gameStarted = true;
      this.startNewRound();
      return;
    }

    if (this.gameOver) {
      return;
    }
  }

  degmatch(storedDegX, storedDegY) {
    let inputDirection = null;
    fill(0);
    if (storedDegY > 1.2) {
      inputDirection = 'RIGHT';
    } else if (storedDegY < -1.2) {
      inputDirection = 'LEFT';
    } else if (storedDegX > 1.7) {
      inputDirection = 'DOWN';
    } else if (storedDegX < 1.2) {
      inputDirection = 'UP';
    }

    // 첫 번째 방향과 현재 방향을 비교하여 일치하면 첫 번째 방향만 제거
    if (inputDirection && this.currentDirections.length > 0 && inputDirection === this.currentDirections[0]) {
      this.currentDirections.shift();
      console.log("Input matched:", inputDirection, "Remaining directions:", this.currentDirections);
      if (this.currentDirections.length === 0) {
        this.round++;
        this.startNewRound();
      } else {
        lastDirectionText = `StoredDegX: ${storedDegZ.toFixed(2)}, StoredDegY: ${storedDegY.toFixed(2)}, Direction: ${inputDirection}`;
      }
    }
  }

  resetGame() {
    this.round = 1;
    this.gameOver = false;
    this.gameStarted = false;
    this.success = false;
    this.restartButton.hide();
    this.startNewRound();
    this.phase = 1;
  }

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
