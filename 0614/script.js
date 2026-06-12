// 宣告全域變數，用來標記使用者是否已經點擊「開始」
let isGameStarted = false; 

let currentNumber = 0;
let isRolling = true;
let minNum = 1;   // 抽籤最小範圍
let maxNum = 100; // 抽籤最大範圍
let particles = [];

// ==========================================
// 網頁 UI 切換邏輯
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const landingPage = document.getElementById('landing-page');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // 1. 隱藏 Landing Page
            landingPage.classList.add('hidden');
            
            // 2. 標記遊戲已開始，並手動喚醒 p5.js 的 loop
            isGameStarted = true;
            loop(); 
        });
    }
});

// ==========================================
// p5.js 核心程式碼
// ==========================================

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textFont('sans-serif');
}

function draw() {
    // 如果使用者還沒點擊「開始抽籤」，就先不執行後續的繪圖與計算，直接不渲染
    if (!isGameStarted) {
        noLoop(); // 確保一開始是靜態的
        return;
    }

    // 深色背景與微弱的漸層科技感
    background(15, 20, 30);
    
    // 繪製背景裝飾性粒子
    drawBackgroundEffects();

    if (isRolling) {
        // 滾動狀態：隨機快速跳動數字
        currentNumber = floor(random(minNum, maxNum + 1));
        
        // 繪製滾動時的視覺（發光藍色）
        fill(0, 242, 254);
        textSize(random(110, 120)); // 讓字體有震動感
        text(currentNumber, width / 2, height / 2);
        
        // 提示小字
        fill(255, 150);
        textSize(20);
        text("【 點擊畫面任意處 凍結數字 】", width / 2, height / 2 + 150);
    } else {
        // 停止/中獎狀態：顯示最終數字
        fill(255, 94, 142); // 亮麗的粉紅/紅色
        textSize(150);
        
        // 增加一點點放大的動態效果
        let scaleEffect = sin(frameCount * 0.1) * 5;
        text(currentNumber, width / 2, height / 2 + scaleEffect);
        
        // 噴發慶祝粒子
        spawnParticles();
        
        // 提示小字
        fill(255, 180);
        textSize(20);
        text("恭喜中獎！【 再次點擊 重新抽籤 】", width / 2, height / 2 + 150);
    }

    // 更新並繪製粒子
    updateParticles();
}

// 點擊滑鼠互動
function mousePressed() {
    // 如果還在 Landing Page，點擊畫布不觸發抽籤
    if (!isGameStarted) {
        return; 
    }

    if (isRolling) {
        // 凍結數字，產生中獎結果
        isRolling = false;
    } else {
        // 重新開始滾動
        isRolling = true;
        particles = []; // 清空粒子
    }
}

// 視窗大小改變時自動適應
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// 背景科技感線條與圓點
function drawBackgroundEffects() {
    stroke(255, 10);
    for (let i = 0; i < width; i += 80) {
        line(i, 0, i, height);
    }
    for (let j = 0; j < height; j += 80) {
        line(0, j, width, j);
    }
}

// 產生慶祝粒子
function spawnParticles() {
    if (particles.length < 50) {
        particles.push({
            x: width / 2 + random(-50, 50),
            y: height / 2 + random(-50, 50),
            vx: random(-5, 5),
            vy: random(-5, -2),
            alpha: 255,
            color: color(random(100, 255), random(100, 255), random(255))
        });
    }
}

// 更新粒子的狀態
function updateParticles() {
    noStroke();
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // 重力效果
        p.alpha -= 4; // 逐漸淡出
        
        fill(p.color.levels[0], p.color.levels[1], p.color.levels[2], p.alpha);
        ellipse(p.x, p.y, random(5, 12));
        
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}