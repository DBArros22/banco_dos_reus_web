// meus_anuncios_adv.js — permite ao advogado visualizar/editar seu anúncio
// mantém telefone, registroOAB e foto sincronizados com localStorage

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const container = document.getElementById("meuAnuncio");

  if (!usuario || usuario.tipo !== "advogado") {
    alert("Acesso restrito!");
    window.location.href = "dashboard.html";
    return;
  }

  let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];

  // localizar por id ou email
  let anuncio = anuncios.find(a => (a.id && a.id === usuario.id) || (a.email && a.email === usuario.email));

  if (!anuncio) {
    // cria um anúncio inicial baseado no usuário (mantendo compatibilidade)
    anuncio = {
      id: usuario.id || Date.now(),
      nome: usuario.nome || "",
      especialidade: usuario.especialidade || "",
      portfolio: usuario.portfolio || "",
      foto: usuario.foto || localStorage.getItem("fotoPerfil") || "imagens/default-user.png",
      email: usuario.email,
      tipo: "advogado",
      telefone: usuario.telefone || "",
      registroOAB: usuario.registroOAB || ""
    };

    // remove duplicatas e adiciona
    anuncios = anuncios.filter(a => !(a && a.email === anuncio.email));
    anuncios.push(anuncio);
    localStorage.setItem("anuncios", JSON.stringify(anuncios));
  }

  // Monta a interface de edição (telefone e registro OAB editáveis)
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
      <input type="text" id="editTelefone" value="${anuncio.telefone || ""}" placeholder="(XX) XXXXX-XXXX">

      <label>Registro OAB:</label>
      <input type="text" id="editRegistroOAB" value="${anuncio.registroOAB || ""}" placeholder="Número da OAB">

      <label>Alterar Foto:</label>
      <input type="file" id="inputFotoAnuncio" accept="image/*">

      <button id="btnSalvar">Salvar Alterações</button>
      <button id="btnExcluir">Excluir Anúncio</button>
    </div>
  `;

  // Elementos
  const inputFotoAnuncio = document.getElementById("inputFotoAnuncio");
  const fotoEditar = document.getElementById("fotoEditar");

  // Alterar foto localmente antes de salvar
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

  // Salvar alterações (sincroniza usuarioLogado e array anuncios)
  document.getElementById("btnSalvar").addEventListener("click", () => {
    anuncio.nome = document.getElementById("editNome").value.trim();
    anuncio.especialidade = document.getElementById("editEspecialidade").value.trim();
    anuncio.portfolio = document.getElementById("editPortfolio").value.trim();
    anuncio.telefone = document.getElementById("editTelefone").value.trim();
    anuncio.registroOAB = document.getElementById("editRegistroOAB").value.trim();
    anuncio.foto = anuncio.foto || usuario.foto || localStorage.getItem("fotoPerfil") || "imagens/default-user.png";

    // Atualiza usuarioLogado
    usuario.nome = anuncio.nome;
    usuario.especialidade = anuncio.especialidade;
    usuario.portfolio = anuncio.portfolio;
    usuario.telefone = anuncio.telefone;
    usuario.registroOAB = anuncio.registroOAB;
    usuario.foto = anuncio.foto;

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    localStorage.setItem("fotoPerfil", usuario.foto);

    // Atualiza array anuncios sem duplicar
    let anunciosAtuais = JSON.parse(localStorage.getItem("anuncios")) || [];
    const index = anunciosAtuais.findIndex(a => (a.id && a.id === usuario.id) || (a.email && a.email === usuario.email));
    if (index !== -1) {
      anunciosAtuais[index] = { ...anuncio, tipo: "advogado" };
    } else {
      anunciosAtuais.push({ ...anuncio, tipo: "advogado" });
    }

    // normalize: remove duplicatas por email
    anunciosAtuais = anunciosAtuais.filter((a, idx, arr) => idx === arr.findIndex(x => x.email === a.email));
    localStorage.setItem("anuncios", JSON.stringify(anunciosAtuais));

    alert("Anúncio salvo e publicado no feed!");
    // volta para dashboard onde feed irá refletir as alterações
    window.location.href = "dashboard.html";
  });

  // Excluir anúncio
  document.getElementById("btnExcluir").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir seu anúncio?")) {
      let anunciosAtuais = JSON.parse(localStorage.getItem("anuncios")) || [];
      const novos = anunciosAtuais.filter(a => !((a.id && a.id === usuario.id) || (a.email && a.email === usuario.email)));
      localStorage.setItem("anuncios", JSON.stringify(novos));
      alert("Anúncio removido!");
      window.location.href = "dashboard.html";
    }
  });

  // botão voltar (se existir)
  const btnVoltar = document.getElementById("voltarDashboard");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  }
});
