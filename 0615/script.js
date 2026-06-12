let isGameStarted = false; 

// 抽籤核心變數
let currentNumber = 0;
let isRolling = true;
let minNum = 1;   
let maxNum = 100; 
let particles = [];

// 連續抽籤邏輯變數
let totalDraws = 3;       // 預期總共要抽幾次 (從網頁輸入框讀取)
let currentDrawIndex = 0; // 目前是第幾次抽籤
let resultsArray = [];    // 儲存已經抽出來的號碼

// ==========================================
// 網頁 UI 切換與讀取設定邏輯
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const landingPage = document.getElementById('landing-page');
    const drawCountInput = document.getElementById('draw-count');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // 讀取使用者輸入的次數，並確保數值合法
            let count = parseInt(drawCountInput.value);
            if (isNaN(count) || count < 1) count = 1;
            
            totalDraws = count;
            currentDrawIndex = 0;
            resultsArray = []; // 重設中獎陣列
            isRolling = true;

            // 隱藏 Landing Page 並啟動 p5.js
            landingPage.classList.add('hidden');
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
    if (!isGameStarted) {
        noLoop(); 
        return;
    }

    background(15, 20, 30);
    drawBackgroundEffects();

    // 畫面主標題：顯示目前進度 (例如: 抽籤中 (1/3))
    fill(255, 200);
    textSize(24);
    if (currentDrawIndex < totalDraws) {
        text(`連續抽籤進度: ${currentDrawIndex + 1} / ${totalDraws}`, width / 2, 80);
    } else {
        text(`抽籤結束！共抽取 ${totalDraws} 個號碼`, width / 2, 80);
    }

    // 繪製抽籤核心字體
    if (currentDrawIndex < totalDraws) {
        if (isRolling) {
            // 滾動狀態：隨機跳動，且避免跳出已經中獎的數字
            do {
                currentNumber = floor(random(minNum, maxNum + 1));
            } while (resultsArray.includes(currentNumber));

            fill(0, 242, 254);
            textSize(random(110, 120)); 
            text(currentNumber, width / 2, height / 2 - 20);
            
            fill(255, 150);
            textSize(20);
            text(`【 點擊畫面 決定第 ${currentDrawIndex + 1} 個數字 】`, width / 2, height / 2 + 130);
        } else {
            // 凍結狀態：顯示剛抽出的數字
            fill(255, 94, 142); 
            textSize(150);
            let scaleEffect = sin(frameCount * 0.1) * 5;
            text(currentNumber, width / 2, height / 2 - 20 + scaleEffect);
            
            spawnParticles();
            
            fill(255, 180);
            textSize(20);
            let nextText = (currentDrawIndex + 1 < totalDraws) ? `【 點擊畫面 抽取下一個 】` : `【 點擊畫面 看最終結果 】`;
            text(nextText, width / 2, height / 2 + 130);
        }
    } else {
        // 所有次數都抽完了，大字顯示「DONE」或最終號碼
        fill(128, 208, 199);
        textSize(100);
        text("COMPLETE!", width / 2, height / 2 - 20);

        fill(255, 150);
        textSize(20);
        text("【 點擊畫面 重新回到首頁 】", width / 2, height / 2 + 130);
    }

    // 底部顯示：目前所有抽出的歷史號碼
    drawHistoryResults();

    // 更新慶祝粒子
    updateParticles();
}

// 點擊滑鼠互動邏輯
function mousePressed() {
    if (!isGameStarted) return; 

    // 如果還沒抽完
    if (currentDrawIndex < totalDraws) {
        if (isRolling) {
            // 1. 點擊凍結：數字停下，並塞入中獎陣列
            isRolling = false;
            resultsArray.push(currentNumber);
        } else {
            // 2. 點擊下一步：次數加 1，繼續滾動
            currentDrawIndex++;
            isRolling = true;
            particles = []; // 清空粒子特效
        }
    } else {
        // 如果全部抽完了，點擊就回到 Landing Page
        isGameStarted = false;
        document.getElementById('landing-page').classList.remove('hidden');
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// 背景裝飾線條
function drawBackgroundEffects() {
    stroke(255, 10);
    for (let i = 0; i < width; i += 80) line(i, 0, i, height);
    for (let j = 0; j < height; j += 80) line(0, j, width, j);
}

// 在畫面底部橫向排列顯示「已抽出的號碼」
function drawHistoryResults() {
    if (resultsArray.length === 0) return;

    textSize(22);
    fill(255, 255, 255, 120);
    text("已抽出的號碼: ", width / 2, height - 120);

    let boxSize = 60;
    let gap = 15;
    let totalWidth = resultsArray.length * boxSize + (resultsArray.length - 1) * gap;
    let startX = (width - totalWidth) / 2 + boxSize / 2;

    for (let i = 0; i < resultsArray.length; i++) {
        let x = startX + i * (boxSize + gap);
        let y = height - 60;

        // 畫方塊背景
        stroke(0, 242, 254, 100);
        fill(30, 40, 55);
        rectMode(CENTER);
        rect(x, y, boxSize, boxSize, 8);

        // 寫入數字
        noStroke();
        fill(0, 242, 254);
        textSize(24);
        text(resultsArray[i], x, y);
    }
}

// 慶祝粒子特效系統
function spawnParticles() {
    if (particles.length < 40) {
        particles.push({
            x: width / 2 + random(-40, 40),
            y: height / 2 + random(-40, 40),
            vx: random(-6, 6),
            vy: random(-6, -2),
            alpha: 255,
            color: color(random(150, 255), random(100, 255), random(150, 255))
        });
    }
}

function updateParticles() {
    noStroke();
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; 
        p.alpha -= 5; 
        
        fill(p.color.levels[0], p.color.levels[1], p.color.levels[2], p.alpha);
        ellipse(p.x, p.y, random(6, 12));
        
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }
}