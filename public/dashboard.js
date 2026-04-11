const token = localStorage.getItem("dbtmitraToken");
const fallbackUser = JSON.parse(localStorage.getItem("dbtmitraUser") || "null");

const alertBox = document.getElementById("dashboardAlert");
const logoutBtn = document.getElementById("logoutBtn");
const activityForm = document.getElementById("activityForm");
const reportForm = document.getElementById("reportForm");

function redirectHome() {
  window.location.href = "/";
}

if (!token) {
  redirectHome();
}

function showAlert(message, type = "success") {
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
}

function clearAlert() {
  alertBox.className = "alert d-none";
  alertBox.textContent = "";
}

function formatDate(dateString, options = {}) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options
  });
}

function setUserBadge(user) {
  const badge = document.getElementById("userBadge");
  const name = user?.name || fallbackUser?.name || "Coordinator";
  badge.textContent = name;
}

function renderSessions(sessions = []) {
  const sessionList = document.getElementById("sessionList");

  if (!sessions.length) {
    sessionList.innerHTML = '<div class="empty-state">No sessions assigned yet.</div>';
    return;
  }

  sessionList.innerHTML = sessions
    .map(
      (session) => `
        <div class="stack-item">
          <div>
            <h3>${session.title}</h3>
            <p>${session.venue}</p>
          </div>
          <span class="stack-chip">${formatDate(session.date)}</span>
        </div>
      `
    )
    .join("");
}

function renderActivities(activities = []) {
  const history = document.getElementById("activityHistory");

  if (!activities.length) {
    history.innerHTML = '<div class="empty-state">No activities logged yet. Your recent outreach will show up here.</div>';
    return;
  }

  history.innerHTML = activities
    .map(
      (activity) => `
        <div class="stack-item stack-item-column">
          <div class="d-flex justify-content-between gap-3 flex-wrap">
            <h3>${activity.type}</h3>
            <span class="stack-chip">${formatDate(activity.date)}</span>
          </div>
          <p>${activity.location} | ${activity.participants} participants</p>
          <small>${activity.description}</small>
        </div>
      `
    )
    .join("");
}

function renderReports(reports = []) {
  const reportList = document.getElementById("reportList");

  if (!reports.length) {
    reportList.innerHTML = '<div class="empty-state">No reports uploaded yet. Add an image or video report to populate this section.</div>';
    return;
  }

  reportList.innerHTML = reports
    .map(
      (report) => `
        <div class="stack-item">
          <div>
            <h3>${report.title}</h3>
            <p>Uploaded ${formatDate(report.createdAt)}</p>
          </div>
          <a class="btn btn-sm btn-outline-dark" href="${report.filePath}" target="_blank" rel="noopener noreferrer">
            Open
          </a>
        </div>
      `
    )
    .join("");
}

function updateDashboard(data) {
  document.getElementById("welcomeName").textContent = data.user.name;
  document.getElementById("welcomeCollege").textContent = data.user.college;
  document.getElementById("activitiesLogged").textContent = data.stats.activitiesLogged;
  document.getElementById("reportsUploaded").textContent = data.stats.reportsUploaded;
  document.getElementById("participantsTotal").textContent = data.stats.totalParticipants;
  setUserBadge(data.user);
  renderSessions(data.sessionDates);
  renderActivities(data.activities);
  renderReports(data.reports);
}

async function fetchWithAuth(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("dbtmitraToken");
      localStorage.removeItem("dbtmitraUser");
      redirectHome();
    }

    throw new Error(data.message || "Request failed.");
  }

  return data;
}

async function loadDashboard() {
  try {
    const data = await fetchWithAuth("/api/dashboard");
    updateDashboard(data);
  } catch (error) {
    showAlert(error.message, "danger");
  }
}

activityForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(activityForm).entries());

  try {
    await fetchWithAuth("/api/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    activityForm.reset();
    await loadDashboard();
    showAlert("Activity logged successfully.");
  } catch (error) {
    showAlert(error.message, "danger");
  }
});

reportForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(reportForm);

  try {
    await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }
      return data;
    });

    reportForm.reset();
    await loadDashboard();
    showAlert("Report uploaded successfully.");
  } catch (error) {
    showAlert(error.message, "danger");
  }
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("dbtmitraToken");
  localStorage.removeItem("dbtmitraUser");
  redirectHome();
});

if (token) {
  setUserBadge(fallbackUser);
  loadDashboard();
}
