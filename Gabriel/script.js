/**
 * 화면 해상도 및 스케일 조정 함수
 * 1080x2211 기준 비율로 브라우저 크기에 맞춰 전체 컨테이너 크기 조정
 */
// 파일 상단에는 변수 이름만 선언
let isDraggingV2 = false;
let startXV2 = 0;
let currentTranslateV2 = 0;
let prevTranslateV2 = 0;
let currentIndexV2 = 0;
const slideWidthV2 = 1080;


function resizeApp() {
    const container = document.getElementById('app-container');
    const scaleX = window.innerWidth / 1080;
    const scaleY = window.innerHeight / 2211;
    container.style.transform = `scale(${scaleX}, ${scaleY})`;
}

function openExternalLink(url) {
    // 만약 전체화면 모드라면 해제하고 이동 (충돌 방지)
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    // 새 탭으로 열기 (가장 안전한 방법)
    window.open(url, '_blank');
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
    if (pw === "qaz99") {
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
    // 깜빡임 효과 실행
    const flash = document.getElementById('flash-overlay');
    if (flash) {
        flash.classList.remove('flash-active');
        void flash.offsetWidth; // 애니메이션 초기화(리플로우)
        flash.classList.add('flash-active');
    }
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


/**
 * 3페이지 4번째 버튼 클릭 시 팝업 표시 및 자동 숨김
 */
function showPopup4() {
    const overlay = document.getElementById('popup-overlay-4');
    
    if (!overlay) return;

    // 1. 페이드 인 (show 클래스 추가)
    overlay.classList.add('show');

    // 2. 2초(2000ms) 대기 후 실행
    setTimeout(() => {
        // 3. 페이드 아웃 (show 클래스 제거)
        overlay.classList.remove('show');
    }, 3000); // 2000 밀리초 = 2초
}


/**
 * im3-3 페이지 진입 시 입력창에 자동으로 커서(포커스) 주기
 */
function focusFakeInput() {
    const fakeInput = document.getElementById('fake-password-input');
    if (fakeInput) {
        fakeInput.focus();
    }
}

/**
 * im3-3 전용 로그인 시도 함수 (무조건 에러)
 */
function handleFakeLogin() {
    const alertBox = document.getElementById('custom-alert');
    if (alertBox) {
        alertBox.style.display = 'block';
    }
    
    // 에러 창이 뜬 후 입력창 비우고 다시 커서 주기
    const fakeInput = document.getElementById('fake-password-input');
    fakeInput.value = "";
    fakeInput.focus();
}

// 엔터 키 이벤트 등록 (DOMContentLoaded 내부에 추가 권장)
document.addEventListener('DOMContentLoaded', () => {
    const fakeInput = document.getElementById('fake-password-input');
    if (fakeInput) {
        fakeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleFakeLogin();
            }
        });
    }
});



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
        }, { passive: true }); // 스크롤 성능 향상);
    }

    // 입력창에서 엔터 키로 로그인 가능하게 설정
    document.getElementById('password-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});




/* =========================================
   im3-1 전용 슬라이더 (v2) 로직
   ========================================= */


// --- 공통 함수 ---

// 특정 슬라이드로 이동
let totalSlidesV2 = 4; // 변수 추가 (필수)

// 특정 슬라이드로 이동
function goToSlideV2(index) {
    const wrapperV2 = document.getElementById('slider-wrapper-v2');
    if (!wrapperV2) return;
    
    currentIndexV2 = index;
    currentTranslateV2 = currentIndexV2 * -slideWidthV2;
    prevTranslateV2 = currentTranslateV2;
    
    wrapperV2.style.transition = 'transform 0.5s ease-out';
    wrapperV2.style.transform = `translateX(${currentTranslateV2}px)`;
    updateDotsV2();
}

// 드래그 종료 시 스냅 기능
function snapToNearestSlideV2() {
    const movedBy = currentTranslateV2 - prevTranslateV2;
    
    // 일정 거리 이상 드래그했을 때만 페이지 전환
    if (movedBy < -slideWidthV2 / 4 && currentIndexV2 < totalSlidesV2 - 1) {
        currentIndexV2++;
    } else if (movedBy > slideWidthV2 / 4 && currentIndexV2 > 0) {
        currentIndexV2--;
    }
    
    goToSlideV2(currentIndexV2);
}

// 도트 업데이트
function updateDotsV2() {
    const dots = document.querySelectorAll('.dot-v2');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndexV2);
    });
}

// --- 마우스/터치 이벤트 등록 ---

// 드래그 시작
const dragStartV2 = (e) => {
    isDraggingV2 = true;
    startXV2 = getXV2(e);
    const wrapperV2 = document.getElementById('slider-wrapper-v2');
    wrapperV2.style.transition = 'none'; 
};

// 드래그 중
const dragMoveV2 = (e) => {
    if (!isDraggingV2) return;
    const currentX = getXV2(e);
    const currentMove = currentX - startXV2;
    currentTranslateV2 = prevTranslateV2 + currentMove;
    
    // 경계 제한
    if (currentTranslateV2 > 0) currentTranslateV2 = 0;
    const maxTranslate = -(totalSlidesV2 - 1) * slideWidthV2;
    if (currentTranslateV2 < maxTranslate) currentTranslateV2 = maxTranslate;
    
    const wrapperV2 = document.getElementById('slider-wrapper-v2');
    wrapperV2.style.transform = `translateX(${currentTranslateV2}px)`;
};

// 드래그 종료
const dragEndV2 = () => {
    if (!isDraggingV2) return;
    isDraggingV2 = false;
    
    const movedBy = currentTranslateV2 - prevTranslateV2;
    // 100px 이상 움직이면 페이지 전환
    if (movedBy < -100 && currentIndexV2 < totalSlidesV2 - 1) {
        currentIndexV2++;
    } else if (movedBy > 100 && currentIndexV2 > 0) {
        currentIndexV2--;
    }
    
    goToSlideV2(currentIndexV2);
};

// const getXV2 = (e) => e.type.includes('touch') ? e.touches[0].clientX : e.clientX;


// 좌표 취득 Helper
const getXV2 = (e) => {
    return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
};

// 이벤트 리스너 연결
// 초기 이벤트 바인딩 (파일 하단 DOMContentLoaded에 추가)
document.addEventListener('DOMContentLoaded', () => {
    const wrapperV2 = document.getElementById('slider-wrapper-v2');
    if (wrapperV2) {
        wrapperV2.addEventListener('mousedown', dragStartV2);
        wrapperV2.addEventListener('mousemove', dragMoveV2);
        window.addEventListener('mouseup', dragEndV2); // 윈도우 전체에서 마우스 뗌 감지

        wrapperV2.addEventListener('touchstart', dragStartV2, { passive: false });
        wrapperV2.addEventListener('touchmove', dragMoveV2, { passive: false });
        wrapperV2.addEventListener('touchend', dragEndV2);
    }
});




// 슬라이더 열기 시 초기화 필수
function openSliderV2() {
    const container = document.getElementById('slider-container-v2');
    if(container) container.style.display = 'block';
    
    currentIndexV2 = 0;
    setTimeout(() => goToSlideV2(0), 10); // 렌더링 후 실행
}

// 슬라이더 닫기 함수
function closeSliderV2() {
    const container = document.getElementById('slider-container-v2');
    if(container) {
        container.style.display = 'none';
        console.log("Slider closed"); // 동작 확인용
    }
}

// [기존 코드 수정] snapToNearestSlideV2 함수 내부 
// 드래그 시 한 장씩 딱딱 끊기도록 감도 조절 (슬라이드 넓이의 1/10만 이동해도 넘어가게)
function snapToNearestSlideV2() {
    const movedBy = currentTranslateV2 - prevTranslateV2;
    
    // 감도 조절: 100픽셀 이상 움직이면 다음장으로
    if (movedBy < -100 && currentIndexV2 < totalSlidesV2 - 1) {
        currentIndexV2++;
    } else if (movedBy > 100 && currentIndexV2 > 0) {
        currentIndexV2--;
    }
    
    goToSlideV2(currentIndexV2);
}

// 기존에 흩어져 있던 오버라이드 로직을 하나로 합칩니다.
function goToPage(id) {
    // 1. 깜빡임 효과
    const flash = document.getElementById('flash-overlay');
    if (flash) {
        flash.classList.remove('flash-active');
        void flash.offsetWidth; 
        flash.classList.add('flash-active');
    }

    // 2. 모든 페이지 비활성화 후 선택한 페이지 활성화
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    
    // 3. 페이지별 특수 로직 (잠금, 포커스, 슬라이더 등)
    const sContainer = document.getElementById('slider-container-v2');
    const sPagination = document.getElementById('pagination-v2');

    if (id === 'page3') {
        setStaticTime();
        document.getElementById('full-screen-fechar').style.display = 'none';
        document.getElementById('locking-overlay').style.display = 'none';
        document.getElementById('unlock-btn').style.display = 'none';
    } 
    else if (id === 'page3-3') {
        setTimeout(focusFakeInput, 100);
    }
    else if (id === 'page3-1') {
        if(sPagination) sPagination.style.display = 'flex';
    }

    // 다른 페이지로 이동 시 슬라이더 자동 닫기
    if (id !== 'page3-1') {
        if(sContainer) sContainer.style.display = 'none';
        if(sPagination) sPagination.style.display = 'none';
    }

    resizeApp();
}