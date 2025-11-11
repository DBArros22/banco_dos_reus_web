// dashboard.js — feed principal (lista anúncios). Mantém foto, telefone e OAB integrados.

document.addEventListener("DOMContentLoaded", () => {
  const imgPerfil = document.getElementById("imgPerfil");
  const inputFoto = document.getElementById("inputFoto");
  const menuPerfil = document.getElementById("menuPerfil");
  const btnMeusAnuncios = document.getElementById("btnMeusAnuncios");
  const btnAlterarFoto = document.getElementById("btnAlterarFoto");
  const btnLogout = document.getElementById("btnLogout");
  const feed = document.getElementById("feed");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioLogado) {
    alert("Sessão expirada! Faça login novamente.");
    window.location.href = "index.html";
    return;
  }

  // Exibe foto do perfil (sincronizada)
  imgPerfil.src = usuarioLogado.foto || localStorage.getItem("fotoPerfil") || "imagens/default-user.png";

  // Mostra botão Meus Anúncios apenas para advogados
  if (usuarioLogado.tipo === "advogado" && btnMeusAnuncios) {
    btnMeusAnuncios.style.display = "block";
  } else if (btnMeusAnuncios) {
    btnMeusAnuncios.style.display = "none";
  }

  // Toggle menu
  if (imgPerfil) {
    imgPerfil.addEventListener("click", (e) => {
      e.stopPropagation();
      menuPerfil.classList.toggle("active");
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-container")) {
      menuPerfil.classList.remove("active");
    }
  });

  // Navegação
  if (btnMeusAnuncios) {
    btnMeusAnuncios.addEventListener("click", () => {
      if (usuarioLogado.tipo === "advogado") {
        window.location.href = "meus_anuncios_adv.html";
      }
    });
  }
  if (btnAlterarFoto) {
    btnAlterarFoto.addEventListener("click", () => inputFoto.click());
  }
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      if (confirm("Deseja realmente sair?")) {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
      }
    });
  }

  // Atualizar foto de perfil e sincronizar com anúncios
  if (inputFoto) {
    inputFoto.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const novaFoto = e.target.result;
        imgPerfil.src = novaFoto;
        usuarioLogado.foto = novaFoto;
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
        localStorage.setItem("fotoPerfil", novaFoto);

        // atualiza no array de anúncios se o e-mail bater
        let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
        anuncios = anuncios.map(a => {
          if (a && a.email === usuarioLogado.email) {
            return { ...a, foto: novaFoto };
          }
          return a;
        });
        localStorage.setItem("anuncios", JSON.stringify(anuncios));

        montarFeed();
      };
      reader.readAsDataURL(file);
    });
  }

  // Monta o feed com todos os advogados cadastrados (apenas informações reduzidas)
  function montarFeed() {
    feed.innerHTML = "";
    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
    const advs = anuncios.filter(a => a && a.tipo === "advogado");

    if (advs.length === 0) {
      feed.innerHTML = "<p>Nenhum advogado cadastrado ainda.</p>";
      return;
    }

    advs.forEach((anuncio) => {
      const card = document.createElement("div");
      card.classList.add("card-anuncio");
      card.innerHTML = `
        <img src="${anuncio.foto || 'imagens/default-user.png'}" alt="Foto do Advogado">
        <div class="card-info">
          <h3>${anuncio.nome || ''}</h3>
          <p><strong>Especialidade:</strong> ${anuncio.especialidade || 'Não informada'}</p>
          <p>${anuncio.portfolio || ''}</p>
        </div>
      `;

      // Ao clicar no card salva o objeto completo (inclui telefone e registroOAB) e abre detalhes
      card.addEventListener("click", () => {
        localStorage.setItem("perfilSelecionado", JSON.stringify(anuncio));
        window.location.href = "posts_details.html";
      });

      feed.appendChild(card);
    });
  }

  // executa montagem
  montarFeed();
});
