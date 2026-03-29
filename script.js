// 1. 화면 꽉 채우기 (Scale) 함수
function resizeApp() {
    const container = document.getElementById('app-container');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 가로/세로 비율을 브라우저 크기에 맞춰서 강제로 확대/축소 (전체화면 효과)
    const scaleX = windowWidth / 1080;
    const scaleY = windowHeight / 2211;

    container.style.transform = `scale(${scaleX}, ${scaleY})`;
}

// 2. 로그인 및 주소창 숨기기
function handleLogin() {
    // 사용자의 터치 반응 시 전체화면 요청
    const doc = document.documentElement;
    if (doc.requestFullscreen) doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();

    const pw = document.getElementById('password-input').value;
    if (pw === "1234abcd") {
        goToPage('page1');
    } else {
        document.getElementById('custom-alert').style.display = 'block';
    }
}

function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    resizeApp(); // 페이지 전환 시 스케일 재확인
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

// 3. [핵심] 이미지 잠금 및 전체화면 fechar 노출
function handleLock() {
    const fecharLayer = document.getElementById('full-screen-fechar');
    const overlay = document.getElementById('locking-overlay');
    
    // 슬라이더 내부 이미지가 아니라, 전체를 덮는 레이어를 보여줌 (찌그러짐 방지)
    if (fecharLayer) fecharLayer.style.display = 'block';
    if (overlay) overlay.style.display = 'block';
    
    console.log("잠금 완료: fechar.gif 전체화면 노출");
}

window.addEventListener('resize', resizeApp);
window.addEventListener('load', resizeApp);

document.addEventListener('DOMContentLoaded', () => {
    resizeApp();

    const targetImg = document.getElementById('target-img');
    if (targetImg) {
        targetImg.addEventListener('click', handleLock, { once: true });
    }

    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    if (slider) {
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / 1080);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        });
    }

    // 엔터키 지원
    document.getElementById('password-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});