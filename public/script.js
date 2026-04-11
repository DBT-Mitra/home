const colleges = [
  "Maulana Azad National Institute of Technology, Bhopal",
  "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur",
  "Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal",
  "University Institute of Technology, RGPV, Bhopal",
  "Shri Govindram Seksaria Institute of Technology and Science, Indore",
  "Jabalpur Engineering College, Jabalpur",
  "Madhav Institute of Technology and Science, Gwalior",
  "Lakshmi Narain College of Technology, Bhopal",
  "Lakshmi Narain College of Technology, Indore",
  "Sagar Institute of Research and Technology, Bhopal",
  "Technocrats Institute of Technology, Bhopal",
  "Oriental Institute of Science and Technology, Bhopal",
  "Truba Institute of Engineering and Information Technology, Bhopal",
  "IES College of Technology, Bhopal",
  "Bansal Institute of Science and Technology, Bhopal",
  "Patel College of Science and Technology, Bhopal",
  "Acropolis Institute of Technology and Research, Indore",
  "IPS Academy Institute of Engineering and Science, Indore",
  "Medicaps University, Indore",
  "Rustamji Institute of Technology, Gwalior",
  "Ujjain Engineering College, Ujjain",
  "Samrat Ashok Technological Institute, Vidisha",
  "Rewa Engineering College, Rewa",
  "Gyan Ganga Institute of Technology and Sciences, Jabalpur",
  "Sushila Devi Bansal College of Technology, Indore"
];

const quizQuestions = [
  {
    question: "What does DBT stand for?",
    options: ["Direct Benefit Transfer", "Digital Bank Token", "Dual Benefit Transfer", "Direct Budget Tracking"],
    correct: 0
  },
  {
    question: "Which document is most important for DBT identity verification?",
    options: ["Driving License", "Aadhaar Card", "Library Card", "PAN slip only"],
    correct: 1
  },
  {
    question: "Why is Aadhaar linking useful for DBT?",
    options: ["It enables easier identification for benefit delivery", "It increases tuition fees", "It replaces bank accounts", "It removes scholarships"],
    correct: 0
  },
  {
    question: "Where are activity logs managed now?",
    options: ["Only on the homepage", "Inside the protected dashboard", "Inside video player", "Inside footer"],
    correct: 1
  },
  {
    question: "What can a report contain in the dashboard?",
    options: ["Only text", "Only PDF", "Images or videos", "Only spreadsheets"],
    correct: 2
  }
];

let currentQuizIndex = 0;
let selectedQuizAnswer = null;
let quizScore = 0;

const authMessage = document.getElementById("authMessage");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const collegeSelect = document.getElementById("collegeSelect");
const statusForm = document.getElementById("statusForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const leaderboardList = document.getElementById("leaderboardList");
const navMenu = document.getElementById("navMenu");

function showSection(sectionName) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.add("d-none");
  });

  const targetSection = document.getElementById(`${sectionName}Section`);
  if (targetSection) {
    targetSection.classList.remove("d-none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (navMenu?.classList.contains("show")) {
    navMenu.classList.remove("show");
  }
}

window.showSection = showSection;

function populateColleges() {
  if (!collegeSelect) return;

  colleges.forEach((college) => {
    const option = document.createElement("option");
    option.value = college;
    option.textContent = college;
    collegeSelect.appendChild(option);
  });
}

function showAuthMessage(message, type = "success") {
  authMessage.className = `alert alert-${type}`;
  authMessage.textContent = message;
}

function saveAuth(data) {
  localStorage.setItem("dbtmitraToken", data.token);
  localStorage.setItem("dbtmitraUser", JSON.stringify(data.user));
}

async function handleAuthRequest(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

function redirectToDashboard() {
  window.location.href = "/dashboard";
}

function addChatMessage(message, type = "bot") {
  if (!chatMessages) return;

  const wrapper = document.createElement("div");
  wrapper.className = `chat-row ${type === "user" ? "user" : "bot"}`;
  wrapper.innerHTML = `<div class="chat-bubble ${type === "user" ? "user-bubble" : "bot-bubble"}">${message}</div>`;
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("register")) {
    return "To register for DBT, keep Aadhaar, bank details, and your mobile number ready, then complete the registration workflow carefully and verify OTP steps.";
  }

  if (lowerMessage.includes("document")) {
    return "Required documents usually include Aadhaar, bank account details, and a working mobile number. For awareness drives, tell students to keep matching records across documents.";
  }

  if (lowerMessage.includes("aadhaar") || lowerMessage.includes("link")) {
    return "Aadhaar linking usually happens through the bank branch or bank digital channels. Students should verify that their mobile number and bank records are active before starting.";
  }

  if (lowerMessage.includes("status") || lowerMessage.includes("check")) {
    return "Students can first validate their Aadhaar details, then confirm Aadhaar-bank linking status through their bank or official service channels.";
  }

  return "I can help with DBT registration, Aadhaar linking, required documents, payment issues, and status-related questions. Ask a specific doubt and I will guide you.";
}

function sendMessage() {
  const message = chatInput?.value.trim();
  if (!message) return;

  addChatMessage(message, "user");
  chatInput.value = "";

  setTimeout(() => {
    addChatMessage(generateAIResponse(message), "bot");
  }, 400);
}

function renderLeaderboard() {
  if (!leaderboardList) return;

  const leaderboard = JSON.parse(localStorage.getItem("dbtQuizLeaderboard") || "[]");

  if (!leaderboard.length) {
    leaderboardList.innerHTML = '<div class="empty-state">No quiz attempts yet. Be the first to appear on the leaderboard.</div>';
    return;
  }

  leaderboardList.innerHTML = leaderboard
    .slice(0, 5)
    .map(
      (entry, index) => `
        <div class="stack-item">
          <div>
            <h3>${index + 1}. ${entry.name}</h3>
            <p>${entry.score}/${quizQuestions.length} correct</p>
          </div>
          <span class="stack-chip">${entry.date}</span>
        </div>
      `
    )
    .join("");
}

function saveQuizScore(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem("dbtQuizLeaderboard") || "[]");
  leaderboard.push({
    name,
    score,
    date: new Date().toLocaleDateString("en-IN")
  });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("dbtQuizLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
}

function renderQuizQuestion() {
  const question = quizQuestions[currentQuizIndex];
  const questionNode = document.getElementById("quizQuestion");
  const progressNode = document.getElementById("quizProgress");
  const optionsNode = document.getElementById("quizOptions");

  questionNode.textContent = question.question;
  progressNode.textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;
  optionsNode.innerHTML = question.options
    .map(
      (option, index) => `
        <button class="quiz-option-btn" data-index="${index}" type="button">${option}</button>
      `
    )
    .join("");

  optionsNode.querySelectorAll(".quiz-option-btn").forEach((button) => {
    button.addEventListener("click", () => {
      selectedQuizAnswer = Number(button.dataset.index);
      optionsNode.querySelectorAll(".quiz-option-btn").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function finishQuiz() {
  const studentName = document.getElementById("studentName").value.trim() || "Anonymous";
  document.getElementById("quizBox").classList.add("d-none");
  const resultBox = document.getElementById("quizResult");
  resultBox.classList.remove("d-none");
  resultBox.innerHTML = `<h3 class="h4">Quiz Completed</h3><p class="mb-0">${studentName}, you scored ${quizScore} out of ${quizQuestions.length}.</p>`;
  saveQuizScore(studentName, quizScore);
  renderLeaderboard();
}

function startQuiz() {
  currentQuizIndex = 0;
  selectedQuizAnswer = null;
  quizScore = 0;
  document.getElementById("quizStart").classList.add("d-none");
  document.getElementById("quizResult").classList.add("d-none");
  document.getElementById("quizBox").classList.remove("d-none");
  renderQuizQuestion();
}

function nextQuizQuestion() {
  if (selectedQuizAnswer === null) return;

  if (selectedQuizAnswer === quizQuestions[currentQuizIndex].correct) {
    quizScore += 1;
  }

  currentQuizIndex += 1;
  selectedQuizAnswer = null;

  if (currentQuizIndex >= quizQuestions.length) {
    finishQuiz();
    return;
  }

  renderQuizQuestion();
}

if (localStorage.getItem("dbtmitraToken") && window.location.pathname === "/") {
  const authButton = document.querySelector(".nav-auth-btn");
  if (authButton) {
    authButton.innerHTML = '<i class="bi bi-speedometer2 me-2"></i>Open Dashboard';
    authButton.addEventListener("click", (event) => {
      event.preventDefault();
      redirectToDashboard();
    });
  }
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(loginForm).entries());

  try {
    const data = await handleAuthRequest("/api/login", payload);
    saveAuth(data);
    showAuthMessage("Login successful. Redirecting to dashboard...");
    setTimeout(redirectToDashboard, 700);
  } catch (error) {
    showAuthMessage(error.message, "danger");
  }
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(registerForm).entries());

  try {
    const data = await handleAuthRequest("/api/register", payload);
    saveAuth(data);
    showAuthMessage("Registration successful. Redirecting to dashboard...");
    setTimeout(redirectToDashboard, 700);
  } catch (error) {
    showAuthMessage(error.message, "danger");
  }
});

statusForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const aadhaarValue = document.getElementById("aadhaarInput").value.trim();
  const statusResult = document.getElementById("statusResult");

  if (aadhaarValue.length !== 12 || !/^\d+$/.test(aadhaarValue)) {
    statusResult.classList.remove("d-none");
    statusResult.innerHTML = "<h3 class='h5'>Invalid Input</h3><p class='mb-0'>Please enter a valid 12-digit Aadhaar number.</p>";
    return;
  }

  statusResult.classList.remove("d-none");
  statusResult.innerHTML = "<h3 class='h5'>Status Found</h3><p class='mb-1'>Aadhaar appears valid for demo checking.</p><p class='mb-0'>Proceed to verify bank account linking and DBT registration details.</p>";
});

document.getElementById("sendMessageBtn")?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

document.querySelectorAll(".quick-question").forEach((button) => {
  button.addEventListener("click", () => {
    chatInput.value = button.dataset.question;
    sendMessage();
  });
});

document.getElementById("startQuizBtn")?.addEventListener("click", startQuiz);
document.getElementById("nextQuizBtn")?.addEventListener("click", nextQuizQuestion);

populateColleges();
renderLeaderboard();
showSection("home");
