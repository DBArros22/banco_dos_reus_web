// posts_details.js — exibe detalhe completo do perfil clicado (telefone, OAB, whatsapp, foto)

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detalhe-container");
  const perfilRaw = localStorage.getItem("perfilSelecionado");
  const perfil = perfilRaw ? JSON.parse(perfilRaw) : null;

  if (!perfil) {
    if (container) container.innerHTML = "<p>Nenhum perfil foi selecionado.</p>";
    return;
  }

  // pegar nomes/infos em várias chaves possíveis
  const nome = perfil.nome || perfil.name || perfil.nomeCadastro || "Nome não informado";
  const email = perfil.email || perfil.emailCadastro || "Email não informado";
  const descricao =
    perfil.portfolio?.trim() ||
    perfil.descricao?.trim() ||
    perfil.about?.trim() ||
    perfil.bio?.trim() ||
    perfil.description?.trim() ||
    "";

  // telefone (aceita variações)
  const telefoneRaw =
    perfil.telefone ||
    perfil.phone ||
    perfil.contato ||
    perfil.contact ||
    perfil.telefoneCadastro ||
    "";

  const telefoneFormatado = telefoneRaw ? String(telefoneRaw).trim() : "";
  const telefoneExibicao = telefoneFormatado || "Não informado";

  // whatsapp link — limpa não-dígitos. Se já tiver DDI assume Brasil; caso usuário tenha +55, remove.
  const apenasDigitos = telefoneFormatado.replace(/\D/g, "");
  const whatsNumber = apenasDigitos ? (apenasDigitos.startsWith("55") ? apenasDigitos : `55${apenasDigitos}`) : null;
  const linkWhatsApp = whatsNumber ? `https://wa.me/${whatsNumber}` : null;

  // OAB
  const registroOAB = perfil.registroOAB || perfil.oab || perfil.reg_OAB || "";

  // foto (varias chaves)
  const foto =
    perfil.foto ||
    perfil.fotoPerfil ||
    perfil.avatar ||
    perfil.imagem ||
    perfil.image ||
    perfil.fotoCadastro ||
    "imagens/default-user.png";

  // renderiza
  if (container) {
    container.innerHTML = `
      <div class="perfil-detalhado">
        <img src="${foto}" class="foto-detalhe" alt="Foto do profissional">
        <h2>${escapeHtml(nome)}</h2>
        <p><strong>Especialidade:</strong> ${escapeHtml(perfil.especialidade || perfil.specialty || 'Não informada')}</p>
        <p><strong>Descrição:</strong> ${descricao ? escapeHtml(descricao) : 'Sem descrição'}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefone:</strong> ${escapeHtml(telefoneExibicao)}</p>
        <p><strong>Registro OAB:</strong> ${escapeHtml(registroOAB || 'Não informado')}</p>
        ${linkWhatsApp ? `<a href="${linkWhatsApp}" target="_blank" class="botao-whatsapp">💬 Falar no WhatsApp</a>` : ''}
        <div style="margin-top:18px;">
          <button id="voltar" class="voltar-btn">← Voltar ao Feed</button>
        </div>
      </div>
    `;
  }

  // botão voltar: tenta history.back() senão redireciona
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

  // escapeHTML
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
