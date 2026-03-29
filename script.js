// 1. 화면 크기에 맞춰 1080x2211 컨테이너를 확대/축소 (꽉 차게 만들기)
function resizeApp() {
    const container = document.getElementById('app-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 가로, 세로 비율을 각각 계산해서 화면에 빈틈없이 꽉 채움
    const scaleX = windowWidth / 1080;
    const scaleY = windowHeight / 2211;

    container.style.transform = `scale(${scaleX}, ${scaleY})`;
}

// 2. 로그인 및 전체화면 모드 실행
function handleLogin() {
    // 브라우저 전체화면 요청 (주소창 숨기기 시도)
    const doc = document.documentElement;
    if (doc.requestFullscreen) doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
    else if (doc.msRequestFullscreen) doc.msRequestFullscreen();

    checkPassword();
}

function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === "1234abcd") {
        goToPage('page1');
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        // 스크롤 초기화
        const scrollArea = target.querySelector('.scroll-container');
        if (scrollArea) scrollArea.scrollTop = 0;
    }
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
    document.getElementById('password-input').value = "";
}

// 3. 이미지 변경 및 화면 잠금 (3페이지 전용)
function handleImageLock() {
    const targetImg = document.getElementById('target-img');
    const overlay = document.getElementById('locking-overlay');
    const page3 = document.getElementById('page3');

    // fechar.gif로 이미지 변경
    if (targetImg) targetImg.src = 'potos/images/fechar.gif';
    
    // 터치 방지 레이어 활성화
    if (overlay) overlay.style.display = 'block';
    
    // 스크롤도 완전히 막음
    const scrollContainer = page3.querySelector('.scroll-container');
    const sliderContainer = page3.querySelector('.middle-frame-wrapper');
    if (scrollContainer) scrollContainer.style.overflowY = 'hidden';
    if (sliderContainer) sliderContainer.style.overflowX = 'hidden';

    console.log("잠금 활성화: fechar.gif 표시됨");
}

// 이벤트 초기화
window.addEventListener('resize', resizeApp);
window.addEventListener('load', resizeApp);

document.addEventListener('DOMContentLoaded', () => {
    resizeApp();

    // 3페이지 첫번째 이미지 클릭 시 잠금 이벤트 연결
    const targetImg = document.getElementById('target-img');
    if (targetImg) {
        targetImg.addEventListener('click', handleImageLock, { once: true });
    }

    // 슬라이더 도트 연동
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    if (slider) {
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / 1080);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });
    }

    // 엔터키 지원
    document.getElementById('password-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});