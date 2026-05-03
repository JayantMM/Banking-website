let currentUser = localStorage.getItem("user");

// LOGIN
async function login() {
  const username = user.value;
  const password = pass.value;

  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user", username);
    window.location = "dashboard.html";
  } else {
    msg.textContent = data.error;
  }
}

// REGISTER
async function register() {
  const username = user.value;
  const password = pass.value;

  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Account created! Please login.");
    window.location = "login.html";
  } else {
    msg.textContent = data.error;
  }
}

// DASHBOARD
async function loadDashboard() {
  const res = await fetch("http://localhost:3000/users");
  const users = await res.json();

  const userData = users.find(u => u.username === currentUser);
  balance.textContent = "Balance: ₹ " + userData.balance;

  loadTransactions();
}

// SEND MONEY
async function sendMoney() {
  const res = await fetch("http://localhost:3000/send", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      sender: currentUser,
      receiver: to.value,
      amount: parseInt(amount.value)
    })
  });

  const data = await res.json();
  alert(data.message || data.error);

  loadDashboard();
}

// TRANSACTIONS
async function loadTransactions() {
  const res = await fetch(`http://localhost:3000/transactions/${currentUser}`);
  const data = await res.json();

  tx.innerHTML = "";
  data.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.sender} → ${t.receiver} : ₹${t.amount}`;
    tx.appendChild(li);
  });
}

// AUTO LOAD
if (window.location.pathname.includes("dashboard")) {
  loadDashboard();
}