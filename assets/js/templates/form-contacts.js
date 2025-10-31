document.addEventListener("click", (event) => {
  if (event.target.closest("#contactForm")) return; // evita duplas ligações
});

document.addEventListener("submit", async (e) => {
  if (e.target && e.target.id === "contactForm") {
    e.preventDefault();

    const dados = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      contacto: document.getElementById("contacto").value,
      assunto: document.getElementById("assunto").value,
      mensagem: document.getElementById("mensagem").value,
    };

    try {
      const resposta = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (resultado.success) {
        alert("✅ Email enviado com sucesso!");
        e.target.reset();
      } else {
        alert("❌ Erro ao enviar o email.");
      }
    } catch (erro) {
      console.error(erro);
      alert("⚠️ Erro de ligação com o servidor.");
    }
  }
});