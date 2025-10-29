function initRanges() {
    // Range está mal quando se desce e volta a aumentar
    const rangePrice = document.getElementById('range-price');
    const rangePriceValue = document.getElementById('range-price-value');
    const rangeNicotine = document.getElementById('range-nicotine');
    const rangeNicotineValue = document.getElementById('range-nicotine-value');

    rangePriceValue.textContent = `${filters.maxPrice}€`;
    rangeNicotineValue.textContent = `${filters.maxNicotine} Mg`;

    rangePrice.max = filters.maxPrice;
    rangeNicotine.max = filters.maxNicotine;
    rangePrice.value = filters.maxPrice;
    rangeNicotine.value = filters.maxNicotine;

    rangePrice.addEventListener('input', function () {
        rangePriceValue.textContent = `${this.value}€`;
    });
    rangeNicotine.addEventListener('input', function () {
        rangeNicotineValue.textContent = `${this.value} Mg`;
    });
}

async function getFilterLimits() {
    //campo vazio dá infinity nos preços e nicotina
    filters.maxPrice = Math.max(...products.map(p => p.price))
    filters.brands = [...new Set(products.map(p => p.brand))];
    filters.powers = [...new Set(products.map(p => p.power))];
    filters.maxNicotine = Math.max(...products.map(p => p.nicotine_mg))
    filters.flavors = [...new Set(products.map(p => p.flavor))];
    filters.sizes = [...new Set(products.map(p => p.size))];
    console.log(filters)
}

async function renderBrandFilters() {
    const container = document.getElementById("brands-container")
    container.innerHTML = "";

    filters.brands.forEach((brand, index) => {
        const id = `brand_${index}`
        const div = document.createElement("div")

        div.classList.add("form-check")

        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${brand}" id="${id}">
            <label class="form-check-label" for="${id}">
                ${brand}
            </label>
        `;

        container.appendChild(div);
    });
}

async function renderPowerFilters() {
    const container = document.getElementById("powers-container")
    container.innerHTML = "";

    filters.powers.forEach((power, index) => {
        const id = `power_${index}`
        const div = document.createElement("div")

        div.classList.add("form-check")

        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${power}" id="${id}">
            <label class="form-check-label" for="${id}">
                ${power}
            </label>
        `;

        container.appendChild(div);
    });
}

async function renderSizeFilters() {
    const container = document.getElementById("sizes-container")
    container.innerHTML = "";

    filters.sizes.forEach((size, index) => {
        const id = `size_${index}`
        const div = document.createElement("div")

        div.classList.add("form-check")

        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${size}" id="${id}">
            <label class="form-check-label" for="${id}">
                ${size}
            </label>
        `;

        container.appendChild(div);
    });
}

async function renderProducts() {
    fetch("/templates/components/product-card.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)
            return response.text()
        })
        .then((data) => {
            const containerElement = document.getElementById("product-catalog-content")
            containerElement.innerHTML = ""
            products.forEach((element) => {
                const newProduct = document.createElement("div")
                newProduct.classList.add("col-3")
                newProduct.innerHTML = data
                insertProductInfo(newProduct, element)
                containerElement.appendChild(newProduct)
            })
        })
}

async function insertProductInfo(newProduct, element) {
    const productBadge = newProduct.querySelector("#product-badge")
    const productImage = newProduct.querySelector("#product-image")
    const productBrand = newProduct.querySelector("#product-brand")
    const productName = newProduct.querySelector("#product-name-nicotine")
    const productPrice = newProduct.querySelector("#product-price")
    const productOldPrice = newProduct.querySelector("#product-old-promo-price")

    productImage.src = `/data/img/${element.photoPath}.jpg`
    productBrand.textContent = element.brand
    productName.textContent = `${element.name} | ${element.nicotine_mg} Mg`
    productPrice.textContent = `${element.price}€`
    productOldPrice.classList.add('d-none');
}