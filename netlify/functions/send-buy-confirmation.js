// netlify/functions/send-buy-confirmation.js
const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const {
      nome,
      email,
      contacto,
      morada,
      cidade,
      codigo_postal,
      local_encontro,
      cart,
      total,
      paymentMethod,
    } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Payment instructions
    let paymentDetails = "";
    let paymentMethodGoodStyle = "";
    if (paymentMethod === "checkReferencia") {
      paymentMethodGoodStyle = "Entidade / Referência";
      paymentDetails = `
      Entidade: 123465
      Referência: 789456123
      Montante: ${total.toFixed(2)}€
      `;
    } else if (paymentMethod === "checkPayPal") {
      paymentMethodGoodStyle = "Paypal";
      paymentDetails = `Faça o pagamento via PayPal para: snusprimestore@gmail.`;
    } else if (paymentMethod === "checkMao") {
      paymentMethodGoodStyle = "Local de Encontro";
      paymentDetails = `Faça o pagamento em mão, no local de encontro: ${local_encontro}`;
    } else {
      paymentMethodGoodStyle = "Desconhecido";
      paymentDetails =
        "Método de pagamento desconhecido. Entraremos em contacto quando possível!";
    }

    // Filter cart items to only needed fields
    const filteredCart = cart.map((item) => ({
      name: item.name,
      brand: item.brand,
      price: item.price,
      qt: item.qt,
    }));

    // Buyer HTML template
    const buyerHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #222;">
    
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://snus-prime.netlify.app/assets/images/snus-prime_logo.png" 
           alt="SNUS PRIME" 
           style="max-width: 160px;">
    </div>

    <h2 style="color:#333;">Obrigado pela sua compra, ${nome}!</h2>

    <div style="background:#f8f8f8; padding:12px; border-radius:6px; white-space:pre-wrap; margin-bottom:15px;">
      ${paymentDetails}
    </div>

    <p>Segue abaixo o resumo do seu pedido:</p>

    <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
      <thead>
        <tr>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:left;">Marca</th>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:left;">Produto</th>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:center;">Quantidade</th>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:right;">Preço (€)</th>
        </tr>
      </thead>
      <tbody>
        ${filteredCart
          .map(
            (item) => `
          <tr>
            <td style="padding:10px; text-align:center; border-bottom: 1px solid #f0f0f0;">${
              item.brand
            }</td>
            <td style="padding:10px; border-bottom: 1px solid #f0f0f0;">${
              item.name
            }</td>
            <td style="padding:10px; text-align:center; border-bottom: 1px solid #f0f0f0;">${
              item.qt
            }</td>
            <td style="padding:10px; text-align:right; border-bottom: 1px solid #f0f0f0;">${(
              item.price * item.qt
            ).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <p style="font-size: 16px; margin-top: 10px;">
      <strong>Total: ${total.toFixed(2)}€</strong>
    </p>
    ${total < 50 
  ? `<p style="font-size: 12px; margin-top: 6px;">Taxas: 4.00€</p>` 
  : ``}

    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

    <p>Atenciosamente,<br>
    <strong>SNUS PRIME</strong></p>
  </div>
`;

    // Admin HTML template
    const adminHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #222;">
    
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://snus-prime.netlify.app/assets/images/snus-prime_logo.png" 
           alt="SNUS PRIME" 
           style="max-width: 160px;">
    </div>

    <h2 style="color:#333;">Nova compra realizada!</h2>

    <div style="margin-bottom: 15px;">
      <p><strong>Cliente:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contacto:</strong> ${contacto}</p>
      <p><strong>Morada:</strong> ${morada}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Código Postal:</strong> ${codigo_postal}</p>
      <p><strong>Local de Encontro:</strong> ${local_encontro}</p>
      <p><strong>Método de pagamento:</strong> ${paymentMethodGoodStyle}</p>
      <p><strong>Total:</strong> ${total.toFixed(2)}€</p>
    </div>

    <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
      <thead>
        <tr>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:left;">Marca</th>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:left;">Produto</th>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:center;">Quantidade</th>
          <th style="border-bottom: 2px solid #eaeaea; padding: 10px; text-align:right;">Preço (€)</th>
        </tr>
      </thead>
      <tbody>
        ${filteredCart
          .map(
            (item) => `
          <tr>
            <td style="padding:10px; border-bottom: 1px solid #f0f0f0;">${
              item.brand
            }</td>
            <td style="padding:10px; border-bottom: 1px solid #f0f0f0;">${
              item.name
            }</td>
            <td style="padding:10px; text-align:center; border-bottom: 1px solid #f0f0f0;">${
              item.qt
            }</td>
            <td style="padding:10px; text-align:right; border-bottom: 1px solid #f0f0f0;">${(
              item.price * item.qt
            ).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
`;

    // Send emails
    await transporter.sendMail({
      from: `"SNUS PRIME" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirmação da sua compra",
      html: buyerHtml,
    });

    await transporter.sendMail({
      from: `"SNUS PRIME" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Nova compra de ${nome}`,
      html: adminHtml,
    });

    console.log("✅ Buy confirmation emails sent!");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Error sending buy confirmation:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
