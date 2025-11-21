async function renderProductsCarousel() {
    const carouselProducts = products
    .filter(p => greatestProducts.includes(p.photoPath))
    .slice(-4); 


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
    const carouselAddBtn = NewCarouselProduct.querySelector("#product-add")
    const carouselDetailsBtn = NewCarouselProduct.querySelector("#product-details")

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

    carouselProductName.textContent = element.name
    carouselProductDescription.textContent = element.description

    if (i == 0)
        carouselItem.classList.add("active");

    carouselAddBtn.setAttribute("data-id", element.photoPath);
    carouselDetailsBtn.setAttribute("data-id", element.photoPath);
}