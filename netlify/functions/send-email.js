// netlify/functions/send-email.js
const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { nome, email, contacto, assunto, mensagem } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const contactHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #222;">
    
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://snus-prime.netlify.app/assets/images/snus-prime_logo.png" 
           alt="SNUS PRIME" 
           style="max-width: 160px;">
    </div>

    <h2 style="color:#333;">Novo contacto recebido</h2>

    <p>Um utilizador enviou uma nova mensagem através do formulário de contacto:</p>

    <div style="background:#f8f8f8; padding:15px; border-radius:6px; margin:20px 0;">
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contacto:</strong> ${contacto || "Não fornecido"}</p>
      <p><strong>Assunto:</strong> ${assunto}</p>
    </div>

    <h3 style="margin-top: 10px; color:#333;">Mensagem:</h3>
    <div style="background:#fafafa; padding:15px; border-left:4px solid #ccc; white-space:pre-wrap; border-radius:4px;">
      ${mensagem}
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">
    
    <p style="font-size:14px; color:#555;">Este email foi gerado automaticamente pelo website SNUS PRIME.</p>
  </div>
`;

    await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: assunto,
      html: contactHtml,
    });

    console.log("✅ Email sent successfully!");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
