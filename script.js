/**
 * 화면 해상도 및 스케일 조정 함수
 * 1080x2211 기준 비율로 브라우저 크기에 맞춰 전체 컨테이너 크기 조정
 */
function resizeApp() {
    const container = document.getElementById('app-container');
    const scaleX = window.innerWidth / 1080;
    const scaleY = window.innerHeight / 2211;
    container.style.transform = `scale(${scaleX}, ${scaleY})`;
}

/**
 * 현재 시간을 브라질 형식(DD/MM/YYYY - HH:mm:ss)으로 표시하는 함수
 */
function setStaticTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    
    const display = document.getElementById('datetime-display');
    const displayLock = document.getElementById('datetime-display-lock');
    
    if (display) display.textContent = timeString;
    if (displayLock) displayLock.textContent = timeString;
}

/**
 * 비밀번호 확인 및 로그인 처리 함수
 */
function handleLogin() {
    // 전체화면 요청
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
    
    const pw = document.getElementById('password-input').value;
    // 비밀번호 체크
    if (pw === "456") {
        goToPage('page1');
    } else {
        // 비밀번호 틀릴 시 에러 팝업 표시
        document.getElementById('custom-alert').style.display = 'block';
    }
}

/**
 * 페이지 전환 함수
 * @param {string} id - 이동할 페이지의 ID
 */
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // 3페이지로 이동할 때 초기화 로직
    if (id === 'page3') {
        setStaticTime(); // 시간 설정
        // 잠금 관련 요소 모두 숨김
        document.getElementById('full-screen-fechar').style.display = 'none';
        document.getElementById('locking-overlay').style.display = 'none';
        document.getElementById('unlock-btn').style.display = 'none';
        document.getElementById('datetime-display').style.display = 'block';
        document.getElementById('datetime-display-lock').style.display = 'none';
    }
    resizeApp();
}

/**
 * 에러 알림창 닫기 함수
 */
function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

/**
 * 잠금 모드 활성화 함수 (이미지 클릭 시 호출)
 */
function handleLock() {
    // 잠금 이미지, 차단막, 해제 버튼을 동시에 표시
    document.getElementById('full-screen-fechar').style.display = 'block';
    document.getElementById('locking-overlay').style.display = 'block';
    document.getElementById('unlock-btn').style.display = 'block';
    
    // 시간 표시 색상 변경 (잠금용 하얀색 텍스트로 교체)
    document.getElementById('datetime-display').style.display = 'none';
    document.getElementById('datetime-display-lock').style.display = 'block';
}

/**
 * 잠금 해제 처리 함수 (잠금화면 버튼 클릭 시 호출)
 */
function unlockApp() {
    // 모든 잠금 요소 숨김
    document.getElementById('full-screen-fechar').style.display = 'none';
    document.getElementById('locking-overlay').style.display = 'none';
    document.getElementById('unlock-btn').style.display = 'none';
    
    // 시간 표시를 다시 일반용으로 교체
    document.getElementById('datetime-display').style.display = 'block';
    document.getElementById('datetime-display-lock').style.display = 'none';

    // 3페이지 슬라이더 위치를 첫 번째 이미지로 초기화
    const slider = document.getElementById('slider');
    if (slider) {
        slider.scrollTo({ left: 0, behavior: 'instant' });
    }

    // 다시 클릭했을 때 잠길 수 있도록 이벤트 리스너 재설정
    const targetImg = document.getElementById('target-img');
    if (targetImg) {
        targetImg.removeEventListener('click', handleLock);
        targetImg.addEventListener('click', handleLock, { once: true });
    }
}

// 윈도우 리사이즈 및 로드 시 레이아웃 조정
window.addEventListener('resize', resizeApp);
window.addEventListener('load', resizeApp);

document.addEventListener('DOMContentLoaded', () => {
    resizeApp();
    
    // 3페이지 특정 이미지 클릭 이벤트 등록
    const targetImg = document.getElementById('target-img');
    if (targetImg) targetImg.addEventListener('click', handleLock, { once: true });

    // 슬라이더 스크롤 감지하여 점(인디케이터) 업데이트
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    if (slider) {
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / 1080);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        });
    }

    // 입력창에서 엔터 키로 로그인 가능하게 설정
    document.getElementById('password-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});