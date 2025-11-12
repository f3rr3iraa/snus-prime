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
    const detailsQt1 = NewDetailsProduct.querySelector("#qt-1")
    const detailsQt5 = NewDetailsProduct.querySelector("#qt-5")

    const breadcrumbActive = document.querySelector(".breadcrumb-item.active");

    const basePath = `/data/img/${product.photoPath}`;
    const extensions = [".webp", ".jpg", ".jpeg", ".png"];
    let index = 0;

    function tryNext() {
        if (index < extensions.length) {
            detailsProductImage.src = `${basePath}${extensions[index++]}`;
        } else {
            detailsProductImage.src = "/assets/images/snus-prime-fallback.jpg";
        }
    }

    detailsProductImage.onerror = tryNext;
    tryNext();

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

    detailsQt1.textContent = `x1 Snus | ${Number(product.price).toFixed(2)}€`
    detailsQt5.textContent = `x5 Snus | ${Number(product.price * 5).toFixed(2)}€`
}

function activateQtBtn(element) {
	element.classList.remove("qt-btn-inactive");
	element.classList.add("qt-btn-active");
}

function disableQtBtn(element) {
	element.classList.remove("qt-btn-active");
	element.classList.add("qt-btn-inactive");
}

function changeQtWanted(flag) {
    const quantityElements = [
        document.getElementById("qt-1"),
        document.getElementById("qt-5"),
        document.getElementById("qt-other")
    ]
    const qtOtherValue = document.getElementById("qt-other-value")
    const qtOtherValuePrice = document.getElementById("qt-other-value-price")
    switch (flag) {
        case 1:
            quantityElements.forEach((element) => {
                element.id == "qt-1"
                    ? activateQtBtn(element)
                    : disableQtBtn(element)
            })
            qtOtherValue.classList.add("d-none")
            qtOtherValuePrice.classList.add("d-none")
            break;
        case 2:
            quantityElements.forEach((element) => {
                element.id == "qt-5"
                    ? activateQtBtn(element)
                    : disableQtBtn(element)
            })
            qtOtherValue.classList.add("d-none")
            qtOtherValuePrice.classList.add("d-none")
            break;
        case 3:
            quantityElements.forEach((element) => {
                element.id == "qt-other"
                    ? activateQtBtn(element)
                    : disableQtBtn(element)
            })
            qtOtherValue.classList.remove("d-none")
            qtOtherValuePrice.classList.remove("d-none")
            break;
    }
}