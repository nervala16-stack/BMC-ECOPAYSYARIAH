document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("eco_currentUser") || "null");
  if (!user) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userEmail").textContent = "Email: " + user.email;
  document.getElementById("userName").textContent = user.email.split("@")[0];
  updateDisplay(user);
});

function updateDisplay(user) {
  document.getElementById("balance").textContent = formatRupiah(user.saldo);

  const list = document.getElementById("transactionList");
  if (!user.transactions || user.transactions.length === 0) {
    list.innerHTML = "<p>Belum ada transaksi.</p>";
    return;
  }

  list.innerHTML = user.transactions
    .map(
      (t) => `
      <div class="tx-item">
        <strong>${t.type}</strong> — ${formatRupiah(t.amount)}<br>
        <small>${t.info || ""}</small><br>
        <span>${t.date}</span>
      </div>`
    )
    .join("");
}

// === ACTIONS ===
function topUp() {
  const user = getUser();
  const amount = parseInt(prompt("Masukkan jumlah Top Up (Rp):"));
  if (isNaN(amount) || amount <= 0) return notify("Jumlah tidak valid ❌");
  user.saldo += amount;
  addTransaction(user, "Top Up", amount, "Saldo masuk dari Top Up 💰");
  notify("Top Up berhasil 💰");
}

function sendMoney() {
  const user = getUser();
  const receiver = prompt("Masukkan nama penerima:");
  if (!receiver) return notify("Nama penerima wajib diisi ❌");
  const amount = parseInt(prompt("Masukkan jumlah kirim (Rp):"));
  if (isNaN(amount) || amount <= 0 || amount > user.saldo)
    return notify("Jumlah tidak valid atau saldo tidak cukup ❌");
  user.saldo -= amount;
  addTransaction(user, "Kirim Uang", amount, `Dikirim ke ${receiver} 📤`);
  notify(`Uang berhasil dikirim ke ${receiver} 📤`);
}

function withdraw() {
  const user = getUser();
  const tujuan = prompt("Masukkan tujuan penarikan (contoh: Bank Syariah Mandiri):");
  if (!tujuan) return notify("Tujuan wajib diisi ❌");
  const amount = parseInt(prompt("Masukkan jumlah penarikan (Rp):"));
  if (isNaN(amount) || amount <= 0 || amount > user.saldo)
    return notify("Jumlah tidak valid atau saldo tidak cukup ❌");
  user.saldo -= amount;
  addTransaction(user, "Tarik Tunai", amount, `Ditarik ke ${tujuan} 🏦`);
  notify(`Penarikan berhasil ke ${tujuan} 🏦`);
}

function loan() {
  const user = getUser();
  const amount = parseInt(prompt("Masukkan jumlah pinjaman (Rp):"));
  if (isNaN(amount) || amount <= 0) return notify("Jumlah tidak valid ❌");
  const tenor = prompt("Tenor pinjaman (bulan):", "6");
  user.saldo += amount;
  addTransaction(user, "Pinjaman Diterima", amount, `${tenor} bulan 📄`);
  notify("Pinjaman berhasil diajukan ✅");
}

// === HELPERS ===
function addTransaction(user, type, amount, info) {
  user.transactions.unshift({
    type,
    amount,
    info,
    date: new Date().toLocaleString(),
  });
  saveUser(user);
  updateDisplay(user);
}

function getUser() {
  return JSON.parse(localStorage.getItem("eco_currentUser"));
}

function saveUser(user) {
  const users = JSON.parse(localStorage.getItem("eco_users") || "[]");
  const idx = users.findIndex((u) => u.email === user.email);
  if (idx !== -1) users[idx] = user;
  localStorage.setItem("eco_users", JSON.stringify(users));
  localStorage.setItem("eco_currentUser", JSON.stringify(user));
}

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function logout() {
  localStorage.removeItem("eco_currentUser");
  window.location.href = "login.html";
}

function toggleProfile() {
  document.getElementById("profilePopup").classList.toggle("show");
}

function notify(msg) {
  const box = document.getElementById("notifBox");
  box.textContent = msg;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 3000);
}
function openDetail(index) {
  window.location.href = "riwayat.html?tx=" + index;
}
