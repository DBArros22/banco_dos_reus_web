// cadastro.js — versão otimizada e compatível com desktop e celular
document.addEventListener("DOMContentLoaded", () => {
  const tipoCadastro = document.getElementById("tipoCadastro");
  const camposExtras = document.getElementById("camposExtras");
  const formCadastro = document.getElementById("formCadastro");
  const voltarBtn = document.getElementById("voltarBtn");

  // 🔹 Atualiza campos extras conforme o tipo
  tipoCadastro.addEventListener("change", () => {
    const tipo = tipoCadastro.value;
    formCadastro.style.display = tipo ? "block" : "none";
    atualizarCamposExtras(tipo);
  });

  function atualizarCamposExtras(tipo) {
    if (tipo === "advogado") {
      camposExtras.innerHTML = `
        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" inputmode="tel" placeholder="(XX) XXXXX-XXXX" required>

        <label for="especialidade">Especialidade:</label>
        <input type="text" id="especialidade" placeholder="Ex: Direito Civil" list="listaEspecialidades" required>
        <datalist id="listaEspecialidades">
          <option value="Civil">
          <option value="Criminal">
          <option value="Trabalhista">
          <option value="Previdenciário">
          <option value="Tributário">
          <option value="Penal">
        </datalist>

        <label for="registroOAB">Registro OAB:</label>
        <input type="text" id="registroOAB" placeholder="Número da OAB" required>

        <label for="portfolio">Portfólio / apresentação:</label>
        <textarea id="portfolio" rows="2" placeholder="Descreva seu trabalho"></textarea>

        <label for="fotoCadastro">Foto:</label>
        <input type="file" id="fotoCadastro" accept="image/*">
      `;
    } else if (tipo === "cliente") {
      camposExtras.innerHTML = `
        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" inputmode="tel" placeholder="(XX) XXXXX-XXXX" required>

        <label for="fotoCadastro">Foto:</label>
        <input type="file" id="fotoCadastro" accept="image/*">
      `;
    } else {
      camposExtras.innerHTML = "";
    }
  }

  // 🔹 Botão voltar
  if (voltarBtn) {
    voltarBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // 🔹 Helper: lê imagem e converte em base64
  const getFotoDataURL = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve("imagens/default-user.png");
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(file);
    });
  };

  // 🔹 Tentativa segura de setItem no localStorage (evita erro de quota cheia)
  function salvarSeguro(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      console.warn("⚠️ Limite do localStorage atingido. Limpando dados antigos...");
      localStorage.clear();
      localStorage.setItem(chave, JSON.stringify(valor));
    }
  }

  // 🔹 Envio do formulário
  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeCadastro").value.trim();
    const email = document.getElementById("emailCadastro").value.trim();
    const senha = document.getElementById("senhaCadastro").value.trim();
    const tipo = tipoCadastro.value;

    if (!nome || !email || !senha || !tipo) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const fotoInput = document.getElementById("fotoCadastro");
    const foto = fotoInput && fotoInput.files.length > 0
      ? await getFotoDataURL(fotoInput.files[0])
      : "imagens/default-user.png";

    if (tipo === "advogado") {
      const telefone = document.getElementById("telefone").value.trim();
      const especialidade = document.getElementById("especialidade").value.trim();
      const registroOAB = document.getElementById("registroOAB").value.trim();
      const portfolio = document.getElementById("portfolio").value.trim();

      let advogados;
      try {
        advogados = JSON.parse(localStorage.getItem("advogados")) || [];
      } catch {
        advogados = [];
      }

      if (advogados.some((a) => a.email === email)) {
        alert("Este e-mail já está cadastrado como advogado.");
        return;
      }

      const novoAdv = {
        id: Date.now(),
        nome,
        email,
        senha,
        telefone,
        especialidade,
        registroOAB,
        portfolio,
        foto,
        tipo,
      };

      advogados.push(novoAdv);
      salvarSeguro("advogados", advogados);

      // Publica no feed
      let anuncios;
      try {
        anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
      } catch {
        anuncios = [];
      }

      const anuncioDoNovo = {
        id: novoAdv.id,
        nome: novoAdv.nome,
        especialidade: novoAdv.especialidade,
        portfolio: novoAdv.portfolio,
        email: novoAdv.email,
        foto: novoAdv.foto,
        telefone: novoAdv.telefone,
        registroOAB: novoAdv.registroOAB,
        tipo: novoAdv.tipo,
      };

      anuncios = anuncios.filter(
        (a) => a && a.email !== novoAdv.email && a.id !== novoAdv.id
      );
      anuncios.push(anuncioDoNovo);
      salvarSeguro("anuncios", anuncios);

      // Login automático
      salvarSeguro("usuarioLogado", novoAdv);
      localStorage.setItem("fotoPerfil", novoAdv.foto);

      alert("✅ Cadastro de advogado realizado com sucesso!");
      window.location.href = "dashboard.html";
    } else if (tipo === "cliente") {
      const telefone = document.getElementById("telefone").value.trim();

      let clientes;
      try {
        clientes = JSON.parse(localStorage.getItem("clientes")) || [];
      } catch {
        clientes = [];
      }

      if (clientes.some((c) => c.email === email)) {
        alert("Este e-mail já está cadastrado como solicitante.");
        return;
      }

      const novoCli = {
        id: Date.now(),
        nome,
        email,
        senha,
        telefone,
        foto,
        tipo,
      };

      clientes.push(novoCli);
      salvarSeguro("clientes", clientes);
      salvarSeguro("usuarioLogado", novoCli);
      localStorage.setItem("fotoPerfil", novoCli.foto);

      alert("✅ Cadastro de cliente realizado com sucesso!");
      window.location.href = "dashboard.html";
    }
  });
});
