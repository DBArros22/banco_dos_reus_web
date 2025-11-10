// posts_details.js — exibe os detalhes do profissional selecionado
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detalhe-container");
  const perfilRaw = localStorage.getItem("perfilSelecionado");
  const perfil = perfilRaw ? JSON.parse(perfilRaw) : null;

  if (!perfil) {
    container.innerHTML = "<p>Nenhum perfil foi selecionado.</p>";
    return;
  }

  const nome = perfil.nome || perfil.name || perfil.nomeCadastro || "Nome não informado";
  const email = perfil.email || perfil.emailCadastro || "Email não informado";
  const descricao =
    perfil.portfolio?.trim() ||
    perfil.descricao?.trim() ||
    perfil.about?.trim() ||
    perfil.bio?.trim() ||
    perfil.description?.trim() ||
    "";

  const telefoneRaw =
    perfil.telefone ||
    perfil.phone ||
    perfil.contato ||
    perfil.contact ||
    perfil.telefoneCadastro ||
    "";

  const telefoneFormatado = telefoneRaw ? telefoneRaw.toString().trim() : "";
  const telefoneExibicao = telefoneFormatado || "Não informado";
  const apenasDigitos = telefoneFormatado.replace(/\D/g, "");
  const linkWhatsApp = apenasDigitos ? `https://wa.me/55${apenasDigitos}` : null;

  const foto =
    perfil.foto || perfil.fotoPerfil || perfil.avatar || perfil.imagem || "imagens/default-user.png";

  container.innerHTML = `
    <div class="perfil-detalhado">
      <img src="${foto}" class="foto-detalhe" alt="Foto do profissional">
      <h2>${escapeHtml(nome)}</h2>
      <p><strong>Especialidade:</strong> ${escapeHtml(perfil.especialidade || "Não informada")}</p>
      <p><strong>Descrição:</strong> ${descricao ? escapeHtml(descricao) : "Sem descrição"}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(telefoneExibicao)}</p>
      ${
        linkWhatsApp
          ? `<a href="${linkWhatsApp}" target="_blank" class="botao-whatsapp">💬 Entrar em contato pelo WhatsApp</a>`
          : ""
      }
      <div style="margin-top:18px;"></div>
    </div>
  `;

  const btnVoltar = document.getElementById("voltar");
  if (btnVoltar) {
    btnVoltar.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "dashboard.html";
      }
    });
  }

  function escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
