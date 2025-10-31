
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
    const containers = [
        document.getElementById("brands-container"),
        document.getElementById("brands-container-mobile")
    ].filter(Boolean);

    containers.forEach(container => {
        container.innerHTML = "";
        filters.brands.forEach((brand, index) => {
            const id = `brand_${brand}_${container.id}`
            const div = document.createElement("div")
            div.classList.add("form-check")

            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${brand}" id="${id}" onclick="catalogBrandFilter('${brand}')">
                <label class="form-check-label" for="${id}">
                    ${brand}
                </label>
            `;
            container.appendChild(div);
        });
    })
}

async function catalogBrandFilter(brand) {
    const allBrandCheckboxes = document.querySelectorAll(
        "#brands-container .form-check-input, #brands-container-mobile .form-check-input"
    );

    const currentlySelected = filters.selectedBrand === brand;

    allBrandCheckboxes.forEach(input => input.checked = false);

    if (currentlySelected)
        filters.selectedBrand = null;
    else {
        allBrandCheckboxes.forEach(input => {
            if (input.value === brand) input.checked = true;
        });
        filters.selectedBrand = brand;
    }
    applyFilters();
}

async function renderPowerFilters() {
    const containers = [
        document.getElementById("powers-container"),
        document.getElementById("powers-container-mobile")
    ].filter(Boolean);

    containers.forEach(container => {
        container.innerHTML = "";
        filters.powers.forEach((power, index) => {
            const id = `power_${power}`
            const div = document.createElement("div")
            div.classList.add("form-check")

            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${power}" id="${id}" onclick="catalogPowerFilter('${power}')">
                <label class="form-check-label" for="${id}">
                    ${power}
                </label>`;
            container.appendChild(div);
        });
    })
}

async function catalogPowerFilter(power) {
    const allPowerCheckboxes = document.querySelectorAll(
        "#powers-container .form-check-input, #powers-container-mobile .form-check-input"
    );

    const currentlySelected = filters.selectedPower === power;

    allPowerCheckboxes.forEach(input => input.checked = false);

    if (currentlySelected) {
        filters.selectedPower = null;
    } else {
        allPowerCheckboxes.forEach(input => {
            if (input.value === power) input.checked = true;
        });
        filters.selectedPower = power;
    }

    applyFilters();
}

async function renderSizeFilters() {
    const containers = [
        document.getElementById("sizes-container"),
        document.getElementById("sizes-container-mobile")
    ].filter(Boolean);

    containers.forEach(container => {
        container.innerHTML = "";
        filters.sizes.forEach((size, index) => {
            const id = `size_${size}`
            const div = document.createElement("div")
            div.classList.add("form-check")

            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${size}" id="${id}" onclick="catalogSizeFilter('${size}')">
                <label class="form-check-label" for="${id}">
                    ${size}
                </label>`;
            container.appendChild(div);
        });
    })
}

async function catalogSizeFilter(size) {
    const allSizeCheckboxes = document.querySelectorAll(
        "#sizes-container .form-check-input, #sizes-container-mobile .form-check-input"
    );

    const currentlySelected = filters.selectedSize === size;

    allSizeCheckboxes.forEach(input => input.checked = false);

    if (currentlySelected) {
        filters.selectedSize = null;
    } else {
        allSizeCheckboxes.forEach(input => {
            if (input.value === size) input.checked = true;
        });
        filters.selectedSize = size;
    }

    applyFilters();
}

async function applyFilters() {
    let filteredProducts = [...products]

    if (filters.selectedBrand)
        filteredProducts = filteredProducts.filter(p => p.brand === filters.selectedBrand);
    if (filters.selectedPower)
        filteredProducts = filteredProducts.filter(p => p.power === filters.selectedPower);
    if (filters.selectedSize)
        filteredProducts = filteredProducts.filter(p => p.size === filters.selectedSize);

    renderProducts(filteredProducts)
}

async function renderProducts(filteredProducts = products) {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    fetch("/templates/components/product-card.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)
            return response.text()
        })
        .then((data) => {
            const containerElement = document.getElementById("product-catalog-content")
            containerElement.innerHTML = ""
            sortedProducts.forEach((element) => {
                const newProduct = document.createElement("div")
                newProduct.classList.add("col-6", "col-md-3")
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

    if (newProducts.includes(element.name)) {
        console.log(element.name)
        productBadge.textContent = "Novidade"
        productBadge.classList.add("text-bg-info")
    }
}