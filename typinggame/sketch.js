let dungGeunMoFont;
let shared;
let me;
let guests;

function preload() {
  dungGeunMoFont = loadFont('fonts/DungGeunMo.otf');
}

class ChatBot {
  constructor() {
    this.initGame();
  }

  initGame() {
    this.userMessages = []; // 사용자의 입력 메시지를 저장하는 배열
    this.assistantMessages = []; // 챗봇의 응답 메시지를 저장하는 배열
    this.userInput = ""; // 사용자의 입력을 저장하는 변수
    this.expectedInputs = []; // 사용자가 입력해야 할 텍스트 목록
    this.currentInputIndex = 0; // 현재 입력해야 할 텍스트의 인덱스
    this.state = 'start'; // 게임 상태: 'start', 'playing', 'gameOver', 'gameSuccess'
    this.inputBox = createInput(); // 사용자의 입력을 받는 입력창
    this.inputBox.input(this.typing.bind(this));
    this.inputBox.style('font-size', '24px');
    this.inputBox.style('font-family', 'DungGeunMo');
    this.inputBox.style('border', '2px solid black');
    this.inputBox.style('padding', '10px');
    this.inputBox.hide(); // 초기 상태에서는 입력창을 숨김

    if (!this.startButton) {
      this.startButton = createButton("게임 시작");
      this.startButton.style('font-size', '24px');
      this.startButton.style('font-family', 'DungGeunMo');
      this.startButton.style('border', '2px solid black');
      this.startButton.style('padding', '10px 20px');
      this.startButton.style('background-color', '#ffcc00');
      this.startButton.mousePressed(this.startGame.bind(this));
    }
    this.startButton.show();

    if (!this.restartButton) {
      this.restartButton = createButton("다시 시작");
      this.restartButton.style('font-size', '24px');
      this.restartButton.style('font-family', 'DungGeunMo');
      this.restartButton.style('border', '2px solid black');
      this.restartButton.style('padding', '10px 20px');
      this.restartButton.style('background-color', '#ffcc00');
      this.restartButton.mousePressed(this.resetGame.bind(this));
    }
    this.restartButton.hide();

    this.assistantMessages.push("구매문의 주신 분 맞으세요?");

    this.expectedInputs = [
      "네! 혹시 이 부품 팔렸을까요?",
      "그렇군요^^ 제가 구매하고 싶은데 혹시 얼마까지 생각하세요?",
      "아... 제가 학생이라 혹시 조금만 깎아주실 수 있을까요?",
      "사실...",
      "제가 고백하고 싶은 사람이 있습니다!",
      "혹시 조금만 깎아주실 수 있을까요?",
      "네 그럼 정가로 사겠습니다. 주소는 $%#^입니다."
    ];

    this.assistantReplies = [
      "아니요, 아직요.",
      "네고는 없습니다. 올린 가격으로 받아요.",
      "학생인데 이게 왜 필요하세요?",
      "네",
      "오",
      "아뇨",
      "알겠습니다. 배송 주소를 확인했습니다."
    ];

    this.resetTimer();
    this.detectDevice();
    this.updateUIPositions();
  }

  draw() {
    background(255);

    switch (this.state) {
      case 'start':
        this.drawStartScreen();
        break;
      case 'playing':
        this.drawPlayingScreen();
        break;
      case 'gameOver':
        this.drawGameOverScreen();
        break;
      case 'gameSuccess':
        this.drawGameSuccessScreen();
        break;
    }
  }

  drawStartScreen() {
    fill(0);
    textAlign(CENTER);
    text("챗봇 게임에 오신 것을 환영합니다!", width / 2, height / 2 - 100);
    textSize(24);
    text("게임 시작 버튼을 눌러주세요.", width / 2, height / 2 - 50);
    this.startButton.show();
    this.restartButton.hide();
  }

  drawPlayingScreen() {
    this.startButton.hide();
    this.restartButton.hide();
    if (!this.isMobile) {
      // 데스크톱에서는 채팅 로그와 입력해야 할 텍스트 표시
      fill(0);
      textAlign(CENTER);
      textSize(30);
      if (this.currentInputIndex < this.expectedInputs.length) {
        text(this.expectedInputs[this.currentInputIndex], width / 2, height - 300);
      }

      // 사용자의 메시지 그리기
      for (let i = 0; i < this.userMessages.length; i++) {
        fill(0);
        textAlign(RIGHT);
        textSize(30);
        text(this.userMessages[i], width - 100, 80 * (i + 1));
      }

      // 챗봇의 메시지 그리기
      for (let i = 0; i < this.assistantMessages.length; i++) {
        fill(0, 100, 255);
        textAlign(LEFT);
        textSize(30);
        text(this.assistantMessages[i], 100, 30 + 80 * i);
      }
    }

    // 타이머 막대 그래프 표시
    let timePassed = millis() - this.timerStart;
    let timeLeft = this.timeLimit - timePassed;
    let barWidth = map(timeLeft, 0, this.timeLimit, 0, width - 20);
    
    noFill();
    stroke(0);
    strokeWeight(5);
    rect(500, height - 270, width - 1000, 40);

    noStroke();
    fill(0, 200, 0);
    rect(500, height - 270, barWidth, 40); // 레트로 스타일 타이머 막대

    if (timeLeft <= 0) {
      this.state = 'gameOver';
      this.inputBox.hide();
      this.restartButton.show();
    }
  }

  drawGameOverScreen() {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("시간 초과! 게임 오버", width / 2, height / 2 - 50);
    this.restartButton.show();
  }

  drawGameSuccessScreen() {
    fill(0, 255, 0);
    textSize(32);
    textAlign(CENTER);
    text("게임 성공!", width / 2, height / 2 - 50);
    this.restartButton.show();
  }

  startGame() {
    this.state = 'playing';
    this.startButton.hide();
    this.resetTimer(); // 타이머 리셋
  }


  sendMessage() {
    this.userInput = this.inputBox.value(); // 입력창의 값을 가져옴
    this.inputBox.value(""); // 입력창 비우기

    // 입력해야 할 텍스트가 올바른지 확인
    if (this.userInput === this.expectedInputs[this.currentInputIndex]) {
      this.userMessages.push(this.userInput); // 사용자의 입력 메시지를 배열에 추가
      this.assistantMessages.push(this.assistantReplies[this.currentInputIndex]);  
      this.currentInputIndex++; // 다음 입력해야 할 텍스트로 이동    
      this.resetTimer(); // 타이머 리셋
      if (this.currentInputIndex === this.expectedInputs.length) {
        this.state = 'gameSuccess'; // 모든 입력을 올바르게 했을 때 게임 성공
        this.inputBox.hide();
        this.restartButton.show();
      }
    } else {
      fill(0);
      textAlign(CENTER);
      textSize(30);
      text(this.expectedInputs[this.currentInputIndex], width / 2, height - 300);
    }
  }

  resetTimer() {
    this.timerStart = millis(); // 타이머 리셋
    this.timeLimit = 20000; // 타이머 제한 시간 (20초)
  }

  resetGame() {
    this.initGame();
    this.state = 'start'; // 다시 시작할 때 시작 화면으로
    this.inputBox.hide();
    this.restartButton.hide();
  }

  detectDevice() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!this.isMobile) {
      this.inputBox.hide(); // 데스크톱일 경우 입력창 숨기기
      console.log("컴퓨터입니다");
    } else {
      this.inputBox.show();
      console.log("mobile");
    }
  }
}

let chatBot;

function setup() {
  createCanvas(windowWidth, windowHeight);
  chatBot = new ChatBot();
  textFont(dungGeunMoFont);
}

function draw() {
  chatBot.draw();
}