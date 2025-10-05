// replace this with your deployed Render backend URL
const API = "https://student-backend-quqp.onrender.com";

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
    alert(data.error);
  }
}

async function loadStudents() {
  const res = await fetch(`${API}/students`);
  const students = await res.json();
  const tbody = document.querySelector("#students-table tbody");
  tbody.innerHTML = "";

  students.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.roll_no}</td>
      <td>
        <button onclick="markAttendance(${s.id}, 'Present')">Present</button>
        <button onclick="markAttendance(${s.id}, 'Absent')">Absent</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

async function markAttendance(student_id, status) {
  const res = await fetch(`${API}/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id, status }),
  });
  const data = await res.json();
  alert(data.message);
}

async function loadStudentAttendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await fetch(`${API}/view/${user.user_id}`);
  const records = await res.json();

  const tbody = document.querySelector("#attendance-table tbody");
  tbody.innerHTML = "";

  records.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.date}</td><td>${r.status}</td>`;
    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("dashboard_student.html")) {
    loadStudentAttendance();
  }
});
