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
    const { nome, email, contacto, morada, cidade, codigo_postal, local_encontro, cart, total, paymentMethod } = JSON.parse(event.body);

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
      paymentMethodGoodStyle = "Entidade / Referência"
      paymentDetails = `
      Entidade: 123465
      Referência: 789456123
      `;
    } else if (paymentMethod === "checkPayPal") {
      paymentMethodGoodStyle = "Paypal"
      paymentDetails = `Faça o pagamento via PayPal para: snusprimestore@gmail.`;
    } else if (paymentMethod === "checkMao") {
      paymentMethodGoodStyle = "Local de Encontro"
      paymentDetails = `Faça o pagamento em mão, no local de encontro: ${local_encontro}`;
    } else {
      paymentMethodGoodStyle = "Desconhecido"
      paymentDetails = "Método de pagamento desconhecido. Entraremos em contacto quando possível!";
    }

    // Filter cart items to only needed fields
    const filteredCart = cart.map(item => ({
      name: item.name,
      price: item.price,
      qt: item.qt
    }));

    // Buyer HTML template
    const buyerHtml = `
      <h2>Obrigado pela sua compra, ${nome}!</h2>
      <p>Aqui estão os detalhes do seu pedido:</p>
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border-bottom:1px solid #ddd; padding: 8px;">Produto</th>
            <th style="border-bottom:1px solid #ddd; padding: 8px;">Quantidade</th>
            <th style="border-bottom:1px solid #ddd; padding: 8px;">Preço (€)</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCart.map(item => `
            <tr>
              <td style="padding:8px;">${item.name}</td>
              <td style="padding:8px; text-align:center;">${item.qt}</td>
              <td style="padding:8px; text-align:right;">${(item.price * item.qt).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p><strong>Total: ${total.toFixed(2)}€</strong></p>
      <p>Método de pagamento: ${paymentMethodGoodStyle}</p>
      <pre>${paymentDetails}</pre>
      <hr>
      <p>Atenciosamente,</p>
      <p>Sua Empresa</p>
    `;

    // Admin HTML template
    const adminHtml = `
      <h2>Nova compra realizada!</h2>
      <p>Cliente: ${nome}</p>
      <p>Email: ${email}</p>
      <p>Contacto: ${contacto}</p>
      <p>Morada: ${morada}</p>
      <p>Cidade: ${cidade}</p>
      <p>Codigo Postal: ${codigo_postal}</p>
      <p>Local de Encontro: ${local_encontro}</p>
      <p>Total: ${total.toFixed(2)}€</p>
      <p>Método de pagamento: ${paymentMethodGoodStyle}</p>
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border-bottom:1px solid #ddd; padding: 8px;">Produto</th>
            <th style="border-bottom:1px solid #ddd; padding: 8px;">Quantidade</th>
            <th style="border-bottom:1px solid #ddd; padding: 8px;">Preço (€)</th>
          </tr>
        </thead>
        <tbody>
          ${filteredCart.map(item => `
            <tr>
              <td style="padding:8px;">${item.name}</td>
              <td style="padding:8px; text-align:center;">${item.qt}</td>
              <td style="padding:8px; text-align:right;">${(item.price * item.qt).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <pre>${paymentDetails}</pre>
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
