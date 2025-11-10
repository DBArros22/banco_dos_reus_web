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

  imgPerfil.src = usuarioLogado.foto || "imagens/default-user.png";

  // Mostra botão Meus Anúncios apenas para advogados
  if (usuarioLogado.tipo === "advogado") {
    btnMeusAnuncios.style.display = "block";
  }

  imgPerfil.addEventListener("click", (e) => {
    e.stopPropagation();
    menuPerfil.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-container")) {
      menuPerfil.classList.remove("active");
    }
  });

  btnMeusAnuncios.addEventListener("click", () => {
    if (usuarioLogado.tipo === "advogado") {
      window.location.href = "meus_anuncios_adv.html";
    }
  });

  btnAlterarFoto.addEventListener("click", () => {
    inputFoto.click();
  });

  // Atualizar foto de perfil
  inputFoto.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const novaFoto = e.target.result;
      imgPerfil.src = novaFoto;
      usuarioLogado.foto = novaFoto;
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      // Atualizar também no feed, se for advogado
      if (usuarioLogado.tipo === "advogado") {
        let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
        anuncios = anuncios.map(a => {
          if (a.email === usuarioLogado.email) a.foto = novaFoto;
          return a;
        });
        localStorage.setItem("anuncios", JSON.stringify(anuncios));
      }

      montarFeed();
    };
    reader.readAsDataURL(file);
  });

  btnLogout.addEventListener("click", () => {
    if (confirm("Deseja realmente sair?")) {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    }
  });

  function montarFeed() {
    feed.innerHTML = "";
    const anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
    const advs = anuncios.filter(a => a.tipo === "advogado");

    advs.forEach((anuncio) => {
      const card = document.createElement("div");
      card.classList.add("card-anuncio");
      card.innerHTML = `
        <img src="${anuncio.foto || 'imagens/default-user.png'}" alt="Foto do Advogado">
        <div>
          <h3>${anuncio.nome}</h3>
          <p><strong>Especialidade:</strong> ${anuncio.especialidade || 'Não informada'}</p>
          <p>${anuncio.portfolio || ''}</p>
          <button class="btnWhats" onclick="window.open('https://wa.me/${(anuncio.telefone || '').replace(/\\D/g, '')}', '_blank')">Falar no WhatsApp</button>
        </div>
      `;
      card.addEventListener("click", () => {
        localStorage.setItem("perfilSelecionado", JSON.stringify(anuncio));
        window.location.href = "posts_details.html";
      });
      feed.appendChild(card);
    });

    if (advs.length === 0) {
      feed.innerHTML = "<p>Nenhum advogado cadastrado ainda.</p>";
    }
  }

  montarFeed();
});
