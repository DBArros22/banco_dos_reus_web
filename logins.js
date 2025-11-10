document.addEventListener("DOMContentLoaded", () => {
  const tipoLogin = document.getElementById("tipoLogin");
  const formLogin = document.getElementById("formLogin");
  const voltarLoginBtn = document.getElementById("voltarLoginBtn");

  tipoLogin.addEventListener("change", () => {
    formLogin.style.display = tipoLogin.value ? "block" : "none";
  });

  voltarLoginBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value.trim();

    if (!tipoLogin.value) return alert("Escolha o tipo de login!");

    if (tipoLogin.value === "advogado") {
      const advogados = JSON.parse(localStorage.getItem("advogados")) || [];
      const user = advogados.find(a => a.email === email && a.senha === senha);
      if(user){
        localStorage.setItem("usuarioLogado", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else alert("Usuário ou senha inválidos!");
    } else {
      const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
      const user = clientes.find(c => c.email === email && c.senha === senha);
      if(user){
        localStorage.setItem("usuarioLogado", JSON.stringify(user));
        window.location.href = "dashboard.html";
      } else alert("Usuário ou senha inválidos!");
    }
  });
});
