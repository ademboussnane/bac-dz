let players = [];
let currentRevealIndex = 0;
let gameState = {
    phase: 'setup',
    dayNumber: 1,
    wolfTarget: null,
    doctorTarget: null,
    witchPotionSaved: true,
    witchPotionKill: true,
    witchTarget: null,
    copTarget: null
};

// صور وأوصاف الأدوار الاحترافية للقرية والذئاب
const roleAssets = {
    'ذئب': {
        img: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=500&q=80",
        desc: "أنت ذئب مفترس! تختار مع قطيعك ضحية من القرية كل ليلة للافتراس."
    },
    'طبيب': {
        img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80",
        desc: "أنت طبيب القرية الحكيم! يمكنك حماية شخص واحد كل ليلة من أنياب الذئاب."
    },
    'محقق': {
        img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80",
        desc: "أنت محقق القرية الذكي! تكشف الهوية الحقيقية لأحد اللاعبين سراً."
    },
    'ساحر': {
        img: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=500&q=80",
        desc: "أنت الساحر الغامض! تمتلك جرعة شفاء لإنقاذ شخص وجرعة سحر قاتلة تستخدمها مرة واحدة."
    },
    'صياد': {
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
        desc: "أنت صياد محترف! إذا مت، يمكنك أخذ شخص معك إلى القبر في اللحظة الأخيرة."
    },
    'قروي': {
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
        desc: "أنت مواطن بريء من أهل القرية! تعاون مع الجميع لكشف الذئاب المندسّة."
    }
};

// عناصر الواجهة
const setupScreen = document.getElementById('setupScreen');
const revealScreen = document.getElementById('revealScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

const playerNameInput = document.getElementById('playerNameInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersList = document.getElementById('playersList');
const startGameBtn = document.getElementById('startGameBtn');

// إضافة اللاعبين
addPlayerBtn.addEventListener('click', addPlayer);
playerNameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addPlayer(); });

function addPlayer() {
    const name = playerNameInput.value.trim();
    if (name && !players.find(p => p.name === name)) {
        players.push({ name, role: '', isAlive: true });
        playerNameInput.value = '';
        renderPlayers();
    }
}

function renderPlayers() {
    playersList.innerHTML = players.map((p, index) => `
        <li>
            <span><i class="fa-solid fa-user-shield"></i> ${p.name}</span>
            <button onclick="removePlayer(${index})"><i class="fa-solid fa-trash-can"></i></button>
        </li>
    `).join('');
}

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayers();
}

// بدء اللعبة وتوزيع الأدوار ديناميكياً حسب عدد اللاعبين
startGameBtn.addEventListener('click', () => {
    if (players.length < 4) {
        alert("⚠️ يلزم 4 لاعبين على الأقل لبدء ملحمة الذئاب والقرية!");
        return;
    }
    assignRolesDynamically();
    showScreen(revealScreen);
    currentRevealIndex = 0;
    setupRevealStep();
});

// توزيع الأدوار التلقائي الذكي حسب حجم العدد (من 6 إلى 20+ لاعب)
function assignRolesDynamically() {
    let count = players.length;
    let roles = [];

    // تحديد عدد الذئاب (حوالي ربع أو ثلث العدد بحدود عقلانية)
    let wolfCount = count <= 6 ? 1 : (count <= 12 ? 2 : 4);
    
    for (let i = 0; i < wolfCount; i++) roles.push('ذئب');
    
    // أدوار أساسية وكبرى تتناسب مع العدد
    roles.push('طبيب');
    roles.push('محقق');
    
    if (count >= 8) roles.push('ساحر');
    if (count >= 10) roles.push('صياد');

    // تكملة الباقي قرويين أبرياء
    while (roles.length < count) {
        roles.push('قروي');
    }

    // خلط عشوائي للأدوار
    roles = roles.sort(() => Math.random() - 0.5);

    players.forEach((player, i) => {
        player.role = roles[i];
        player.isAlive = true;
    });
}

// عناصر كشف الهوية والتقليب 3D
const roleFlipCard = document.getElementById('roleFlipCard');
const flipCardContainer = document.getElementById('flipCardContainer');
const currentPlayerName = document.getElementById('currentPlayerName');
const nextPlayerBtn = document.getElementById('nextPlayerBtn');
const roleImg = document.getElementById('roleImg');
const roleTitleHeader = document.getElementById('roleTitleHeader');
const roleDescHeader = document.getElementById('roleDescHeader');

let isCardFlipped = false;

function setupRevealStep() {
    const player = players[currentRevealIndex];
    currentPlayerName.textContent = player.name;
    isCardFlipped = false;
    roleFlipCard.classList.remove('flipped');
    nextPlayerBtn.classList.add('hidden');
}

// الحدث الخاص بقلب البطاقة عند النقر
flipCardContainer.addEventListener('click', () => {
    if (isCardFlipped) return; // تم القلب مسبقاً لهذا اللاعب
    
    const player = players[currentRevealIndex];
    const asset = roleAssets[player.role];
    
    roleImg.src = asset.img;
    roleTitleHeader.innerHTML = `دورك هو: <span style="color:var(--wolf-color);">${player.role}</span>`;
    roleDescHeader.textContent = asset.desc;

    roleFlipCard.classList.add('flipped');
    isCardFlipped = true;
    nextPlayerBtn.classList.remove('hidden');
});

nextPlayerBtn.addEventListener('click', () => {
    currentRevealIndex++;
    if (currentRevealIndex < players.length) {
        setupRevealStep();
    } else {
        startNightPhase();
    }
});

// مرحلة الليل للذئاب والأدوار الخاصة
function startNightPhase() {
    gameState.phase = 'night';
    showScreen(gameScreen);
    document.getElementById('gamePhaseBadge').innerHTML = '<i class="fa-solid fa-moon"></i> حل ليل القرية المظلم';
    document.getElementById('dayCounter').innerHTML = `<i class="fa-solid fa-moon"></i> الليلة ${gameState.dayNumber}`;
    updateAliveCount();

    const actionArea = document.getElementById('actionArea');
    actionArea.innerHTML = `
        <h3><i class="fa-solid fa-paw"></i> تحرك الذئاب:</h3>
        <p>خرجت الذئاب من جحورها لاختيار فريسة الليلة:</p>
        ${getAlivePlayersOptions('setWolfTarget')}
    `;
}

function setWolfTarget(name) {
    gameState.wolfTarget = name;
    logEvent(`اختارت الذئاب ضحيتها المستهدفة هذه الليلة.`);
    startDoctorPhase();
}

function startDoctorPhase() {
    // التحقق إن كان الطبيب حياً، إذا لم يكن حياً نتخطى دوره تلقائياً
    const doctorAlive = players.find(p => p.role === 'طبيب' && p.isAlive);
    if (!doctorAlive) {
        startWitchPhase();
        return;
    }

    const actionArea = document.getElementById('actionArea');
    actionArea.innerHTML = `
        <h3><i class="fa-solid fa-user-doctor"></i> دور طبيب القرية:</h3>
        <p>اختر الشخص الذي تريد توفير العلاج والحماية له:</p>
        ${getAlivePlayersOptions('setDoctorTarget')}
    `;
}

function setDoctorTarget(name) {
    gameState.doctorTarget = name;
    logEvent(`قام الطبيب بحماية أحد سكان القرية.`);
    startWitchPhase();
}

function startWitchPhase() {
    const witchAlive = players.find(p => p.role === 'ساحر' && p.isAlive);
    if (!witchAlive) {
        startCopPhase();
        return;
    }

    const actionArea = document.getElementById('actionArea');
    let optionsHtml = `<p>الضحية التي استهدفتها الذئاب هي: <strong>${gameState.wolfTarget || 'لاشيء'}</strong></p>`;
    
    if (gameState.witchPotionSaved) {
        optionsHtml += `<button class="target-btn" onclick="witchSaveVictim()"><i class="fa-solid fa-flask"></i> استخدام جرعة الإنقاذ للضحية</button>`;
    }
    optionsHtml += `<button class="target-btn" onclick="skipWitchAction()" style="background:#1f2937;"><i class="fa-solid fa-forward"></i> تخطي سحر الليلة</button>`;

    actionArea.innerHTML = `
        <h3><i class="fa-solid fa-hat-wizard"></i> دور الساحر:</h3>
        ${optionsHtml}
    `;
}

function witchSaveVictim() {
    gameState.witchPotionSaved = false;
    gameState.doctorTarget = gameState.wolfTarget; // إنقاذ الضحية
    logEvent(`استخدم الساحر جرعة الشفاء السحرية وأنقذ الضحية.`);
    startCopPhase();
}

function skipWitchAction() {
    logEvent(`تخطى الساحر استخدام الجرعات هذه الليلة.`);
    startCopPhase();
}

function startCopPhase() {
    const copAlive = players.find(p => p.role === 'محقق' && p.isAlive);
    if (!copAlive) {
        processNightResults();
        return;
    }

    const actionArea = document.getElementById('actionArea');
    actionArea.innerHTML = `
        <h3><i class="fa-solid fa-magnifying-glass"></i> دور محقق القرية:</h3>
        <p>اختر لاعباً لكشف حقيقة انتمائه:</p>
        ${getAlivePlayersOptions('checkCopTarget')}
    `;
}

function checkCopTarget(name) {
    const target = players.find(p => p.name === name);
    const isWolf = target.role === 'ذئب';
    alert(`🔍 نتائج بحث المحقق:\n${target.name} تبين أنه: ${isWolf ? 'ذئب مفترس متخفي ⚠️' : 'شخص بريء 😇'}`);
    processNightResults();
}

// نتائج الليل وإشراقة النهار
function processNightResults() {
    gameState.phase = 'day';
    document.getElementById('gamePhaseBadge').innerHTML = '<i class="fa-solid fa-sun"></i> أشرق نهار القرية';
    
    let killed = null;
    if (gameState.wolfTarget && gameState.wolfTarget !== gameState.doctorTarget) {
        killed = players.find(p => p.name === gameState.wolfTarget);
        if (killed) killed.isAlive = false;
    }

    const actionArea = document.getElementById('actionArea');
    const nextPhaseBtn = document.getElementById('nextPhaseBtn');
    nextPhaseBtn.classList.remove('hidden');

    if (killed) {
        logEvent(`فجيعة في القرية: تم افتراس ${killed.name} ليلاً ❌`);
        actionArea.innerHTML = `
            <h3 style="color:var(--wolf-color);"><i class="fa-solid fa-triangle-exclamation"></i> هجوم مأساوي!</h3>
            <p>استيقظت القرية على خبر مفجع بمقتل <strong>${killed.name}</strong>.</p>
        `;
    } else {
        logEvent(`ليلة بيضاء: نجا الجميع ولم يصب أحد بأذى بفضل الحراسة! 🎉`);
        actionArea.innerHTML = `
            <h3 style="color:var(--success);"><i class="fa-solid fa-shield-heart"></i> ليلة آمنة!</h3>
            <p>تدخل الطبيب أو الساحر في الوقت المناسب وأنقذ الضحية المستهدفة!</p>
        `;
    }

    updateAliveCount();
    if (!checkWinCondition()) {
        nextPhaseBtn.onclick = startVotingPhase;
    }
}

// مرحلة التصويت وإعدام المشتبه بهم نهاراً
function startVotingPhase() {
    document.getElementById('nextPhaseBtn').classList.add('hidden');
    const actionArea = document.getElementById('actionArea');
    actionArea.innerHTML = `
        <h3><i class="fa-solid fa-gavel"></i> محاكمة واجتماع القرية:</h3>
        <p>ناقشوا واتفقوا على المشتبه به لإعدامه:</p>
        ${getAlivePlayersOptions('voteExecute')}
    `;
}

function voteExecute(name) {
    const executed = players.find(p => p.name === name);
    if (executed) {
        executed.isAlive = false;
        logEvent(`أعدمت القرية المشتبه به ${executed.name} وكان دوره: (${executed.role}).`);
        alert(`⚖️ قرار المحكمة:\nتم إعدام ${executed.name}! وتبين بعد فوات الأوان أن دوره كان: [ ${executed.role} ]`);
    }
    
    gameState.dayNumber++;
    updateAliveCount();
    if (!checkWinCondition()) {
        startNightPhase();
    }
}

function getAlivePlayersOptions(callbackFn) {
    return players.filter(p => p.isAlive).map(p => `
        <button class="target-btn" onclick="${callbackFn}('${p.name}')">
            <i class="fa-solid fa-user-large"></i> ${p.name}
        </button>
    `).join('');
}

function updateAliveCount() {
    const count = players.filter(p => p.isAlive).length;
    document.getElementById('aliveCount').innerHTML = `<i class="fa-solid fa-heart-pulse"></i> الأحياء: ${count}`;
}

function logEvent(msg) {
    const log = document.getElementById('logContent');
    log.innerHTML = `<div class="log-item">${msg}</div>` + log.innerHTML;
}

function checkWinCondition() {
    const aliveWolves = players.filter(p => p.isAlive && p.role === 'ذئب').length;
    const aliveVillagers = players.filter(p => p.isAlive && p.role !== 'ذئب').length;

    if (aliveWolves === 0) {
        showGameOver("انتصار أبطال القرية الأبرياء! 🎉", "تم القضاء على كافة الذئاب المفترسة وعاد الأمان لربوع القرية.", "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80");
        return true;
    } else if (aliveWolves >= aliveVillagers) {
        showGameOver("سيطرة الذئاب المفترسة! 💀", "تم القضاء على معظم السكان وتحولت القرية بالكامل لسيطرة الذئاب.", "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80");
        return true;
    }
    return false;
}

function showGameOver(title, desc, imgUrl) {
    showScreen(gameOverScreen);
    document.getElementById('winnerTitle').textContent = title;
    document.getElementById('winnerDesc').textContent = desc;
    document.getElementById('winnerImg').src = imgUrl;
}

document.getElementById('restartBtn').addEventListener('click', () => {
    players = [];
    gameState.dayNumber = 1;
    document.getElementById('logContent').innerHTML = '';
    showScreen(setupScreen);
    renderPlayers();
});

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}
