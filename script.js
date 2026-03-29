// 화면 해상도 조절 함수
function resizeApp() {
    const container = document.getElementById('app-container');
    const scaleX = window.innerWidth / 1080;
    const scaleY = window.innerHeight / 2211;
    container.style.transform = `scale(${scaleX}, ${scaleY})`;
}

// 전체화면 요청 함수
function requestFullScreen() {
    const doc = document.documentElement;
    if (doc.requestFullscreen) doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
}

// 3페이지 진입 시의 시간을 저장하고 두 곳(기본/잠금용)에 똑같이 적용
function setStaticTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 두 레이어에 표시될 시간 문자열을 동일하게 생성
    const timeString = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    
    const display = document.getElementById('datetime-display');
    const displayLock = document.getElementById('datetime-display-lock');
    
    // 3페이지용 일반 텍스트에 적용
    if (display) display.textContent = timeString;
    // fechar 잠금화면용 텍스트에도 똑같은 시간을 적용
    if (displayLock) displayLock.textContent = timeString;
}

// 로그인 처리
function handleLogin() {
    requestFullScreen();
    const pw = document.getElementById('password-input').value;
    if (pw === "1234abcd") {
        goToPage('page1');
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

// 페이지 이동 및 3페이지 로직
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    if (id === 'page3') {
        setStaticTime(); // 3페이지 진입한 시점의 시간 한 번만 기록
        
        // 초기화: 일반 시간만 보여주고 잠금용은 숨김
        document.getElementById('datetime-display').style.display = 'block';
        document.getElementById('datetime-display-lock').style.display = 'none';
        document.getElementById('full-screen-fechar').style.display = 'none';
        document.getElementById('locking-overlay').style.display = 'none';
    }
    
    resizeApp();
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

// 특정 이미지 클릭 시 잠금 모드 전환
function handleLock() {
    document.getElementById('full-screen-fechar').style.display = 'block';
    document.getElementById('locking-overlay').style.display = 'block';
    
    // 일반 시간 표시 숨기고, 동일한 시간이 적힌 잠금용 시간 표시(f4f4f4색)를 나타냄
    const display = document.getElementById('datetime-display');
    const displayLock = document.getElementById('datetime-display-lock');
    
    if (display) display.style.display = 'none';
    if (displayLock) displayLock.style.display = 'block';
}

window.addEventListener('resize', resizeApp);
window.addEventListener('load', resizeApp);

document.addEventListener('DOMContentLoaded', () => {
    resizeApp();

    const targetImg = document.getElementById('target-img');
    if (targetImg) targetImg.addEventListener('click', handleLock, { once: true });

    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    if (slider) {
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / 1080);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        });
    }

    document.getElementById('password-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});