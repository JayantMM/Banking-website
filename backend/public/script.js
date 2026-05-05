const API = "http://localhost:3000";

/* 👤 Logged User Name Auto Show */
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser && document.getElementById("username")) {
    document.getElementById("username").innerHTML = currentUser.name;
} else if (document.getElementById("username")) {
    document.getElementById("username").innerHTML = "User";
}

/* 🕒 Date & Time */
function updateTime() {
    if (document.getElementById("datetime")) {
        let now = new Date();
        document.getElementById("datetime").innerHTML =
            now.toLocaleDateString("en-IN") + " | " +
            now.toLocaleTimeString("en-IN");
    }
}
setInterval(updateTime, 1000);
updateTime();

/* 👥 Load Users */
async function loadUsers() {
    try {
        const table = document.getElementById("usersTable");
        if (!table) return;

        const res = await fetch(API + "/users");
        const users = await res.json();

        table.innerHTML = "";

        users.forEach(u => {
            table.innerHTML += `
                <tr>
                    <td>👤</td>
                    <td>${u.id}</td>
                    <td>${u.name}</td>
                    <td>${Number(u.balance).toFixed(2)}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Load Users Error:", error);
    }
}

/* 💸 Send Money (TRANSFER) */
async function sendMoney() {
    const fromId = document.getElementById("fromId")?.value;
    const toId = document.getElementById("toId")?.value;
    const amount = Number(document.getElementById("amount")?.value);

    if (!fromId || !toId || !amount) {
        alert("⚠️ Fill all fields");
        return;
    }

    if (fromId === toId) {
        alert("❌ Cannot send to same user");
        return;
    }

    try {
        const res = await fetch(API + "/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ fromId, toId, amount })
        });

        const msg = await res.text();
        alert(msg);

        loadUsers();
        loadTransactions();

    } catch (error) {
        alert("❌ Transfer Failed");
    }
}

/* 📜 Load Transactions */
async function loadTransactions() {
    try {
        const table = document.getElementById("txnTable");
        if (!table) return;

        const res = await fetch(API + "/transactions");
        const data = await res.json();

        table.innerHTML = "";

        data.forEach(t => {
            table.innerHTML += `
                <tr>
                    <td>${t.from}</td>
                    <td>${t.to}</td>
                    <td>${t.amount}</td>
                    <td>${t.time}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Transaction Load Error:", error);
    }
}

/* 💰 Deposit Money */
async function depositMoney() {
    const userId = document.getElementById("depositId")?.value;
    const amount = Number(document.getElementById("depositAmount")?.value);

    if (!userId || !amount) {
        alert("⚠️ Fill all fields");
        return;
    }

    try {
        const res = await fetch(API + "/deposit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, amount })
        });

        const msg = await res.text();
        alert(msg);

        loadUsers();

    } catch (error) {
        alert("❌ Deposit Failed");
    }
}

/* 💸 Withdraw Money */
async function withdrawMoney() {
    const userId = document.getElementById("withdrawId")?.value;
    const amount = Number(document.getElementById("withdrawAmount")?.value);

    if (!userId || !amount) {
        alert("⚠️ Fill all fields");
        return;
    }

    try {
        const res = await fetch(API + "/withdraw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, amount })
        });

        const msg = await res.text();
        alert(msg);

        loadUsers();

    } catch (error) {
        alert("❌ Withdraw Failed");
    }
}

/* 👤 Profile Search */
async function loadProfile() {
    const userId = document.getElementById("profileId")?.value;

    if (!userId) {
        alert("Enter User ID");
        return;
    }

    try {
        const res = await fetch(API + "/users/" + userId);
        const user = await res.json();

        if (document.getElementById("profileBox")) {
            document.getElementById("profileBox").innerHTML = `
                <h3>My Profile</h3>
                <p>ID: ${user.id}</p>
                <p>Name: ${user.name}</p>
                <p>Balance: ₹${user.balance}</p>
            `;
        }

    } catch (error) {
        alert("❌ Profile Not Found");
    }
}

/* 🌙 Dark Mode */
function darkMode() {
    document.body.classList.toggle("dark");
}

/* 🚪 Logout */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

/* 🚀 Load on Start */
loadUsers();
loadTransactions();