document.addEventListener("DOMContentLoaded", function () {
  const activateButton = document.getElementById('activateButton');
  if (activateButton) {
    activateButton.addEventListener('click', onClick);
  } else {
    console.error("Activate button not found.");
  }
});

// onClick 함수는 iOS 기기에서 motion 권한을 요청합니다.
function onClick() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('devicemotion', handleDeviceMotion);
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    // iOS 13 이전 버전이나 다른 장치에서는 권한 요청 없이 바로 이벤트를 추가
  }

  if (device == 'Computer') {
    shared.checkConnection = true;
  }
}

// devicemotion 이벤트 콜백 함수
let lastGamma = null; // 이전 gamma 값을 저장
function handleDeviceMotion(event) {
  console.log("DeviceMotionEvent detected");
  const acc = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
  const accWithoutGravity = event.acceleration || { x: 0, y: 0, z: 0 };

  if (acc) {
    const accelerationX = acc.x;
    me.accelerationX = accelerationX; // 내 기울기 데이터 공유
  }

  // 중력 보정
  const alpha = 0.8;
  me.gravity = me.gravity || { x: 0, y: 0, z: 0 };

  me.gravity.x = alpha * me.gravity.x + (1 - alpha) * acc.x;
  me.gravity.y = alpha * me.gravity.y + (1 - alpha) * acc.y;
  me.gravity.z = alpha * me.gravity.z + (1 - alpha) * acc.z;

  const adjustedAcc = {
    x: acc.x - me.gravity.x,
    y: acc.y - me.gravity.y,
    z: acc.z - me.gravity.z,
  };

  const acceleration = Math.sqrt(adjustedAcc.x * adjustedAcc.x + adjustedAcc.y * adjustedAcc.y + adjustedAcc.z * adjustedAcc.z) || 0;

  if (!me.previousAcceleration) {
    me.previousAcceleration = acceleration;
  }

  const accelerationChange = Math.abs(acceleration - me.previousAcceleration);
  me.previousAcceleration = acceleration;

  // 초기 측정값 무시
  if (ignoreCount > 0) {
    ignoreCount--;
    me.accelerationChange = 0;
  } else {
    if (accelerationChange > threshold) { // 기준치를 넘는 경우에만 업데이트
      me.accelerationChange = accelerationChange;
      lastMotionTime = millis();
    } else {
      me.accelerationChange = 0;
    }
  }

  console.log(`Acceleration Change: ${me.accelerationChange}`); // 가속도 변화를 콘솔에 출력
}

// deviceorientation 이벤트 콜백 함수
function handleDeviceOrientation(event) {
  console.log("DeviceOrientationEvent detected");
  if (event.gamma !== null) {
    if (lastGamma !== null) {
      let deltaGamma = event.gamma - lastGamma; // 현재 gamma와 이전 gamma의 차이 계산
      if (deltaGamma > 180) {
        deltaGamma -= 360; // 기기가 회전한 방향 보정
      } else if (deltaGamma < -180) {
        deltaGamma += 360;
      }
      totalDeg += radians(deltaGamma); // 차이를 누적하여 총 회전각에 추가
    }
    lastGamma = event.gamma; // 현재 gamma 값을 이전 값으로 저장
    me.degdiffY = totalDeg; // 기기의 y축 기울기 값을 라디안으로 변환하여 degY에 저장
    me.degY = radians(event.gamma);
  }
  if (event.beta !== null) {
    me.degX = radians(event.beta);
  }
}
