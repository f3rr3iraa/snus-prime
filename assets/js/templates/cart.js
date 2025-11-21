function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

async function renderCart() {
  fetch("/templates/components/cart-card.html")
    .then((response) => {
      if (!response.ok)
        throw new Error("Network response was not ok " + response.statusText);
      return response.text();
    })
    .then((data) => {
      const containerElement = document.getElementById("cart-products-content");
      containerElement.innerHTML = "";

      // Make sure you always load the latest cart
      loadCart();

      cart.forEach((element) => {
        const newCartProduct = document.createElement("div");
        newCartProduct.innerHTML = data;
        insertCartProductInfo(newCartProduct, element);
        containerElement.appendChild(newCartProduct);
      });

      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qt,
        0
      );

      const totalElement = document.getElementById("cart-total");
      const subtotalElement = document.getElementById("cart-subtotal");
      const subtotaltitleElement = document.getElementById(
        "cart-subtotal-title"
      );
      const taxesElement = document.getElementById("cart-taxes");
      const taxestitleElement = document.getElementById("cart-taxes-title");
      const payMao = document.getElementById("checkMao")?.checked;

      // If subtotal >= 50 OR "Em mão" -> FREE SHIPPING
      if (subtotal >= 50 || payMao) {
        taxesElement.classList.add("d-none");
        subtotalElement.classList.add("d-none");
        taxestitleElement.classList.add("d-none");
        subtotaltitleElement.classList.add("d-none");

        totalElement.textContent = `${subtotal.toFixed(2)}€`;
      } else {
        const newSub = subtotal > 0 ? subtotal + 4 : 0;

        taxesElement.classList.remove("d-none");
        subtotalElement.classList.remove("d-none");
        taxestitleElement.classList.remove("d-none");
        subtotaltitleElement.classList.remove("d-none");

        taxesElement.textContent = `4.00€`;
        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        totalElement.textContent = `${newSub.toFixed(2)}€`;
      }
    })
    .catch((error) => console.error("Error loading cart template:", error));
}

async function insertCartProductInfo(newCartProduct, element) {
  const cartProductImg = newCartProduct.querySelector("#cart-product-img");
  const cartProductName = newCartProduct.querySelector(
    "#cart-product-name-nicotine"
  );
  const cartProductBrand = newCartProduct.querySelector("#cart-product-brand");
  const cartProductPower = newCartProduct.querySelector("#cart-product-power");
  const cartProductFlavor = newCartProduct.querySelector(
    "#cart-product-flavor"
  );
  const cartProductSize = newCartProduct.querySelector("#cart-product-size");
  const cartProductPrice = newCartProduct.querySelector("#cart-product-price");
  const cartProductQt = newCartProduct.querySelector("#cart-product-qt");
  const cartProductTotalPrice = newCartProduct.querySelector(
    "#cart-product-total-price"
  );

  const basePath = `/data/img/${element.photoPath}`;
  const extensions = [".webp", ".jpg", ".jpeg", ".png"];
  let index = 0;

  function tryNext() {
    if (index < extensions.length) {
      cartProductImg.src = `${basePath}${extensions[index++]}`;
    } else {
      cartProductImg.src = "/assets/images/snus-prime-fallback.jpg";
    }
  }

  cartProductImg.onerror = tryNext;
  tryNext();

  cartProductName.textContent = `${element.name} | ${element.nicotine_mg} Mg`;
  cartProductBrand.textContent = element.brand;
  cartProductPower.textContent = element.power;
  cartProductFlavor.textContent = element.flavor;
  cartProductSize.textContent = element.size;
  cartProductPrice.textContent = `${element.price}€`;
  cartProductQt.value = element.qt;
  cartProductTotalPrice.textContent = `${(element.price * element.qt).toFixed(
    2
  )}€`;

  const btnAdd = newCartProduct.querySelector("#btnAdd");
  const btnReduce = newCartProduct.querySelector("#btnReduce");
  const btnRemove = newCartProduct.querySelector(".btn.text-danger");

  // ✅ Disable minus button if quantity is 1
  btnReduce.disabled = element.qt <= 1;

  btnAdd.onclick = () => {
    addProductQt(element.name);
  };

  btnReduce.onclick = () => {
    if (element.qt > 1) {
      reduceProductQt(element.name);
    }
  };

  btnRemove.onclick = () => removeProduct(element.name);

  cartProductQt.addEventListener("change", (e) => {
    const newValue = parseInt(e.target.value, 10);

    if (isNaN(newValue) || newValue < 1) {
      e.target.value = element.qt;
      return;
    }

    updateProductQt(element.name, newValue);
  });
}

function updateProductQt(productName, newQt) {
  loadCart();
  const item = cart.find((p) => p.name === productName);
  if (item) {
    item.qt = newQt;
    saveCart();
    renderCart();
    updateCartBadge();
  }
}

function addProductQt(productName) {
  loadCart();
  const item = cart.find((p) => p.name === productName);
  if (item) {
    item.qt += 1;
    saveCart();
    renderCart();
    updateCartBadge();
  }
}

function reduceProductQt(productName) {
  loadCart();
  const item = cart.find((p) => p.name === productName);
  if (item) {
    item.qt -= 1;
    if (item.qt <= 0) {
      cart = cart.filter((p) => p.name !== productName);
    }
    saveCart();
    renderCart();
    updateCartBadge();
  }
}

function removeProduct(productName) {
  loadCart();
  cart = cart.filter((p) => p.name !== productName);
  saveCart();
  renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  loadCart();
  const badge = document.getElementById("cart-badge");
  if (!badge) {
    console.warn("⚠️ cart-badge não encontrado no DOM");
    return;
  }
  const totalQt = cart.reduce((sum, item) => sum + item.qt, 0);
  if (totalQt > 0) {
    badge.textContent = totalQt;
    badge.classList.remove("d-none");
  } else {
    badge.classList.add("d-none");
  }
  console.log("🛒 Badge atualizado:", totalQt);
}

let isSendingCheckout = false;

function initCheckoutValidation() {
  const btn = document.querySelector(".btn-buy");
  if (!btn) {
    console.warn("btn-buy not found — validation not initialized.");
    return;
  }

  const payments = document.querySelectorAll(".payment-check");
  const paymentError = document.getElementById("payment-error");
  const localEncontroInput = document.getElementById("local-encontro-buy");
  const localEncontroContainer = localEncontroInput.parentElement;

  // Hide Local de Encontro initially
  localEncontroContainer.style.display = "none";
  localEncontroInput.required = false;

  // Initialize dataset.checked for radio-like behavior
  payments.forEach((ch) => (ch.dataset.checked = "false"));

  // Payment checkboxes click handler
  payments.forEach((ch) => {
    ch.addEventListener("click", () => {
      if (ch.dataset.checked === "true") {
        ch.checked = true;
      }

      payments.forEach((other) => {
        if (other !== ch) {
          other.checked = false;
          other.dataset.checked = "false";
        }
      });

      ch.dataset.checked = "true";

      // Show/hide Local de Encontro if "Em mão" is selected
      if (ch.id === "checkMao" && ch.checked) {
        localEncontroContainer.style.display = "block";
        localEncontroInput.required = true;
      } else {
        localEncontroContainer.style.display = "none";
        localEncontroInput.required = false;
        localEncontroInput.classList.remove("is-invalid");
      }

      // Hide payment error
      if (ch.checked) {
        paymentError.classList.add("d-none");
        paymentError.classList.remove("d-block");
      }
    });
  });

  // Buy button click handler
  btn.addEventListener("click", async () => {
    const form = document.getElementById("checkout-form");
    let valid = true;

    // Validate payment method
    const oneChecked = Array.from(payments).some((ch) => ch.checked);
    if (!oneChecked) {
      valid = false;
      paymentError.classList.add("d-block");
      paymentError.classList.remove("d-none");
    } else {
      paymentError.classList.add("d-none");
      paymentError.classList.remove("d-block");
    }

    // Validate text inputs
    form.querySelectorAll("input").forEach((input) => {
      if (input.required && !input.value.trim()) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid"); // ensure no green
        valid = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid"); // keep default look
      }
    });

    if (!valid) return;

    // SUCCESS
    console.log("Formulário válido. Enviando...");
    await sendEmailApi();
  });
}

document.getElementById("checkMao").addEventListener("click", () => {
  const checkMao = document.getElementById("checkMao");
  const totalElement = document.getElementById("cart-total");
  const subtotalElement = document.getElementById("cart-subtotal");
  const subtotaltitleElement = document.getElementById("cart-subtotal-title");
  const taxesElement = document.getElementById("cart-taxes");
  const taxestitleElement = document.getElementById("cart-taxes-title");

  // Calculate current subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qt, 0);

  if (checkMao.checked) {
    // "Em mão" selected → hide taxes, total = subtotal
    taxesElement.classList.add("d-none");
    taxestitleElement.classList.add("d-none");
    subtotalElement.classList.add("d-none");
    subtotaltitleElement.classList.add("d-none");

    totalElement.textContent = `${subtotal.toFixed(2)}€`;
  } else {
    // Not "Em mão" → show taxes if subtotal < 50
    if (subtotal >= 50) {
      taxesElement.classList.add("d-none");
      taxestitleElement.classList.add("d-none");
      subtotalElement.classList.add("d-none");
      subtotaltitleElement.classList.add("d-none");

      totalElement.textContent = `${subtotal.toFixed(2)}€`;
    } else {
      const totalWithTax = subtotal + 4;

      taxesElement.classList.remove("d-none");
      taxestitleElement.classList.remove("d-none");
      subtotalElement.classList.remove("d-none");
      subtotaltitleElement.classList.remove("d-none");

      taxesElement.textContent = `4.00€`;
      subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
      totalElement.textContent = `${totalWithTax.toFixed(2)}€`;
    }
  }
});


async function sendEmailApi() {
  if (isSendingCheckout) return;
  isSendingCheckout = true;

  try {
    // Load cart
    loadCart();

    // Get payment method
    const payments = document.querySelectorAll(".payment-check");
    let paymentMethod = "";
    payments.forEach((ch) => {
      if (ch.checked) paymentMethod = ch.id; // "checkReferencia", "checkPayPal", "checkMao"
    });

    // Build dados object from form
    const dados = {
      nome: document.getElementById("nome-buy").value.trim(),
      email: document.getElementById("email-buy").value.trim(),
      contacto: document.getElementById("contacto-buy").value.trim(),
      morada: document.getElementById("morada-buy").value.trim(),
      cidade: document.getElementById("cidade-buy").value.trim(),
      codigo_postal: document.getElementById("codigo-postal-buy").value.trim(),
      local_encontro: document
        .getElementById("local-encontro-buy")
        .value.trim(),
      cart: cart.map((item) => ({
        name: item.name,
        brand: item.brand,
        price: item.price,
        qt: item.qt,
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.qt, 0),
      paymentMethod,
    };

    // Send to Netlify function
    const resposta = await fetch("/.netlify/functions/send-buy-confirmation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resultado.success) {
      showToast("✅ Compra confirmada! Email enviado.", "success");
      // Clear cart
      cart = [];
      saveCart();
      renderCart();
      updateCartBadge();
      // Reset form
      document.getElementById("checkout-form").reset();
    } else {
      showToast("❌ Erro ao enviar confirmação da compra.", "error");
    }
  } catch (erro) {
    console.error(erro);
    showToast("⚠️ Erro de ligação com o servidor.", "error");
  } finally {
    isSendingCheckout = false;
  }
}
