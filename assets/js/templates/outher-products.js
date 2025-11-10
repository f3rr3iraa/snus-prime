async function renderOtherProducts() {
    let indexes = getRandomIndexes(products);
    const otherProducts = indexes.map(i => products[i]);

    fetch("/templates/components/other-products.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)
            return response.text()
        })
        .then((data) => {
            let i = 0;
            const containerElement = document.getElementById("other-product-content")
            containerElement.innerHTML = ""
            otherProducts.forEach((element) => {
                const NewOtherProduct = document.createElement("div")
                NewOtherProduct.innerHTML = data
                insertOtherProductInfo(NewOtherProduct, element)
                containerElement.appendChild(NewOtherProduct)
            })
        })
}


async function insertOtherProductInfo(NewOtherProduct, element, i) {
    const carouselProductBadge = NewOtherProduct.querySelector("#other-product-badge")
    const carouselProductImage= NewOtherProduct.querySelector("#other-product-image")
    const carouselProductBrand = NewOtherProduct.querySelector("#other-product-brand")
    const carouselProductName= NewOtherProduct.querySelector("#other-product-name-nicotine")
    const carouselProductPrice= NewOtherProduct.querySelector("#other-product-price")
    const carouselProductOldPrice = NewOtherProduct.querySelector("#other-product-old-promo-price")

    const basePath = `/data/img/${element.photoPath}`;
    const extensions = [".webp", ".jpg", ".jpeg", ".png"];
    let index = 0;

    function tryNext() {
        if (index < extensions.length) {
            carouselProductImage.src = `${basePath}${extensions[index++]}`;
        } else {
            carouselProductImage.src = "/assets/images/snus-prime-fallback.jpg";
        }
    }

    carouselProductImage.onerror = tryNext;
    tryNext();
    carouselProductBrand.textContent = element.brand
    carouselProductName.textContent = `${element.name} | ${element.nicotine_mg} Mg`
    carouselProductPrice.textContent = `${element.price}€`
    if (element.promotion != 0) {
        carouselProductBadge.textContent = "Promoção"
        carouselProductBadge.classList.add("promotion-inf")
        carouselProductOldPrice.textContent = `${element.oldPrice}€`
    }

  
}