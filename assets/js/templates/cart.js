async function renderCart() {
    fetch("/templates/components/cart-card.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)
            return response.text()
        })
        .then((data) => {
            const containerElement = document.getElementById("cart-products-content")
            containerElement.innerHTML = ""
            cart.forEach((element) => {
                const newCartProduct = document.createElement("div")
                newCartProduct.innerHTML = data
                insertCartProductInfo(newCartProduct, element)
                containerElement.appendChild(newCartProduct)
            })
        })
}

async function insertCartProductInfo(newCartProduct, element) {
    const cartProductImg = newCartProduct.querySelector("#cart-product-img")
    const cartProductName = newCartProduct.querySelector("#cart-product-name-nicotine")
    const cartProductBrand = newCartProduct.querySelector("#cart-product-brand")
    const cartProductPower = newCartProduct.querySelector("#cart-product-power")
    const cartProductFlavor = newCartProduct.querySelector("#cart-product-flavor")
    const cartProductSize = newCartProduct.querySelector("#cart-product-size")
    const cartProductPrice = newCartProduct.querySelector("#cart-product-price")
    const cartProductQt = newCartProduct.querySelector("#cart-product-qt")
    const cartProductTotalPrice = newCartProduct.querySelector("#cart-product-total-price")
    // const productOldPrice = newCartProduct.querySelector("#product-old-promo-price")

    cartProductImg.src = `/data/img/${element.photoPath}.jpg`
    cartProductName.textContent = `${element.name} | ${element.nicotine_mg} Mg`
    cartProductBrand.textContent = element.brand
    cartProductPower.textContent = element.power
    cartProductFlavor.textContent = element.flavor
    cartProductSize.textContent = element.size
    cartProductPrice.textContent = `${element.price}€`
    cartProductQt.value = element.qt
    cartProductTotalPrice.textContent = `${element.price * element.qt}€`
    // productOldPrice.classList.add('d-none');
}