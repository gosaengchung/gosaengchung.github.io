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
      this.isGameOver = false; // 게임 오버 상태
      this.isGameSuccess = false; // 게임 성공 상태
      this.isGameStarted = false; // 게임 시작 상태
  
      this.inputBox = createInput(); // 사용자의 입력을 받는 입력창
      this.inputBox.position(windowWidth / 2 - 400 + 65, windowHeight / 2 - 300 + 483);
      this.inputBox.size(667, 30);
      this.inputBox.style('background-color', 'rgba(0, 0, 0, 0)');
      this.inputBox.style('border', 'none'); // 테두리 없애기
      this.inputBox.style('outline', 'none'); // 포커스 시 나타나는 외곽선 없애기
      this.inputBox.style('box-shadow', 'none'); // 그림자 없애기
  
      this.inputBox.changed(this.sendMessage.bind(this)); // 입력 완료 후 sendMessage() 함수 호출
      this.inputBox.hide(); // 처음에는 입력창을 숨김
  
      this.assistantMessages.push("구매문의 주신 분 맞으세요?");
  
      this.expectedInputs = [
        "네! 부품 팔렸을까요?",
        "혹시 깎아주실 수 있을까요?",
        "아... 제가 학생이라...",
        "사실...",
        "고백할 외계인이 있습니다!",
        "혹시 조금만 깎아주실 수...",
        "네 그럼... 주소는 $%#^입니다."
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
    }
  
    startGame() {
      this.isGameStarted = true;
      this.isGameOver = false;
      this.isGameSuccess = false;
      this.inputBox.show();
      this.resetTimer();
    }
  
    draw() {
      if (this.isGameStarted) {
        if (this.isGameOver) {
          this.drawGameOver();
        } else {
          this.drawGame();
        }
      } else {
        this.drawStartScreen();
      }
    }
  
    drawGame() {
  
      image(chatBgImg,shared.slime.x - 400,shared.slime.y - 300,800,600);
  
      // 사용자가 입력해야 할 텍스트 표시
      fill(218);
      textAlign(CENTER);
      textSize(32);
      if (this.currentInputIndex < this.expectedInputs.length) {
        text("입력할 문구: " + this.expectedInputs[this.currentInputIndex], shared.slime.x, shared.slime.y + 300 - 150);
      } else {
        setTimeout(() => {
          this.gameSuccess(); // 모든 입력이 완료되었을 때 게임 성공 처리
        }, 4000);
      }
  
      // 사용자의 메시지 그리기
      for (let i = 0; i < this.userMessages.length; i++) {
        fill('#A6E31E');
        stroke('#31293d');
        strokeWeight(4);
        textAlign(RIGHT);
        textSize(32);
        image(chatPfpMe, shared.slime.x + 400 - 100, shared.slime.y - 300 + 124 + 150 * i, 50, 50)// 내 프로필 사진
        // rect(800 - 50 -50, 124 + 140 * i, 50, 50); 
        text(this.userMessages[i], shared.slime.x + 400 - 50, shared.slime.y - 300 + 204 + 150 * i);
      }
  
      // 챗봇의 메시지 그리기
      for (let i = 0; i < this.assistantMessages.length; i++) {
        fill('#a778ce');
        stroke('#31293d');
        strokeWeight(4);
        textAlign(LEFT);
        textSize(32);
        image(chatPfpPurple, shared.slime.x - 400 + 50, shared.slime.y - 300 + 50 + 150 * i, 50, 50)// 상대방 프로필 사진
        // rect(50, 50 + 140 * i, 50, 50);  
        text(this.assistantMessages[i], shared.slime.x - 400 + 50, shared.slime.y - 300 + 130 + 150 * i);
      }
  
      // 타이머 막대 그래프 표시
      let timePassed = millis() - this.timerStart;
      let timeLeft = this.timeLimit - timePassed;
      let barWidth = map(timeLeft, 0, this.timeLimit, 0, 800 - 96);
  
      fill('#31293d');
      stroke('#31293d');
      strokeWeight(5);
      rect(shared.slime.x - 400 + 48, shared.slime.y + 300 - 68, 800 - 94, 20);
      noStroke();
      noStroke();
      fill('#A6E31E'); //슬라임 색 타이머
      rect(shared.slime.x - 400 + 50, shared.slime.y + 300 - 66, barWidth, 16); // 레트로 스타일 타이머 막대
  
      if (timeLeft <= 0) {
        this.gameOver();
      }
    }
  
    drawGameOver() {
      // 게임 오버 메시지 표시
      image(chatBgImg,shared.slime.x - 400,shared.slime.y - 300,800,600);
      
    //   fill(255, 0, 0);
    //   textSize(40);
    //   textAlign(CENTER);
    //   if (this.isGameSuccess) {
    //     text("게임 성공!", shared.slime.x, shared.slime.y - 50);
    //   } else {
    //     text("시간 초과! 게임 오버", shared.slime.x, shared.slime.y - 50); 
    //   }
  
      if (!this.isGameSuccess) {
        //실패 배경
        image(gameoverBg,shared.slime.x - 400,shared.slime.y - 300,800,600);
        // 다시 시작 버튼 표시
        let img;
        if (this.isButtonPressedAgain) {
          img = buttonAgainPressedImg;
        } else if (this.isButtonOverAgain) {
          img = buttonAgainOverImg;
        } else {
          img = buttonAgainImg;
        }
  
        image(img, shared.slime.x - buttonWidth / 2, shared.slime.y + 200 - buttonHeight / 2 - 10, buttonWidth, buttonHeight); // 이미지 크기를 200x87.5px로 설정
      } else {
        //성공 배경
        image(successBg,shared.slime.x - 400,shared.slime.y - 300,800,600);
        // 게임 성공 시 닫기 버튼 표시
        // let img;
        // if (this.isButtonPressedClose) {
        //   img = buttonClosePressedImg;
        // } else if (this.isButtonOverClose) {
        //   img = buttonCloseOverImg;
        // } else {
        //   img = buttonCloseImg;
        // }
        // noSmooth();
        // image(img, shared.slime.x - buttonWidth / 2, shared.slime.y + 200 - buttonHeight / 2 - 10, buttonWidth, buttonHeight); // 이미지 크기를 200x87.5px로 설정
      }
    }
  
    drawStartScreen() {
      image(chatIntroImg,shared.slime.x - 400,shared.slime.y - 300,800,600);
  
      let img;
      if (this.isButtonPressed) {
        img = buttonStartPressedImg;
      } else if (this.isButtonOver) {
        img = buttonStartOverImg;
      } else {
        img = buttonStartImg;
      }
      noSmooth();
      image(img, shared.slime.x - buttonWidth / 2, shared.slime.y + 200 - buttonHeight / 2 - 10, buttonWidth, buttonHeight); // 이미지 크기를 200x87.5px로 설정
    }
  
    sendMessage() {
      this.userInput = this.inputBox.value(); // 입력창의 값을 가져옴
      this.inputBox.value(""); // 입력창 비우기
  
      // 입력해야 할 텍스트가 올바른지 확인
      if (this.userInput === this.expectedInputs[this.currentInputIndex]) {
        this.userMessages.push(this.userInput); // 사용자의 입력 메시지를 배열에 추가
        setTimeout(() => { // 0.5 ~ 1.5초 사이에 채팅을 입력하는 것처럼 보이게 함함
          this.assistantMessages.push('...');
          // 채팅 수가 도합 5개를 넘으면 가장 오래된 채팅부터 사라짐
          if (this.userMessages.length + this.assistantMessages.length > 4) {
            this.userMessages.shift();
            this.assistantMessages.shift();
          }
        }, int(random(500, 1500)));
        setTimeout(() => { // 1.5초 ~ 4초 사이에 판매자 채팅이 보이게 함
          this.assistantMessages.pop();
          this.assistantMessages.push(this.assistantReplies[this.currentInputIndex]);
          this.currentInputIndex++; // 다음 입력해야 할 텍스트로 이동    
          this.resetTimer(); // 타이머 리셋
        }, int(random(1500, 4000)));
      } else {
        text(this.expectedInputs[this.currentInputIndex], 800 / 2, 600 - 50);
      }
    }
  
    resetTimer() {
      this.timerStart = millis(); // 타이머 리셋
      this.timeLimit = 30000; // 타이머 제한 시간 (20초)
    }
  
    gameOver() {
      this.isGameOver = true;
      this.inputBox.hide(); // 입력창 숨기기
    }
  
    gameSuccess() {
      if (!this.isGameSuccess) { // 게임 성공 상태인지 확인
        this.isGameSuccess = true;
        this.gameOver();
        progress++;
        console.log(progress);
      }
    }
  
    // closeGame() {
    //   noLoop(); // 게임 루프를 멈춥니다.
    // }
  }