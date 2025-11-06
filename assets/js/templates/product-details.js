async function renderDetailsProducts(product) {
    fetch("/templates/components/product-details.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)
            return response.text()
        })
        .then((data) => {
            const containerElement = document.getElementById("product-details-content")
            containerElement.innerHTML = ""
            const NewDetailsProduct = document.createElement("div")
            NewDetailsProduct.innerHTML = data
            insertDetailsProductInfo(NewDetailsProduct, product)
            containerElement.appendChild(NewDetailsProduct)
        })
}


async function insertDetailsProductInfo(NewDetailsProduct, product) {
    const detailsProductBadge = NewDetailsProduct.querySelector("#details-product-badge")
    const detailsProductImage = NewDetailsProduct.querySelector("#details-product-image")
    const detailsProductBrand = NewDetailsProduct.querySelector("#details-product-brand")
    const detailsProductPrice = NewDetailsProduct.querySelector("#details-product-price")
    const detailsProductOldPrice = NewDetailsProduct.querySelector("#details-product-old-promo-price")
    const detailsProductFlavor = NewDetailsProduct.querySelector("#details-product-flavor")
    const detailsProductPower = NewDetailsProduct.querySelector("#details-product-power")
    const detailsProductNicotineMg = NewDetailsProduct.querySelector("#details-product-nicotine-mg")
    const detailsProductSize = NewDetailsProduct.querySelector("#details-product-size")
    const detailsProductDescription = NewDetailsProduct.querySelector("#details-product-description")

    const breadcrumbActive = document.querySelector(".breadcrumb-item.active");

    detailsProductImage.src = `/data/img/${product.photoPath}.jpg`
    detailsProductBrand.textContent = `${product.brand} ${product.name}`
    detailsProductPrice.textContent = `Preço: ${product.price}€`
    detailsProductFlavor.textContent = `Sabor: ${product.flavor}`
    detailsProductPower.textContent = `Força: ${product.power}`
    detailsProductNicotineMg.textContent = `Nicotina: ${product.nicotine_mg} Mg`
    detailsProductSize.textContent = `Tamanho: ${product.size}`
    detailsProductDescription.textContent = product.description
    if (product.promotion != 0) {
        detailsProductBadge.textContent = "Promoção"
        detailsProductBadge.classList.add("promotion-inf")
        detailsProductOldPrice.textContent = `${product.oldPrice}€`
    }

    if (breadcrumbActive) {
        breadcrumbActive.textContent = `${product.brand} ${product.name}`;
    }
}