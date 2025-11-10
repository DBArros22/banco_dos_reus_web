document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const container = document.getElementById("meuAnuncio");

  if (!usuario || usuario.tipo !== "advogado") {
    alert("Acesso restrito!");
    window.location.href = "dashboard.html";
    return;
  }

  let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

  // tenta localizar por id ou email (robustez)
  let anuncio = anuncios.find(
    (a) =>
      (a.id && a.id === usuario.id) ||
      (a.email && a.email === usuario.email)
  );

  if (!anuncio) {
    // Se ainda não existir um anúncio, cria um modelo inicial com dados do usuário
    anuncio = {
      id: usuario.id,
      nome: usuario.nome || "",
      especialidade: usuario.especialidade || "",
      portfolio: usuario.portfolio || "",
      foto:
        usuario.foto ||
        localStorage.getItem("fotoPerfil") ||
        "imagens/default-user.png",
      email: usuario.email,
      tipo: "advogado",
      telefone: usuario.telefone || "",
      registroOAB: usuario.registroOAB || ""
    };

    // remove possíveis entradas duplicadas com mesmo email e adiciona a nova
    anuncios = anuncios.filter((a) => !(a && a.email === anuncio.email));
    anuncios.push(anuncio);
    localStorage.setItem("anuncios", JSON.stringify(anuncios));
  }

  // Monta a interface de edição
  container.innerHTML = `
    <div class="card-editar">
      <img src="${anuncio.foto}" class="fotoEditar" id="fotoEditar">

      <label>Nome:</label>
      <input type="text" id="editNome" value="${anuncio.nome}">

      <label>Especialidade:</label>
      <input type="text" id="editEspecialidade" value="${anuncio.especialidade}">

      <label>Descrição / Portfólio:</label>
      <textarea id="editPortfolio">${anuncio.portfolio || ""}</textarea>

      <label>Telefone:</label>
      <input type="text" id="editTelefone" value="${anuncio.telefone || ""}" disabled>

      <label>Registro OAB:</label>
      <input type="text" id="editRegistroOAB" value="${anuncio.registroOAB || ""}" disabled>

      <label>Alterar Foto:</label>
      <input type="file" id="inputFotoAnuncio" accept="image/*">

      <button id="btnSalvar">Salvar Alterações</button>
      <button id="btnExcluir">Excluir Anúncio</button>
    </div>
  `;

  // === ALTERAR FOTO DO ANÚNCIO ===
  const inputFotoAnuncio = document.getElementById("inputFotoAnuncio");
  const fotoEditar = document.getElementById("fotoEditar");

  inputFotoAnuncio.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const novaFoto = e.target.result;
      fotoEditar.src = novaFoto;
      anuncio.foto = novaFoto;
    };
    reader.readAsDataURL(file);
  });

  // === SALVAR ALTERAÇÕES ===
  document.getElementById("btnSalvar").addEventListener("click", () => {
    anuncio.nome = document.getElementById("editNome").value.trim();
    anuncio.especialidade = document.getElementById("editEspecialidade").value.trim();
    anuncio.portfolio = document.getElementById("editPortfolio").value.trim();
    anuncio.foto =
      anuncio.foto ||
      usuario.foto ||
      localStorage.getItem("fotoPerfil") ||
      "imagens/default-user.png";

    // Atualiza também o perfil do usuário logado
    usuario.nome = anuncio.nome;
    usuario.especialidade = anuncio.especialidade;
    usuario.portfolio = anuncio.portfolio;
    usuario.foto = anuncio.foto;
    usuario.telefone = anuncio.telefone;
    usuario.registroOAB = anuncio.registroOAB;

    // Atualiza o localStorage do usuário logado
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    localStorage.setItem("fotoPerfil", usuario.foto);

    // Atualiza ou adiciona no array de anúncios
    let anunciosAtuais = JSON.parse(localStorage.getItem("anuncios")) || [];
    const index = anunciosAtuais.findIndex(
      (a) => (a.id && a.id === usuario.id) || (a.email && a.email === usuario.email)
    );

    if (index !== -1) {
      anunciosAtuais[index] = { ...anuncio, tipo: "advogado" };
    } else {
      anunciosAtuais.push({ ...anuncio, tipo: "advogado" });
    }

    anunciosAtuais = anunciosAtuais.filter(
      (a, idx, arr) => idx === arr.findIndex((x) => x.email === a.email)
    );

    localStorage.setItem("anuncios", JSON.stringify(anunciosAtuais));
    alert("Anúncio salvo e publicado no feed!");
    window.location.href = "dashboard.html";
  });

  // === EXCLUIR ANÚNCIO ===
  document.getElementById("btnExcluir").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir seu anúncio?")) {
      let anunciosAtuais = JSON.parse(localStorage.getItem("anuncios")) || [];
      const novos = anunciosAtuais.filter(
        (a) =>
          !(
            (a.id && a.id === usuario.id) ||
            (a.email && a.email === usuario.email)
          )
      );
      localStorage.setItem("anuncios", JSON.stringify(novos));
      alert("Anúncio removido!");
      window.location.href = "dashboard.html";
    }
  });

  // === VOLTAR PARA O DASHBOARD ===
  const btnVoltar = document.getElementById("voltarDashboard");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
