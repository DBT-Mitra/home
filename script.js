// Global variables
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime;
let quizTimer;
let timeRemaining = 600; // 10 minutes in seconds
let studentName = "";
let quizScore = 0;

// toggle mobile menu
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const menuLinks = menu.querySelectorAll("button"); // all dropdown buttons

  // Toggle menu when hamburger clicked
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // Close menu when a link is clicked
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });



// Quiz questions data
const quizQuestions = [
  {
    question: "What does DBT stand for?",
    options: [
      "Direct Bank Transfer",
      "Digital Benefit Transfer",
      "Direct Benefit Transfer",
      "Digital Bank Transfer",
    ],
    correct: 2,
    explanation:
      "DBT stands for Direct Benefit Transfer, which is a mechanism to transfer subsidies directly to the people through their bank accounts.",
  },
  {
    question: "Which document is mandatory for DBT registration?",
    options: ["PAN Card", "Aadhaar Card", "Voter ID", "Driving License"],
    correct: 1,
    explanation:
      "Aadhaar Card is mandatory for DBT registration as it serves as the unique identifier for beneficiaries.",
  },
  {
    question: "What is the primary benefit of DBT?",
    options: [
      "Faster internet",
      "Elimination of middlemen",
      "Free mobile phones",
      "Reduced taxes",
    ],
    correct: 1,
    explanation:
      "The primary benefit of DBT is the elimination of middlemen, ensuring direct transfer of benefits to beneficiaries.",
  },
  {
    question: "How many digits does an Aadhaar number contain?",
    options: ["10 digits", "12 digits", "14 digits", "16 digits"],
    correct: 1,
    explanation:
      "An Aadhaar number contains 12 digits and serves as a unique identity number for Indian residents.",
  },
  {
    question: "Which ministry primarily oversees DBT implementation?",
    options: [
      "Ministry of Finance",
      "Ministry of Electronics and IT",
      "Ministry of Rural Development",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "DBT implementation involves multiple ministries including Finance, Electronics & IT, and Rural Development working together.",
  },
  {
    question:
      "What happens if your Aadhaar is not linked to your bank account?",
    options: [
      "Nothing changes",
      "You cannot receive DBT benefits",
      "Your account gets closed",
      "You pay extra charges",
    ],
    correct: 1,
    explanation:
      "Without Aadhaar linking, you cannot receive DBT benefits as the system requires Aadhaar for beneficiary identification.",
  },
  {
    question: "Which of these is NOT a DBT scheme?",
    options: [
      "LPG Subsidy",
      "Scholarship payments",
      "MGNREGA wages",
      "Income Tax refunds",
    ],
    correct: 3,
    explanation:
      "Income Tax refunds are not part of DBT schemes. DBT primarily covers subsidies, scholarships, and wage payments.",
  },
  {
    question: "How can you check your Aadhaar-bank linking status?",
    options: [
      "Visit bank branch only",
      "Call customer care only",
      "Online through bank website",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "You can check Aadhaar-bank linking status through multiple channels: bank branch visits, customer care, or online banking.",
  },
  {
    question: "What is the time limit for linking Aadhaar with bank accounts?",
    options: [
      "No time limit",
      "31st March every year",
      "As per government notifications",
      "Within 6 months of account opening",
    ],
    correct: 2,
    explanation:
      "The time limit for Aadhaar linking is extended periodically through government notifications.",
  },
  {
    question: "Which biometric data is captured in Aadhaar?",
    options: [
      "Fingerprints only",
      "Iris scan only",
      "Both fingerprints and iris",
      "Voice recognition",
    ],
    correct: 2,
    explanation:
      "Aadhaar captures both fingerprints (all 10 fingers) and iris scans for biometric authentication.",
  },
  {
    question: "What should you do if your DBT payment is delayed?",
    options: [
      "Wait indefinitely",
      "Contact the concerned department",
      "Open a new bank account",
      "Apply for Aadhaar again",
    ],
    correct: 1,
    explanation:
      "If DBT payment is delayed, you should contact the concerned department or ministry handling that particular scheme.",
  },
  {
    question: "Can you link multiple bank accounts to one Aadhaar?",
    options: [
      "Yes, unlimited accounts",
      "No, only one account",
      "Yes, but only one receives DBT",
      "Maximum 3 accounts",
    ],
    correct: 2,
    explanation:
      "You can link multiple bank accounts to Aadhaar, but only one account (primary) will receive DBT benefits.",
  },
  {
    question: "What is e-KYC in the context of Aadhaar?",
    options: [
      "Electronic Know Your Customer",
      "Enhanced KYC process",
      "Emergency KYC",
      "Extended KYC validity",
    ],
    correct: 0,
    explanation:
      "e-KYC stands for Electronic Know Your Customer, which uses Aadhaar for instant customer verification.",
  },
  {
    question: "Which portal is used for DBT beneficiary management?",
    options: [
      "DBT Portal",
      "Aadhaar Portal",
      "PFMS Portal",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "Multiple portals are used: DBT Portal for scheme management, Aadhaar Portal for authentication, and PFMS for payment processing.",
  },
  {
    question: "What happens if you provide wrong bank details for DBT?",
    options: [
      "Payment goes to wrong account",
      "Payment gets rejected",
      "Automatic correction happens",
      "No impact",
    ],
    correct: 1,
    explanation:
      "If wrong bank details are provided, the DBT payment typically gets rejected and needs to be corrected.",
  },
  {
    question: "How often should you update your Aadhaar information?",
    options: ["Never", "Every year", "When details change", "Every 5 years"],
    correct: 2,
    explanation:
      "You should update Aadhaar information whenever your personal details (address, mobile, etc.) change.",
  },
  {
    question: "What is the role of PFMS in DBT?",
    options: [
      "Aadhaar generation",
      "Payment processing",
      "Bank account opening",
      "Document verification",
    ],
    correct: 1,
    explanation:
      "PFMS (Public Financial Management System) handles the payment processing and tracking for DBT schemes.",
  },
  {
    question: "Can NRIs (Non-Resident Indians) avail DBT benefits?",
    options: [
      "Yes, all benefits",
      "No, not eligible",
      "Only specific schemes",
      "With special permission",
    ],
    correct: 2,
    explanation:
      "NRIs can avail only specific DBT schemes and benefits, not all schemes are applicable to them.",
  },
  {
    question: "What should you do if your Aadhaar is locked?",
    options: [
      "Apply for new Aadhaar",
      "Visit nearest bank",
      "Unlock through UIDAI portal",
      "Contact police",
    ],
    correct: 2,
    explanation:
      "If your Aadhaar is locked, you can unlock it through the UIDAI portal using your registered mobile number.",
  },
  {
    question: "Which of these requires Aadhaar authentication for DBT?",
    options: [
      "LPG subsidy",
      "Scholarship disbursement",
      "Pension payments",
      "All of the above",
    ],
    correct: 3,
    explanation:
      "All major DBT schemes including LPG subsidy, scholarships, and pensions require Aadhaar authentication.",
  },
];

// Navigation functions
function showSection(sectionName) {
  // 👇 Automatically scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });

  // Show selected section
  const targetSection = document.getElementById(sectionName + "Section");
  if (targetSection) {
    targetSection.classList.remove("hidden");
  }
}

function showQuizTab(tabName) {
  const quizTab = document.getElementById("quizTab");
  const leaderboardTab = document.getElementById("leaderboardTab");
  const quizContent = document.getElementById("quizContent");
  const leaderboardContent = document.getElementById("leaderboardContent");

  if (tabName === "quiz") {
    quizTab.className =
      "flex-1 py-4 px-6 text-center font-semibold bg-indigo-500 text-white";
    leaderboardTab.className =
      "flex-1 py-4 px-6 text-center font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors";
    quizContent.classList.remove("hidden");
    leaderboardContent.classList.add("hidden");
  } else {
    leaderboardTab.className =
      "flex-1 py-4 px-6 text-center font-semibold bg-indigo-500 text-white";
    quizTab.className =
      "flex-1 py-4 px-6 text-center font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors";
    leaderboardContent.classList.remove("hidden");
    quizContent.classList.add("hidden");
    loadLeaderboard();
  }
}

// Quiz functions
function startQuiz() {
  const nameInput = document.getElementById("studentName");
  if (!nameInput.value.trim()) {
    alert("Please enter your name to start the quiz.");
    return;
  }

  studentName = nameInput.value.trim();
  currentQuestionIndex = 0;
  userAnswers = [];
  quizScore = 0;
  timeRemaining = 600;
  quizStartTime = new Date();

  document.getElementById("quizStart").classList.add("hidden");
  document.getElementById("quizQuestions").classList.remove("hidden");

  loadQuestion();
  startTimer();
}

function loadQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  document.getElementById("questionText").textContent = question.question;
  document.getElementById("currentQuestion").textContent =
    currentQuestionIndex + 1;
  document.getElementById("currentScore").textContent = quizScore;

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className =
      "quiz-option border border-gray-300 rounded-lg p-4 hover:bg-gray-50 cursor-pointer";
    optionDiv.innerHTML = `
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" name="answer" value="${index}" class="mr-3">
                        <span>${option}</span>
                    </label>
                `;
    optionDiv.onclick = () => selectOption(index);
    optionsContainer.appendChild(optionDiv);
  });

  // Update progress bar
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";

  // Update navigation buttons
  document.getElementById("prevBtn").disabled = currentQuestionIndex === 0;
  document.getElementById("nextBtn").style.display =
    currentQuestionIndex === quizQuestions.length - 1 ? "none" : "inline-block";
  document.getElementById("submitBtn").style.display =
    currentQuestionIndex === quizQuestions.length - 1 ? "inline-block" : "none";

  // Restore previous answer if exists
  if (userAnswers[currentQuestionIndex] !== undefined) {
    selectOption(userAnswers[currentQuestionIndex]);
  }
}

function selectOption(optionIndex) {
  // Remove previous selections
  document.querySelectorAll(".quiz-option").forEach((option) => {
    option.classList.remove("selected");
  });

  // Add selection to clicked option
  const options = document.querySelectorAll(".quiz-option");
  options[optionIndex].classList.add("selected");

  // Update radio button
  const radioButtons = document.querySelectorAll('input[name="answer"]');
  radioButtons[optionIndex].checked = true;

  // Store answer
  userAnswers[currentQuestionIndex] = optionIndex;
}

function nextQuestion() {
  if (userAnswers[currentQuestionIndex] === undefined) {
    alert("Please select an answer before proceeding.");
    return;
  }

  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
}

function startTimer() {
  quizTimer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(quizTimer);
      submitQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const timerElement = document.getElementById("timeLeft");
  timerElement.textContent = timeString;

  // Add warning class when time is running low
  if (timeRemaining <= 60) {
    timerElement.parentElement.classList.add("warning");
  }
}

function submitQuiz() {
  clearInterval(quizTimer);

  // Calculate score
  quizScore = 0;
  userAnswers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correct) {
      quizScore += 5;
    }
  });

  // Calculate time taken
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - quizStartTime) / 1000);
  const timeTakenMinutes = Math.floor(timeTaken / 60);
  const timeTakenSeconds = timeTaken % 60;

  // Save to leaderboard
  saveToLeaderboard(studentName, quizScore, timeTaken);

  // Show results
  showResults(quizScore, timeTakenMinutes, timeTakenSeconds);
}

function showResults(score, minutes, seconds) {
  document.getElementById("quizQuestions").classList.add("hidden");
  document.getElementById("quizResults").classList.remove("hidden");

  const percentage = (score / 100) * 100;
  const correctAnswers = score / 5;
  const incorrectAnswers = 20 - correctAnswers;

  document.getElementById("finalScore").textContent = `${score}/100`;
  document.getElementById(
    "scorePercentage"
  ).textContent = `${percentage}% - ${getPerformanceMessage(percentage)}`;
  document.getElementById("correctAnswers").textContent = correctAnswers;
  document.getElementById("incorrectAnswers").textContent = incorrectAnswers;
  document.getElementById("timeTaken").textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Update result icon and message based on performance
  const resultIcon = document.getElementById("resultIcon");
  const performanceMessage = document.getElementById("performanceMessage");

  if (percentage >= 80) {
    resultIcon.innerHTML = '<span class="text-4xl">🏆</span>';
    resultIcon.className =
      "w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6";
    performanceMessage.textContent =
      "Excellent! You have a strong understanding of DBT and Aadhaar processes!";
  } else if (percentage >= 60) {
    resultIcon.innerHTML = '<span class="text-4xl">👍</span>';
    resultIcon.className =
      "w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6";
    performanceMessage.textContent =
      "Good job! You have a decent understanding. Review the explanations to improve further.";
  } else {
    resultIcon.innerHTML = '<span class="text-4xl">📚</span>';
    resultIcon.className =
      "w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6";
    performanceMessage.textContent =
      "Keep learning! Review the study materials and try again to improve your score.";
  }
}

function getPerformanceMessage(percentage) {
  if (percentage >= 90) return "Outstanding!";
  if (percentage >= 80) return "Excellent!";
  if (percentage >= 70) return "Good Job!";
  if (percentage >= 60) return "Not Bad!";
  return "Keep Trying!";
}

function showAnswerReview() {
  document.getElementById("quizResults").classList.add("hidden");
  document.getElementById("answerReview").classList.remove("hidden");

  const reviewContent = document.getElementById("reviewContent");
  reviewContent.innerHTML = "";

  quizQuestions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correct;

    const reviewItem = document.createElement("div");
    reviewItem.className = "bg-white rounded-lg p-6 shadow-lg";
    reviewItem.innerHTML = `
                    <div class="flex items-start justify-between mb-4">
                        <h4 class="text-lg font-semibold text-gray-800">Question ${
                          index + 1
                        }</h4>
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }">
                            ${isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                    </div>
                    <p class="text-gray-700 mb-4">${question.question}</p>
                    <div class="space-y-2 mb-4">
                        ${question.options
                          .map(
                            (option, optIndex) => `
                            <div class="p-3 rounded-lg ${
                              optIndex === question.correct
                                ? "bg-green-50 border border-green-200"
                                : optIndex === userAnswer && !isCorrect
                                ? "bg-red-50 border border-red-200"
                                : "bg-gray-50"
                            }">
                                <span class="font-medium">
                                    ${
                                      optIndex === question.correct
                                        ? "✓"
                                        : optIndex === userAnswer && !isCorrect
                                        ? "✗"
                                        : "•"
                                    }
                                </span>
                                ${option}
                                ${
                                  optIndex === question.correct
                                    ? " (Correct Answer)"
                                    : ""
                                }
                                ${
                                  optIndex === userAnswer && !isCorrect
                                    ? " (Your Answer)"
                                    : ""
                                }
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 class="font-semibold text-blue-800 mb-2">Explanation:</h5>
                        <p class="text-blue-700">${question.explanation}</p>
                    </div>
                `;
    reviewContent.appendChild(reviewItem);
  });
}

function hideAnswerReview() {
  document.getElementById("answerReview").classList.add("hidden");
  document.getElementById("quizResults").classList.remove("hidden");
}

function restartQuiz() {
  document.getElementById("quizResults").classList.add("hidden");
  document.getElementById("answerReview").classList.add("hidden");
  document.getElementById("quizStart").classList.remove("hidden");

  // Reset quiz state
  currentQuestionIndex = 0;
  userAnswers = [];
  quizScore = 0;
  timeRemaining = 600;

  // Clear student name for new attempt
  document.getElementById("studentName").value = "";
}

function saveToLeaderboard(name, score, timeTaken) {
  let leaderboard = JSON.parse(
    localStorage.getItem("dbtQuizLeaderboard") || "[]"
  );

  const entry = {
    name: name,
    score: score,
    percentage: (score / 100) * 100,
    timeTaken: timeTaken,
    date: new Date().toLocaleDateString(),
    timestamp: new Date().getTime(),
  };

  leaderboard.push(entry);
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeTaken - b.timeTaken; // If scores are equal, faster time wins
  });

  // Keep only top 50 entries
  leaderboard = leaderboard.slice(0, 50);

  localStorage.setItem("dbtQuizLeaderboard", JSON.stringify(leaderboard));
}

function loadLeaderboard() {
  const leaderboard = JSON.parse(
    localStorage.getItem("dbtQuizLeaderboard") || "[]"
  );

  // Update top 3
  const firstPlace = document.getElementById("firstPlace");
  const firstScore = document.getElementById("firstScore");
  const secondPlace = document.getElementById("secondPlace");
  const secondScore = document.getElementById("secondScore");
  const thirdPlace = document.getElementById("thirdPlace");
  const thirdScore = document.getElementById("thirdScore");

  if (leaderboard.length >= 1) {
    firstPlace.textContent = leaderboard[0].name;
    firstScore.textContent = `${leaderboard[0].score}/100 (${leaderboard[0].percentage}%)`;
  } else {
    firstPlace.textContent = "No entries yet";
    firstScore.textContent = "-";
  }

  if (leaderboard.length >= 2) {
    secondPlace.textContent = leaderboard[1].name;
    secondScore.textContent = `${leaderboard[1].score}/100 (${leaderboard[1].percentage}%)`;
  } else {
    secondPlace.textContent = "No entries yet";
    secondScore.textContent = "-";
  }

  if (leaderboard.length >= 3) {
    thirdPlace.textContent = leaderboard[2].name;
    thirdScore.textContent = `${leaderboard[2].score}/100 (${leaderboard[2].percentage}%)`;
  } else {
    thirdPlace.textContent = "No entries yet";
    thirdScore.textContent = "-";
  }

  // Update full leaderboard
  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = "";

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = `
                    <div class="p-8 text-center text-gray-500">
                        <div class="text-4xl mb-4">🏆</div>
                        <p>No quiz attempts yet. Be the first to take the quiz!</p>
                    </div>
                `;
    return;
  }

  leaderboard.forEach((entry, index) => {
    const minutes = Math.floor(entry.timeTaken / 60);
    const seconds = entry.timeTaken % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const entryDiv = document.createElement("div");
    entryDiv.className =
      "flex items-center justify-between p-4 hover:bg-gray-50";
    entryDiv.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }">
                            ${index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">${
                              entry.name
                            }</div>
                            <div class="text-sm text-gray-500">${
                              entry.date
                            }</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="font-bold text-lg ${
                          entry.percentage >= 80
                            ? "text-green-600"
                            : entry.percentage >= 60
                            ? "text-blue-600"
                            : "text-red-600"
                        }">${entry.score}/100</div>
                        <div class="text-sm text-gray-500">${
                          entry.percentage
                        }% • ${timeString}</div>
                    </div>
                `;
    leaderboardList.appendChild(entryDiv);
  });
}

// Chat functions
function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (message) {
    addMessage(message, "user");
    input.value = "";

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response
    setTimeout(() => {
      hideTypingIndicator();
      const response = generateAIResponse(message);
      addMessage(response, "ai");
    }, 1500);
  }
}

function askQuickQuestion(question) {
  document.getElementById("chatInput").value = question;
  sendMessage();
}

function addMessage(message, sender) {
  const messagesContainer = document.getElementById("chatMessages");
  const messageDiv = document.createElement("div");

  if (sender === "user") {
    messageDiv.className = "flex items-start justify-end";
    messageDiv.innerHTML = `
                    <div class="chat-bubble bg-purple-500 text-white rounded-lg p-4 mr-3">
                        <p>${message}</p>
                    </div>
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-gray-600 text-sm">👤</span>
                    </div>
                `;
  } else {
    messageDiv.className = "flex items-start";
    messageDiv.innerHTML = `
                    <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-white text-sm">🤖</span>
                    </div>
                    <div class="chat-bubble bg-gray-100 rounded-lg p-4">
                        <p class="text-gray-800">${message}</p>
                    </div>
                `;
  }

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
  document.getElementById("typingIndicator").classList.add("show");
  const messagesContainer = document.getElementById("chatMessages");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
  document.getElementById("typingIndicator").classList.remove("show");
}

function generateAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("register") ||
    lowerMessage.includes("registration")
  ) {
    return "To register for DBT: 1) Gather your Aadhaar card, bank details, and mobile number 2) Visit the official DBT portal 3) Fill the registration form accurately 4) Complete OTP verification. Make sure your Aadhaar is linked to your bank account first!";
  }

  if (lowerMessage.includes("document") || lowerMessage.includes("papers")) {
    return "Required documents for DBT: ✓ Aadhaar Card ✓ Bank Account Details (Account number, IFSC code) ✓ Registered mobile number ✓ Passport-size photograph. Ensure all documents have consistent information!";
  }

  if (
    lowerMessage.includes("link") ||
    (lowerMessage.includes("aadhaar") && lowerMessage.includes("bank"))
  ) {
    return "To link Aadhaar with bank: 1) Visit your bank branch with Aadhaar card and passbook 2) Fill the Aadhaar-Bank linking form 3) Complete biometric verification 4) Receive SMS confirmation. You can also do this online through your bank's website!";
  }

  if (lowerMessage.includes("status") || lowerMessage.includes("check")) {
    return "You can check your DBT status through: 1) Official DBT portal using your Aadhaar number 2) Bank's website or mobile app 3) Calling bank customer care 4) Visiting bank branch. Regular monitoring helps ensure timely benefit receipt!";
  }

  if (
    lowerMessage.includes("problem") ||
    lowerMessage.includes("issue") ||
    lowerMessage.includes("help")
  ) {
    return "Common DBT issues and solutions: • Payment not received → Check Aadhaar-bank linking • Wrong bank details → Update through concerned department • Account blocked → Contact bank immediately • Technical issues → Try after some time or contact helpline. Need specific help? Please describe your exact problem!";
  }

  return "I'm here to help with DBT and Aadhaar queries! You can ask me about registration processes, required documents, linking procedures, status checking, or troubleshooting issues. What specific information do you need?";
}

// Form handlers
document.getElementById("statusForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const aadhaarInput = document.getElementById("aadhaarInput");
  if (aadhaarInput.value.length >= 12) {
    document.getElementById("statusResult").classList.remove("hidden");
  } else {
    alert("Please enter a valid Aadhaar number");
  }
});

document
  .getElementById("activityForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert(
      "Activity logged successfully! Thank you for your contribution to DBT awareness."
    );
    this.reset();
  });

document.getElementById("reportForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert(
    "Report uploaded successfully! Your contribution helps improve DBT awareness."
  );
  this.reset();
});

document.getElementById("chatInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  showSection("home");
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'98684695163e7feb',t:'MTc1OTExNTMwMy4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();

