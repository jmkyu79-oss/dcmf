// 페이지 전환 함수
function goToPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
        // 원본 로직: 페이지 전환 시 내부 스크롤 최상단으로 이동
        const scrollArea = targetPage.querySelector('.scroll-container');
        if (scrollArea) scrollArea.scrollTop = 0;
    }
}

// 에러 모달 함수
function showAlert(msg) {
    const overlay = document.getElementById('custom-alert');
    const messageTag = document.getElementById('alert-message');
    if (overlay && messageTag) {
        messageTag.innerText = msg;
        overlay.style.display = 'block';
    }
}

function closeAlert() {
    const overlay = document.getElementById('custom-alert');
    if (overlay) {
        overlay.style.display = 'none';
        const pwInput = document.getElementById('password-input');
        pwInput.value = "";
        pwInput.focus();
    }
}

// 비밀번호 체크 로직
function checkPassword() {
    const input = document.getElementById('password-input').value;
    const correctPassword = "1234abcd";

    if (input === correctPassword) {
        goToPage('page1');
    } else {
        showAlert("Chave de acesso incorreta. Verifique a chave digitada.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 비밀번호 입력창 엔터 키 지원
    const pwInput = document.getElementById('password-input');
    if (pwInput) {
        pwInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });
    }

    // 원본 슬라이더 및 도트 제어 로직 복원
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');

    if (slider) {
        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / slider.clientWidth);
            dots.forEach((dot, i) => i === index ? dot.classList.add('active') : dot.classList.remove('active'));
        });

        // 원본 터치 스와이프 로직 유지
        let startX;
        slider.addEventListener('touchstart', (e) => { startX = e.touches[0].pageX; }, {passive: true});
        slider.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].pageX;
            let diff = startX - endX;
            if (Math.abs(diff) > 30) {
                if (diff > 0) slider.scrollBy({ left: 1080, behavior: 'smooth' });
                else slider.scrollBy({ left: -1080, behavior: 'smooth' });
            }
        }, {passive: true});
    }

    // 원본 확대 방지 로직 유지
    document.addEventListener('touchstart', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
    });
});