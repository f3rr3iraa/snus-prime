async function renderProductsCarousel() {
    const carouselProducts = products.filter(p =>
        newProducts.includes(p.name)
    );

    fetch("/templates/components/carousel-slide.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)
            return response.text()
        })
        .then((data) => {
            let i = 0;
            const containerElement = document.getElementById("carousel-content")
            containerElement.innerHTML = ""
            carouselProducts.forEach((element) => {
                const NewCarouselProduct = document.createElement("div")
                NewCarouselProduct.innerHTML = data
                insertCarouselProductInfo(NewCarouselProduct, element, i)
                containerElement.appendChild(NewCarouselProduct)
                i++;
            })
        })
}


async function insertCarouselProductInfo(NewCarouselProduct, element, i) {
    const carouselItem= NewCarouselProduct.querySelector("#carousel-item")
    const carouselProductImage= NewCarouselProduct.querySelector("#product-image")
    const carouselProductName = NewCarouselProduct.querySelector("#product-title")
    const carouselProductDescription= NewCarouselProduct.querySelector("#product-description")

    carouselProductImage.src = `/data/img/${element.photoPath}.jpg`
    carouselProductName.textContent = element.name
    carouselProductDescription.textContent = element.description

    if (i == 0)
        carouselItem.classList.add("active");
}