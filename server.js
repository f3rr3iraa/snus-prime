// server.js (versão CommonJS)
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir ficheiros estáticos
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/templates', express.static(path.join(__dirname, 'templates')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔹 Rota para envio de email
app.post("/send-email", async (req, res) => {
  const { nome, email, contacto, assunto, mensagem } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: assunto,
      text: `Nome: ${nome}
Email: ${email}
Contacto: ${contacto}

Mensagem:
${mensagem}`,
    });

    console.log("✅ Email enviado com sucesso!");
    res.send({ success: true });
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Fallback para SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
