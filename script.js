// 페이지 전환 함수
function goToPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
        
        // 페이지 이동 시 이전 페이지의 잠금 상태 초기화
        const oldLockedPage = document.querySelector('.page.locked');
        if (oldLockedPage) {
            oldLockedPage.classList.remove('locked');
            const overlay = oldLockedPage.querySelector('.locking-overlay');
            if (overlay) overlay.style.display = 'none';
        }

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

// --- 새로 추가된 이미지 변경 및 화면 잠금 함수 ---
function handleImageChangeAndLock() {
    const targetImg = document.getElementById('target-img');
    const overlay = document.getElementById('locking-overlay');
    const page3 = document.getElementById('page3');

    if (!targetImg || !overlay || !page3) return;

    // 1. 이미지 소스 변경 (fechar.png로 가정)
    // dcmf 폴더 밑에 \potos\images\ 경로이므로 상대 경로는 아래와 같습니다.
    // 만약 fechar 이미지의 확장자가 png가 아니라면 아래 부분을 수정하세요.
    targetImg.src = 'potos/images/fechar.png';

    // 2. 화면 전체 터치 잠금
    overlay.style.display = 'block'; // 투명 오버레이를 활성화하여 모든 터치를 차단
    page3.classList.add('locked');    // CSS를 통한 스크롤 및 버튼 조작 차단
    
    console.log('이미지가 변경되고 화면이 잠겼습니다.');
}

document.addEventListener('DOMContentLoaded', () => {
    // 1페이지 관련 이벤트
    const pwInput = document.getElementById('password-input');
    if (pwInput) {
        pwInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });
    }

    // --- 3페이지 특정 이미지 변경 및 잠금 이벤트 설정 ---
    const targetImg = document.getElementById('target-img');
    if (targetImg) {
        // 모바일/데스크톱 모두 대응을 위해 click 이벤트를 사용합니다. (모바일에서 터치로 작동)
        targetImg.addEventListener('click', handleImageChangeAndLock);
    }

    // 3페이지 슬라이더 관련 이벤트
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    const page3 = document.getElementById('page3');

    if (slider) {
        // 슬라이드 스크롤에 따른 점 표시 변경
        slider.addEventListener('scroll', () => {
            // 잠금 상태일 때는 점 변경 로직을 타지 않음
            if (page3.classList.contains('locked')) return; 

            const index = Math.round(slider.scrollLeft / slider.clientWidth);
            dots.forEach((dot, i) => i === index ? dot.classList.add('active') : dot.classList.remove('active'));
        });

        // 수동 슬라이드 조작 로직
        let startX;
        slider.addEventListener('touchstart', (e) => { 
            startX = e.touches[0].pageX; 
        }, {passive: true});

        slider.addEventListener('touchend', (e) => {
            // 잠금 상태일 때는 슬라이드 이동 로직을 타지 않음
            if (page3.classList.contains('locked')) return; 

            let endX = e.changedTouches[0].pageX;
            let diff = startX - endX;
            if (Math.abs(diff) > 30) {
                // 고정 수치 1080 대신 기기 너비(slider.clientWidth)만큼 이동합니다.
                if (diff > 0) slider.scrollBy({ left: slider.clientWidth, behavior: 'smooth' });
                else slider.scrollBy({ left: -slider.clientWidth, behavior: 'smooth' });
            }
        }, {passive: true});
    }

    // 멀티터치(줌) 방지
    document.addEventListener('touchstart', (e) => { 
        if (e.touches.length > 1) e.preventDefault(); 
    }, { passive: false });
});