document.addEventListener("DOMContentLoaded", () => {
  const tipoCadastro = document.getElementById("tipoCadastro");
  const camposExtras = document.getElementById("camposExtras");
  const formCadastro = document.getElementById("formCadastro");
  const voltarBtn = document.getElementById("voltarBtn");

  // 🔹 Mostra campos conforme tipo selecionado
  tipoCadastro.addEventListener("change", () => {
    const tipo = tipoCadastro.value;
    if (!tipo) {
      camposExtras.innerHTML = "";
      formCadastro.style.display = "none";
    } else {
      formCadastro.style.display = "block";
      atualizarCamposExtras(tipo);
    }
  });

  function atualizarCamposExtras(tipo) {
    if (tipo === "advogado") {
      camposExtras.innerHTML = `
        <label for="telefone">Telefone:</label>
        <input type="tel" id="telefone" placeholder="(XX) XXXXX-XXXX" required>

        <label for="especialidade">Especialidade:</label>
        <input type="text" id="especialidade" placeholder="Ex: Direito Civil" required>

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
        <input type="tel" id="telefone" placeholder="(XX) XXXXX-XXXX" required>

        <label for="fotoCadastro">Foto:</label>
        <input type="file" id="fotoCadastro" accept="image/*">
      `;
    } else {
      camposExtras.innerHTML = "";
    }
  }

  // 🔹 Botão voltar
  voltarBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 🔹 Tratamento do envio do formulário
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

    // Lê foto se existir
    const fotoInput = document.getElementById("fotoCadastro");
    const getFotoDataURL = (file) => {
      return new Promise((resolve) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    };

    const foto = fotoInput && fotoInput.files[0]
      ? await getFotoDataURL(fotoInput.files[0])
      : "imagens/default-user.png";

    if (tipo === "advogado") {
      const telefone = document.getElementById("telefone")?.value.trim() || "";
      const especialidade = document.getElementById("especialidade")?.value.trim() || "";
      const registroOAB = document.getElementById("registroOAB")?.value.trim() || "";
      const portfolio = document.getElementById("portfolio")?.value.trim() || "";

      let advogados = JSON.parse(localStorage.getItem("advogados")) || [];

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
        tipo
      };

      // 🔸 Salva advogado
      advogados.push(novoAdv);
      localStorage.setItem("advogados", JSON.stringify(advogados));

      // 🔸 Publica no feed automaticamente
      let anuncios = JSON.parse(localStorage.getItem("anuncios")) || [];
      const anuncioDoNovo = {
        id: novoAdv.id,
        nome: novoAdv.nome,
        especialidade: novoAdv.especialidade,
        portfolio: novoAdv.portfolio,
        email: novoAdv.email,
        foto: novoAdv.foto,
        tipo: novoAdv.tipo
      };

      anuncios = anuncios.filter((a) => a && a.email !== novoAdv.email);
      anuncios.push(anuncioDoNovo);
      localStorage.setItem("anuncios", JSON.stringify(anuncios));

      // 🔸 Login automático
      localStorage.setItem("usuarioLogado", JSON.stringify(novoAdv));
      localStorage.setItem("fotoPerfil", novoAdv.foto);

      alert("✅ Cadastro de advogado realizado com sucesso!\nSeu anúncio foi publicado no feed.");
      window.location.href = "dashboard.html";

    } else if (tipo === "cliente") {
      const telefone = document.getElementById("telefone")?.value.trim() || "";
      let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

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
        tipo
      };

      clientes.push(novoCli);
      localStorage.setItem("clientes", JSON.stringify(clientes));
      localStorage.setItem("usuarioLogado", JSON.stringify(novoCli));
      localStorage.setItem("fotoPerfil", novoCli.foto);

      alert("✅ Cadastro de cliente realizado com sucesso!");
      window.location.href = "dashboard.html";
    } else {
      alert("Selecione um tipo de cadastro.");
    }
  });
});
