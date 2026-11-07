document.addEventListener("DOMContentLoaded", () => {
    const subjectsContainer = document.getElementById("subjects-inputs");
    const calcBtn = document.getElementById("calc-btn");
    const resultBox = document.getElementById("result-box");
    const finalScoreDisplay = document.getElementById("final-score");
    const scoreMsg = document.getElementById("score-msg");
    const streamSelect = document.getElementById("stream-select");

    // مواد ومعاملات الشعبة (مثال: تقني رياضي - هندسة كهربائية)
    const subjectsData = {
        "tech-math": [
            { name: "الهندسة الكهربائية", coeff: 7 },
            { name: "الفيزياء", coeff: 6 },
            { name: "الرياضيات", coeff: 6 },
            { name: "العربية", coeff: 3 },
            { name: "الفلسفة", coeff: 2 },
            { name: "اللغات الأجنبية (فرنسية/إنجليزية)", coeff: 5 },
            { name: "العلوم الإسلامية", coeff: 2 },
            { name: "التاريخ والجغرافيا", coeff: 2 }
        ],
        "sciences": [
            { name: "علوم الطبيعة والحياة", coeff: 6 },
            { name: "الفيزياء", coeff: 5 },
            { name: "الرياضيات", coeff: 5 },
            { name: "العربية", coeff: 3 },
            { name: "الفلسفة", coeff: 2 },
            { name: "اللغات الأجنبية", coeff: 5 },
            { name: "العلوم الإسلامية", coeff: 2 },
            { name: "التاريخ والجغرافيا", coeff: 2 }
        ],
        "math": [
            { name: "الرياضيات", coeff: 7 },
            { name: "الفيزياء", coeff: 6 },
            { name: "علوم الطبيعة والحياة", coeff: 2 },
            { name: "العربية", coeff: 3 },
            { name: "الفلسفة", coeff: 2 },
            { name: "اللغات الأجنبية", coeff: 5 },
            { name: "العلوم الإسلامية", coeff: 2 },
            { name: "التاريخ والجغرافيا", coeff: 2 }
        ]
    };

    function loadSubjects() {
        const selectedStream = streamSelect.value;
        const subjects = subjectsData[selectedStream] || subjectsData["tech-math"];
        
        subjectsContainer.innerHTML = "";
        subjects.forEach((sub, index) => {
            const row = document.createElement("div");
            row.className = "sub-row";
            row.innerHTML = `
                <span>${sub.name} (المعامل: ${sub.coeff})</span>
                <input type="number" min="0" max="20" step="0.25" placeholder="00.00" data-coeff="${sub.coeff}" class="sub-input">
            `;
            subjectsContainer.appendChild(row);
        });
    }

    streamSelect.addEventListener("change", loadSubjects);
    loadSubjects();

    calcBtn.addEventListener("click", () => {
        const inputs = document.querySelectorAll(".sub-input");
        let totalSum = 0;
        let totalCoeffs = 0;
        let isValid = true;

        inputs.forEach(input => {
            let val = parseFloat(input.value);
            let coeff = parseFloat(input.getAttribute("data-coeff"));
            
            if (isNaN(val) || val < 0 || val > 20) {
                isValid = false;
            }
            totalSum += (isNaN(val) ? 0 : val) * coeff;
            totalCoeffs += coeff;
        });

        if (!isValid) {
            alert("يرجى التأكد من إدخال نقاط صحيحة بين 0 و 20 لكل المواد!");
            return;
        }

        let finalAverage = totalSum / totalCoeffs;
        finalScoreDisplay.textContent = finalAverage.toFixed(2);

        if (finalAverage >= 10) {
            scoreMsg.textContent = "مبروك! أنت ناجح وبمعدل ممتاز 🎉";
        } else {
            scoreMsg.textContent = "ستصل لهدفك، واصل العمل والاجتهاد! 💪";
        }

        resultBox.classList.remove("hidden");
    });
});
// كود الإعلانات الإجبارية والعد التنازلي عند الضغط على أزرار التحميل
document.addEventListener("DOMContentLoaded", () => {
    const lessonButtons = document.querySelectorAll(".btn-lesson, .btn-card");

    lessonButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault(); // منع الانتقال المباشر

            // إنشاء نافذة إجبارية مؤقتة (Popup / Interstitial Simulation)
            const adOverlay = document.createElement("div");
            adOverlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(11, 15, 25, 0.95); display: flex; flex-direction: column;
                justify-content: center; align-items: center; z-index: 9999; color: #fff;
                font-family: 'Tajawal', sans-serif; text-align: center; padding: 20px;
            `;

            let timeLeft = 5; // عدد ثواني الانتظار الإجبارية
            adOverlay.innerHTML = `
                <div style="background: #151c2c; border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 16px; max-width: 400px; width: 100%;">
                    <h3 style="margin-bottom: 15px; color: #f59e0b;">📢 إعلان برعاية المنصة</h3>
                    <p style="color: #94a3b8; margin-bottom: 20px; font-size: 0.95rem;">يرجى الانتظار قليلاً بينما يتم تجهيز الملف لك...</p>
                    <div id="ad-timer" style="font-size: 2.5rem; font-weight: 900; color: #10b981; margin-bottom: 20px;">${timeLeft}</div>
                    <button id="skip-ad-btn" disabled style="width: 100%; padding: 12px; background: #334155; color: #94a3b8; border: none; border-radius: 8px; font-weight: bold; cursor: not-allowed; transition: 0.3s;">
                        يرجى الانتظار...
                    </button>
                </div>
            `;

            document.body.appendChild(adOverlay);

            const timerDisplay = document.getElementById("ad-timer");
            const skipBtn = document.getElementById("skip-ad-btn");

            // تشغيل العد التنازلي الإجباري
            const countdown = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(countdown);
                    timerDisplay.textContent = "✓ جاهز";
                    skipBtn.disabled = false;
                    skipBtn.style.background = "#6366f1"; // لون زر الانتقال النشط
                    skipBtn.style.color = "#fff";
                    skipBtn.style.cursor = "pointer";
                    skipBtn.textContent = "انتقال إلى المحتوى / التحميل";
                }
            }, 1000);

            // عند الضغط على زر التخطي بعد انتهاء العد
            skipBtn.addEventListener("click", () => {
                if (!skipBtn.disabled) {
                    // هنا يمكنك لاحقاً وضع رابط إعلانك الحقيقي من Adsterra (Direct Link) أو فتح الملف
                    window.open("https://www.example.com", "_blank"); // رابط إعلاني أو رابط الملف
                    document.body.removeChild(adOverlay);
                }
            });
        });
    });
});
