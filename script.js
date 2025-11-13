document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const title = document.getElementById("authTitle");
  const btn = document.getElementById("submitBtn");
  const prompt = document.getElementById("promptText");
  const toggle = document.getElementById("toggleAuth");

  let mode = "login"; // default mode

  // Ubah mode login <-> daftar
  function switchMode() {
    if (mode === "login") {
      mode = "register";
      title.textContent = "Daftar Akun Baru";
      btn.textContent = "Daftar Sekarang";
      prompt.textContent = "Sudah punya akun?";
      toggle.textContent = "Masuk";
    } else {
      mode = "login";
      title.textContent = "Masuk";
      btn.textContent = "Masuk";
      prompt.textContent = "Belum punya akun?";
      toggle.textContent = "Daftar";
    }
  }

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    switchMode();
  });

  // Saat form disubmit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pw = document.getElementById("password").value.trim();

    if (!email || !pw) return alert("Isi email dan kata sandi dulu ya!");

    let users = JSON.parse(localStorage.getItem("eco_users") || "[]");

    if (mode === "register") {
      if (users.some((u) => u.email === email))
        return alert("Akun ini sudah terdaftar!");

      const newUser = {
        email,
        password: pw,
        saldo: 250000,
        loans: [],
        transactions: [],
      };

      users.push(newUser);
      localStorage.setItem("eco_users", JSON.stringify(users));
      localStorage.setItem("eco_currentUser", JSON.stringify(newUser));

      alert("Pendaftaran berhasil 🎉");
      window.location.href = "dashboard.html";
    } else {
      const user = users.find(
        (u) => u.email === email && u.password === pw
      );

      if (!user) {
        alert("Email / kata sandi salah atau belum terdaftar.");
        return;
      }

      localStorage.setItem("eco_currentUser", JSON.stringify(user));
      alert("Login berhasil ✅");
      window.location.href = "dashboard.html";
    }
  });
});
