const API = "https://your-backend.onrender.com"; // ← change to your backend URL

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user", JSON.stringify(data));
    if (data.role === "teacher") {
      window.location.href = "dashboard_teacher.html";
    } else {
      window.location.href = "dashboard_student.html";
    }
  } else {
    alert(data.error || "Login failed");
  }
}

async function markAttendance() {
  const student = document.getElementById("student_name").value;
  const status = document.getElementById("status").value;

  const res = await fetch(`${API}/attendance/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: student, status }),
  });

  const data = await res.json();
  alert(data.message);
  loadAll();
}

async function loadAll() {
  const res = await fetch(`${API}/attendance/view/student`);
  const data = await res.json();
  const div = document.getElementById("records");
  div.innerHTML = data.map(a => `<p>${a.username} - ${a.status} (${a.date})</p>`).join("");
}

async function exportCSV() {
  const res = await fetch(`${API}/attendance/export`);
  const text = await res.text();
  const blob = new Blob([text], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance.csv";
  a.click();
}

async function viewMyAttendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await fetch(`${API}/attendance/view/${user.username}`);
  const data = await res.json();
  const div = document.getElementById("records");
  div.innerHTML = data.map(a => `<p>${a.status} (${a.date})</p>`).join("");
}
