let isSending = false;

document.addEventListener("click", (event) => {
  if (event.target.closest("#contactForm")) return;
});

document.addEventListener("submit", async (e) => {
  if (e.target && e.target.id === "contactForm") {
    e.preventDefault();

    if (isSending) return;
    isSending = true;

    const dados = {
      nome: document.getElementById("nome").value,
      email: document.getElementById("email").value,
      contacto: document.getElementById("contacto").value,
      assunto: document.getElementById("assunto").value,
      mensagem: document.getElementById("mensagem").value,
    };

    try {
      const resposta = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado = await resposta.json();

      if (resultado.success) {
        showToast("✅ Email enviado com sucesso!", "success");
        e.target.reset();
      } else {
        showToast("❌ Erro ao enviar o email.", "error");
      }
    } catch (erro) {
      console.error(erro);
      showToast("⚠️ Erro de ligação com o servidor.", "error");
    } finally {

      isSending = false;
    }
  }
});


function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");

  toast.textContent = message;
  toast.style.padding = "12px 20px";
  toast.style.marginTop = "10px";
  toast.style.borderRadius = "8px";
  toast.style.color = "#fff";
  toast.style.minWidth = "250px";
  toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  toast.style.transform = "translateX(50px)"; 

  if (type === "success") toast.style.backgroundColor = "#28a745";
  else if (type === "error") toast.style.backgroundColor = "#dc3545";
  else {
    toast.style.backgroundColor = "#ffc107";
    toast.style.color = "#000";
  }

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
