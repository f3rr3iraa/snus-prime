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

            const subtotal = cart.reduce((sum, item) => sum + item.price * item.qt, 0);

            const subtotalElement = document.getElementById("cart-subtotal");
            if (subtotalElement) {
                subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
            }
        })
        .catch((error) => console.error("Error loading cart template:", error));
}


async function insertCartProductInfo(newCartProduct, element) {
    const cartProductImg = newCartProduct.querySelector("#cart-product-img");
    const cartProductName = newCartProduct.querySelector("#cart-product-name-nicotine");
    const cartProductBrand = newCartProduct.querySelector("#cart-product-brand");
    const cartProductPower = newCartProduct.querySelector("#cart-product-power");
    const cartProductFlavor = newCartProduct.querySelector("#cart-product-flavor");
    const cartProductSize = newCartProduct.querySelector("#cart-product-size");
    const cartProductPrice = newCartProduct.querySelector("#cart-product-price");
    const cartProductQt = newCartProduct.querySelector("#cart-product-qt");
    const cartProductTotalPrice = newCartProduct.querySelector("#cart-product-total-price");

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
    cartProductTotalPrice.textContent = `${(element.price * element.qt).toFixed(2)}€`;

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

// 🔴 Atualiza a bolinha do carrinho
function updateCartBadge() {
    loadCart();
    const total = cart.reduce((sum, item) => sum + item.qt, 0);

    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    if (total > 0) {
        badge.textContent = total;
        badge.style.display = "block";
    } else {
        badge.style.display = "none";
    }
}

// Quando a página carregar → atualizar badge
document.addEventListener("DOMContentLoaded", updateCartBadge);



function updateProductQt(productName, newQt) {
    loadCart();
    const item = cart.find(p => p.name === productName);
    if (item) {
        item.qt = newQt;
        saveCart();
        renderCart();
        updateCartBadge();
    }
}

function addProductQt(productName) {
    loadCart();
    const item = cart.find(p => p.name === productName);
    if (item) {
        item.qt += 1;
        saveCart();
        renderCart();
        updateCartBadge(); 
    }
}

function reduceProductQt(productName) {
    loadCart();
    const item = cart.find(p => p.name === productName);
    if (item) {
        item.qt -= 1;
        if (item.qt <= 0) {
            cart = cart.filter(p => p.name !== productName);
        }
        saveCart();
        renderCart();
        updateCartBadge(); 
    }
}

function removeProduct(productName) {
    loadCart();
    cart = cart.filter(p => p.name !== productName);
    saveCart();
    renderCart();
    updateCartBadge(); 
}


function addToCart(product) {
    loadCart();
    const existing = cart.find(p => p.id === product.id);
    if (existing) existing.qt += 1;
    else cart.push({ ...product, qt: 1 });
    saveCart();
    updateCartBadge(); 
}

