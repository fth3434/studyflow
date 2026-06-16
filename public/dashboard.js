let chart;

async function checkAuth() {
    const res = await fetch("/me");
    const data = await res.json();
    if (!data || data.message === "Giriş yapılmamış") {
        window.location.href = "/login.html";
    }
}

let dashboardData = { completedTasks: 0, pendingTasks: 0, totalTasks: 0, completionRate: 0 };

async function loadDashboard() {
    const response = await fetch("/dashboard-data");
    dashboardData = await response.json();
    document.getElementById("totalTasks").innerText = dashboardData.totalTasks;
    document.getElementById("completedTasks").innerText = dashboardData.completedTasks;
    document.getElementById("pendingTasks").innerText = dashboardData.pendingTasks;
    document.getElementById("completionRate").innerText = "%" + dashboardData.completionRate;

    const dashSec = document.getElementById("dashboardSection");
    if (dashSec && dashSec.style.display !== "none") {
        renderChart(dashboardData.completedTasks, dashboardData.pendingTasks);
    }
}

async function createTask() {
    const title = document.getElementById("taskInput").value;
    if (title === "") return;
    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });
    showNotification("Görev eklendi 🚀");
    document.getElementById("taskInput").value = "";
    loadDashboard();
    loadTasks();
}

async function addStudySession() {
    const subject = document.getElementById("subjectInput").value;
    const topic = document.getElementById("topicInput").value;
    const hours = document.getElementById("hoursInput").value || 0;
    const minutes = document.getElementById("minutesInput").value || 0;

    if (subject === "" || (hours == 0 && minutes == 0) || Number(hours) < 0 || Number(minutes) < 0) {
        showNotification("Lütfen geçerli bir ders ve pozitif süre girin!");
        return;
    }

    await fetch("/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, hours: Number(hours), minutes: Number(minutes) })
    });
    showNotification("Çalışma kaydedildi ⏱️");
    document.getElementById("subjectInput").value = "";
    document.getElementById("topicInput").value = "";
    document.getElementById("hoursInput").value = "";
    document.getElementById("minutesInput").value = "";
    loadStudySessions();
}

function renderChart(completed, pending) {
    const ctx = document.getElementById("taskChart");
    if (!ctx) return;

    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Tamamlanan", "Bekleyen"],
            datasets: [{ data: [completed, pending] }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    if (!taskList) return;

    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        if (task.completed) {
            li.classList.add("completed");
        }
        li.innerHTML = `
            <span>${task.title}</span>
            <div class="task-buttons">
                <button class="complete-btn" onclick="toggleTask(${task.id})" title="Tamamlandı İşaretle">✔</button>
                <button class="edit-btn" onclick="editTask(${task.id}, '${task.title.replace(/'/g, "\\'")}')" title="Düzenle">✏️</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})" title="Sil">✕</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

async function toggleTask(id) {
    await fetch(`/tasks/${id}/toggle`, { method: "PATCH" });
    loadTasks();
    loadDashboard();
}

async function editTask(id, currentTitle) {
    const newTitle = prompt("Görevi güncelle:", currentTitle);
    if (newTitle !== null && newTitle.trim() !== "" && newTitle !== currentTitle) {
        await fetch(`/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim() })
        });
        showNotification("Görev güncellendi ✏️");
        loadTasks();
    }
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
    loadDashboard();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

async function addExam() {
    const title = document.getElementById("examTitle").value;
    const examDate = document.getElementById("examDate").value;
    if (title === "" || examDate === "") return;

    await fetch("/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, examDate })
    });
    showNotification("Sınav eklendi 📅");
    document.getElementById("examTitle").value = "";
    document.getElementById("examDate").value = "";
    loadExams();
}

let examInterval;

async function loadExams() {
    const response = await fetch("/exams");
    const exams = await response.json();
    const examList = document.getElementById("examList");
    if (!examList) return;

    if (examInterval) clearInterval(examInterval);
    examList.innerHTML = "";

    const nowTime = new Date().getTime();
    const upcoming = [];
    const past = [];

    exams.forEach(ex => {
        if (new Date(ex.examDate).getTime() < nowTime) past.push(ex);
        else upcoming.push(ex);
    });

    const sortedExams = [...upcoming, ...past];

    sortedExams.forEach(exam => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const examDateStr = new Date(exam.examDate).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        li.innerHTML = `
            <div class="exam-item">
                <div class="exam-info">
                    <span class="exam-title">${exam.title}</span>
                    <span class="exam-date">${examDateStr}</span>
                </div>
                <div class="exam-countdown" id="countdown-${exam.id}">
                    <div class="time-box"><span>--</span><small>Gün</small></div>
                    <div class="time-box"><span>--</span><small>Saat</small></div>
                    <div class="time-box"><span>--</span><small>Dk</small></div>
                    <div class="time-box"><span>--</span><small>Sn</small></div>
                </div>
                <div class="task-buttons">
                    <button class="edit-btn" onclick="editExam(${exam.id}, '${exam.title.replace(/'/g, "\\'")}', '${exam.examDate}')" title="Düzenle">✏️</button>
                    <button class="delete-btn" onclick="deleteExam(${exam.id})" title="Sil">✕</button>
                </div>
            </div>
        `;
        examList.appendChild(li);
    });

    function updateCountdowns() {
        const now = new Date().getTime();
        exams.forEach(exam => {
            const el = document.getElementById(`countdown-${exam.id}`);
            if (!el) return;

            const examTime = new Date(exam.examDate).getTime();
            const distance = examTime - now;

            if (distance < 0) {
                el.innerHTML = `<div class="time-box" style="background: #10b981; min-width: 120px;"><span>Sınav Geçti 🏁</span></div>`;
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            el.innerHTML = `
                <div class="time-box"><span>${days.toString().padStart(2, '0')}</span><small>Gün</small></div>
                <div class="time-box"><span>${hours.toString().padStart(2, '0')}</span><small>Saat</small></div>
                <div class="time-box"><span>${minutes.toString().padStart(2, '0')}</span><small>Dk</small></div>
                <div class="time-box"><span>${seconds.toString().padStart(2, '0')}</span><small>Sn</small></div>
            `;
        });
    }

    updateCountdowns();
    examInterval = setInterval(updateCountdowns, 1000);
}

async function deleteExam(id) {
    if(confirm("Sınavı silmek istediğinize emin misiniz?")) {
        await fetch(`/exams/${id}`, { method: "DELETE" });
        showNotification("Sınav silindi 🗑️");
        loadExams();
    }
}

async function editExam(id, currentTitle, currentDate) {
    const newTitle = prompt("Sınav adını güncelle:", currentTitle);
    if (!newTitle) return;
    
    // Provide a simple prompt for date update since datetime-local in prompt is hard
    // For a better UX, one could use a custom modal, but this works minimally.
    const newDateStr = prompt("Yeni tarihi girin (YYYY-MM-DDTHH:mm formatında, iptal için boş bırakın):", currentDate.slice(0, 16));
    const newDate = newDateStr ? newDateStr : currentDate;

    await fetch(`/exams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, examDate: newDate })
    });
    
    showNotification("Sınav güncellendi ✏️");
    loadExams();
}

function showNotification(message) {
    const box = document.getElementById("notification");
    box.innerText = message;
    box.classList.add("show");
    setTimeout(() => {
        box.classList.remove("show");
    }, 3000);
}

async function logout() {
    await fetch("/logout", { method: "POST" });
    window.location.href = "/login.html";
}

async function loadUser() {
    const res = await fetch("/me");
    const user = await res.json();
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) {
        if (user && user.name) {
            welcomeText.innerText = `Hoş geldin 👋 ${user.name}`;
            const profName = document.getElementById("profileName");
            const profEmail = document.getElementById("profileEmail");
            if(profName) profName.innerText = user.name;
            if(profEmail) profEmail.innerText = user.email;
        } else {
            welcomeText.innerText = "Hoş geldin 👋";
        }
    }
}

async function updatePassword() {
    const newPassword = document.getElementById("newPassword").value;
    if (!newPassword) {
        showNotification("Lütfen yeni şifre girin.");
        return;
    }
    try {
        const res = await fetch("/update-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword })
        });
        const data = await res.json();
        if (res.ok) {
            showNotification(data.message || "Şifre güncellendi");
            document.getElementById("newPassword").value = "";
        } else {
            showNotification(data.error || "Şifre güncellenemedi");
        }
    } catch (e) {
        showNotification("Hata oluştu");
    }
}

function showSection(section) {
    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("tasksSection").style.display = "none";
    document.getElementById("studySection").style.display = "none";
    document.getElementById("examSection").style.display = "none";
    const profileSec = document.getElementById("profileSection");
    if(profileSec) profileSec.style.display = "none";

    const title = document.getElementById("pageTitle");

    if (section === "dashboard") {
        document.getElementById("dashboardSection").style.display = "block";
        if (title) title.innerText = "Ana Sayfa";
        renderChart(dashboardData.completedTasks, dashboardData.pendingTasks);
    } else if (section === "tasks") {
        document.getElementById("tasksSection").style.display = "block";
        if (title) title.innerText = "Görevler";
    } else if (section === "study") {
        document.getElementById("studySection").style.display = "block";
        if (title) title.innerText = "Çalışma Oturumları";
    } else if (section === "exams" || section === "courses") {
        document.getElementById("examSection").style.display = "block";
        if (title) title.innerText = "Dersler ve Sınavlar";
    } else if (section === "profile") {
        if(profileSec) profileSec.style.display = "block";
        if (title) title.innerText = "Profil";
    }

    // Close sidebar on mobile
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
    }
    if (overlay && overlay.classList.contains("show")) {
        overlay.classList.remove("show");
    }
}

const quotes = [
    "Hiçkimse başarı merdivenlerini elleri cebinde çıkmamıştır. 🧗‍♂️",
    "Başlamak için mükemmel olmak zorunda değilsin, ama mükemmel olmak için başlamak zorundasın. 🚀",
    "Gelecek, bugünden hazırlananlara aittir. 🔮",
    "Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır. 🌍",
    "Zorluklar, yeteneklerinizi ortaya çıkaran fırsatlardır. 💎",
    "Mazeretler sizi sadece olduğunuz yerde tutar. Harekete geç! 🏃‍♂️",
    "Başarı, her gün tekrarlanan küçük çabaların toplamıdır. 💧",
    "Daha iyi bir yarın için, bugün dünden daha fazla çalış. 📈",
    "Büyük hayaller kur, küçük adımlarla başla. 🎯",
    "Yorgun olduğunda değil, işin bittiğinde dur. 🛑"
];

function changeQuote() {
    const quoteEl = document.getElementById("motivationalQuote");
    if (!quoteEl) return;

    let currentQuote = quoteEl.innerText;
    let newQuote = currentQuote;
    while (newQuote === currentQuote) {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }

    quoteEl.style.opacity = 0;
    setTimeout(() => {
        quoteEl.innerText = newQuote;
        quoteEl.style.opacity = 1;
    }, 300);
}

checkAuth();
loadUser();
loadDashboard();
loadTasks();
loadExams();
loadStudySessions();
loadCourses();
changeQuote();
updateCalculatorUI();

// Pomodoro Timer Logic
let timerInterval;
let timeLeft = 45 * 60;
let isWorking = true;
let isTimerRunning = false;

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const display = document.getElementById("timerDisplay");
    if (display) display.innerText = formatTime(timeLeft);
}

function updateTimerStatus(text, color) {
    const status = document.getElementById("timerStatus");
    if (status) {
        status.innerText = text;
        status.style.color = color;
    }
}

function updatePomodoroTheme() {
    const container = document.getElementById("pomodoroContainer");
    if (!container) return;

    if (isTimerRunning) {
        if (isWorking) {
            container.classList.add("work-mode");
            container.classList.remove("break-mode");
        } else {
            container.classList.add("break-mode");
            container.classList.remove("work-mode");
        }
    } else {
        container.classList.remove("work-mode", "break-mode");
    }
}

function startTimer() {
    if (isTimerRunning) return;

    isTimerRunning = true;
    updatePomodoroTheme();
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            
            // Audio Alert
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
                oscillator.connect(audioCtx.destination);
                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.4);
            } catch(e) {
                console.log("Audio not supported or blocked");
            }
            
            setTimeout(() => { alert("Zaman doldu! (Time's up!)"); }, 100);

            const workMins = parseInt(document.getElementById("workTime").value) || 45;
            const breakMins = parseInt(document.getElementById("breakTime").value) || 15;

            if (isWorking) {
                showNotification("Çalışma süreniz bitti, şimdi mola zamanı! ☕");
                isWorking = false;
                timeLeft = breakMins * 60;
                updateTimerStatus("Mola Zamanı", "#10b981");
            } else {
                showNotification("Mola bitti, çalışmaya geri dön! 🚀");
                isWorking = true;
                timeLeft = workMins * 60;
                updateTimerStatus("Çalışma Zamanı", "#4f46e5");
            }
            updateTimerDisplay();
            updatePomodoroTheme();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    updatePomodoroTheme();
}

function stopTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isWorking = true;
    const workMins = parseInt(document.getElementById("workTime").value) || 45;
    timeLeft = workMins * 60;
    updateTimerStatus("Çalışma Zamanı", "#4f46e5");
    updateTimerDisplay();
    updatePomodoroTheme();
}

// Listen to input changes to update timer if not running
const workInput = document.getElementById('workTime');
if (workInput) {
    workInput.addEventListener('input', () => {
        if (!isTimerRunning && isWorking) {
            timeLeft = (parseInt(workInput.value) || 45) * 60;
            updateTimerDisplay();
        }
    });
}

async function loadStudySessions() {
    const response = await fetch("/study-sessions");
    const sessions = await response.json();
    const studyList = document.getElementById("studyList");
    if (!studyList) return;

    studyList.innerHTML = "";
    sessions.forEach(session => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        let topicHtml = session.topic ? `<br><small style="color: #6b7280;">Konu: ${session.topic}</small>` : '';
        let durationHtml = "";
        if (session.hours > 0) durationHtml += `${session.hours} Saat `;
        if (session.minutes > 0) durationHtml += `${session.minutes} Dk`;
        if (durationHtml === "") durationHtml = `0 Dk`;

        li.innerHTML = `
            <div class="session-item">
                <div class="session-info">
                    <span class="session-subject">${session.subject}</span>
                    ${session.topic ? `<span class="session-topic">${session.topic}</span>` : ''}
                </div>
                <div class="session-stats">
                    <span class="session-duration">${durationHtml.trim()}</span>
                    <span class="session-date">${new Date(session.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <button class="delete-btn" onclick="deleteStudySession(${session.id})" title="Sil">✕</button>
            </div>
        `;
        studyList.appendChild(li);
    });
}

async function deleteStudySession(id) {
    if (confirm("Bu çalışmayı silmek istediğinize emin misiniz?")) {
        await fetch(`/study-sessions/${id}`, { method: "DELETE" });
        showNotification("Çalışma silindi 🗑️");
        loadStudySessions();
    }
}

const gradePoints = {
    "AA": 4.0,
    "BA": 3.5,
    "BB": 3.0,
    "CB": 2.5,
    "CC": 2.0,
    "DC": 1.5,
    "FF": 0.0
};

// GANO CALCULATOR LOGIC
function updateCalculatorUI() {
    const level = document.getElementById("educationLevel").value;
    const semesterSelect = document.getElementById("semesterSelect");
    const gpaLabel = document.getElementById("gpaLabel");

    semesterSelect.innerHTML = "";
    if (level === "uni") {
        semesterSelect.innerHTML = `
            <option value="Güz">Güz Dönemi</option>
            <option value="Bahar">Bahar Dönemi</option>
            <option value="Yaz">Yaz Okulu</option>
        `;
        gpaLabel.innerText = "Dönem Sonu GANO";
    } else {
        semesterSelect.innerHTML = `
            <option value="1. Dönem">1. Dönem</option>
            <option value="2. Dönem">2. Dönem</option>
        `;
        gpaLabel.innerText = "Dönem Ortalaması";
    }

    generateCourseInputs();
    loadCourses();
}

function generateCourseInputs() {
    const container = document.getElementById("calculatorInputs");
    if (!container) return;
    const count = parseInt(document.getElementById("courseCount").value) || 5;
    const level = document.getElementById("educationLevel").value;

    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.gap = "10px";
        row.style.marginBottom = "10px";

        let inputsHtml = "";
        if (level === "uni") {
            inputsHtml = `
                <input type="text" id="calcName_${i}" placeholder="${i}. Ders Adı" style="flex: 2; min-width: 120px; margin: 0;">
                <input type="number" id="calcCredits_${i}" placeholder="Kredi" min="1" max="10" style="flex: 1; min-width: 60px; margin: 0;">
                <input type="number" id="calcMidterm_${i}" placeholder="Vize" min="0" max="100" style="flex: 1; min-width: 60px; margin: 0;">
                <input type="number" id="calcFinal_${i}" placeholder="Final" min="0" max="100" style="flex: 1; min-width: 60px; margin: 0;">
                <div id="calcRes_${i}" style="width: 50px; font-weight: bold; text-align: center; line-height: 38px;">-</div>
            `;
        } else {
            inputsHtml = `
                <input type="text" id="calcName_${i}" placeholder="${i}. Ders Adı" style="flex: 2; min-width: 120px; margin: 0;">
                <input type="number" id="calcCredits_${i}" placeholder="Ders Saati" min="1" max="15" style="flex: 1; min-width: 80px; margin: 0;">
                <input type="number" id="calcMidterm_${i}" placeholder="1. Sınav" min="0" max="100" style="flex: 1; min-width: 60px; margin: 0;">
                <input type="number" id="calcFinal_${i}" placeholder="2. Sınav" min="0" max="100" style="flex: 1; min-width: 60px; margin: 0;">
                <div id="calcRes_${i}" style="width: 50px; font-weight: bold; text-align: center; line-height: 38px;">-</div>
            `;
        }

        row.innerHTML = inputsHtml;
        container.appendChild(row);
    }
}

function calculateGPA() {
    const count = parseInt(document.getElementById("courseCount").value) || 5;
    const level = document.getElementById("educationLevel").value;

    let totalPoints = 0;
    let totalCredits = 0;

    for (let i = 1; i <= count; i++) {
        const credits = parseFloat(document.getElementById(`calcCredits_${i}`).value);
        const midterm = parseFloat(document.getElementById(`calcMidterm_${i}`).value);
        const final = parseFloat(document.getElementById(`calcFinal_${i}`).value);
        const resEl = document.getElementById(`calcRes_${i}`);

        if (isNaN(credits) || isNaN(midterm) || isNaN(final)) continue;

        if (level === "uni") {
            const avg = (midterm * 0.4) + (final * 0.6);
            let letter = "FF";
            if (avg >= 90) letter = "AA"; else if (avg >= 85) letter = "BA"; else if (avg >= 80) letter = "BB"; else if (avg >= 70) letter = "CB"; else if (avg >= 60) letter = "CC"; else if (avg >= 50) letter = "DC";

            resEl.innerText = letter;
            resEl.style.color = letter === "FF" ? "red" : "green";

            totalPoints += (gradePoints[letter] || 0) * credits;
            totalCredits += credits;
        } else {
            const avg = (midterm + final) / 2;
            resEl.innerText = avg.toFixed(1);
            resEl.style.color = avg < 50 ? "red" : "green";

            totalPoints += avg * credits;
            totalCredits += credits;
        }
    }

    const ganoResult = document.getElementById("ganoResult");
    if (totalCredits > 0) {
        ganoResult.innerText = (totalPoints / totalCredits).toFixed(2);
    } else {
        ganoResult.innerText = "0.00";
    }
}

function resetGPA() {
    generateCourseInputs();
    document.getElementById("ganoResult").innerText = "0.00";
}

async function saveGPA() {
    const count = parseInt(document.getElementById("courseCount").value) || 5;
    const level = document.getElementById("educationLevel").value;
    const semester = document.getElementById("semesterSelect").value;

    let savedCount = 0;
    for (let i = 1; i <= count; i++) {
        const name = document.getElementById(`calcName_${i}`).value;
        const credits = document.getElementById(`calcCredits_${i}`).value;
        const midterm = document.getElementById(`calcMidterm_${i}`).value;
        const final = document.getElementById(`calcFinal_${i}`).value;

        if (!name || !credits || midterm === "" || final === "") continue;

        let customAvg = undefined;
        let customLetter = undefined;

        if (level === "highschool") {
            customAvg = (Number(midterm) + Number(final)) / 2;
            customLetter = customAvg < 50 ? "Kaldı" : "Geçti";
        }

        await fetch("/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name + ` (${semester})` + (level === "highschool" ? " (Lise/OO)" : ""),
                credits: Number(credits),
                midterm: Number(midterm),
                final: Number(final),
                average: customAvg,
                letterGrade: customLetter
            })
        });
        savedCount++;
    }

    if (savedCount > 0) {
        showNotification(`${savedCount} ders başarıyla kaydedildi 🎓`);
        loadCourses();
    } else {
        showNotification("Kaydedilecek geçerli bir ders bulunamadı! Lütfen tüm alanları doldurun.");
    }
}

async function loadCourses() {
    const response = await fetch("/courses");
    const courses = await response.json();
    const courseList = document.getElementById("courseList");
    if (!courseList) return;

    const levelEl = document.getElementById("educationLevel");
    const level = levelEl ? levelEl.value : "uni";

    courseList.innerHTML = "";

    let totalCreditPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const isHsCourse = course.name.includes("(Lise/OO)");

        if (level === "uni" && isHsCourse) return;
        if (level === "highschool" && !isHsCourse) return;

        const li = document.createElement("li");
        li.classList.add("task-item");

        let gradeColor = course.letterGrade === "FF" || course.letterGrade === "Kaldı" ? "#ef4444" : "#10b981";
        if (course.letterGrade.includes("D") || course.letterGrade.includes("C")) gradeColor = "#f59e0b";

        const displayName = course.name.replace(" (Lise/OO)", "");
        const creditsLabel = level === "uni" ? "Kredi" : "Saat";
        const midLabel = level === "uni" ? "Vize" : "1.Sınav";
        const finLabel = level === "uni" ? "Final" : "2.Sınav";

        li.innerHTML = `
            <div class="course-item">
                <div class="course-info">
                    <span class="course-name">${displayName}</span>
                    <span class="course-credits">${course.credits} ${creditsLabel}</span>
                </div>
                <div class="course-grades">
                    <span class="grade-pill">${midLabel}: ${course.midterm}</span>
                    <span class="grade-pill">${finLabel}: ${course.final}</span>
                    <span class="grade-pill avg">Ort: ${course.average}</span>
                </div>
                <div class="course-letter" style="background: ${gradeColor};">
                    ${course.letterGrade}
                </div>
                <div class="task-buttons">
                    <button class="edit-btn" onclick="editCourse(${course.id}, '${displayName}', ${course.credits}, ${course.midterm}, ${course.final})" title="Düzenle">✏️</button>
                    <button class="delete-btn" onclick="deleteCourse(${course.id})" title="Sil">✕</button>
                </div>
            </div>
        `;
        courseList.appendChild(li);

        if (level === "uni") {
            if (gradePoints[course.letterGrade] !== undefined) {
                totalCreditPoints += gradePoints[course.letterGrade] * course.credits;
                totalCredits += course.credits;
            }
        } else {
            totalCreditPoints += course.average * course.credits;
            totalCredits += course.credits;
        }
    });

    const ganoResult = document.getElementById("ganoResult");
    if (ganoResult) {
        if (totalCredits > 0) {
            ganoResult.innerText = (totalCreditPoints / totalCredits).toFixed(2);
        } else {
            ganoResult.innerText = "0.00";
        }
    }
}

async function deleteCourse(id) {
    if(confirm("Dersi silmek istediğinize emin misiniz?")) {
        await fetch(`/courses/${id}`, { method: "DELETE" });
        showNotification("Ders silindi 🗑️");
        loadCourses();
    }
}

async function editCourse(id, name, credits, midterm, final) {
    const newName = prompt("Dersin adı:", name);
    if (!newName) return;
    const newCredits = prompt("Kredi/Saat:", credits);
    const newMidterm = prompt("Vize/1.Sınav:", midterm);
    const newFinal = prompt("Final/2.Sınav:", final);

    if(newCredits !== null && newMidterm !== null && newFinal !== null) {
        await fetch(`/courses/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: newName, 
                credits: Number(newCredits), 
                midterm: Number(newMidterm), 
                final: Number(newFinal) 
            })
        });
        showNotification("Ders güncellendi ✏️");
        loadCourses();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    if (sidebar) {
        sidebar.classList.toggle("open");
    }
    if (overlay) {
        overlay.classList.toggle("show");
    }
}
