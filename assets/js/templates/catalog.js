
function initRanges() {
    const ranges = [
        { id: 'range-price-desktop', unit: '€', max: filters.maxPrice, step: 0.01 },
        { id: 'range-price-mobile', unit: '€', max: filters.maxPrice, step: 0.01 },
        { id: 'range-nicotine-desktop', unit: 'Mg', max: filters.maxNicotine, step: 0.1 },
        { id: 'range-nicotine-mobile', unit: 'Mg', max: filters.maxNicotine, step: 0.1 }
    ]

    ranges.forEach(({ id, unit, max, step }) => {
        const range = document.getElementById(id)
        const valueOutput = document.getElementById(`${id}-value`)
        if (!range || !valueOutput) return;

        range.min = 0;
        range.step = step ?? 1;
        range.max = max;
        range.value = max;

        valueOutput.textContent = Number(range.value).toFixed(getDecimals(step)) + unit;

        range.addEventListener('input', () => {
            valueOutput.textContent = Number(range.value).toFixed(getDecimals(step)) + unit;

            if (id.includes('price')) filters.selectedMaxPrice = Number(range.value);
            if (id.includes('nicotine')) filters.selectMaxNicotine = Number(range.value);

            applyFilters();
        })
    })
}

function getDecimals(step) {
    const stepStr = step.toString();
    return stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
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
    console.log(products)
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
    if (filters.selectedMaxPrice != null)
        filteredProducts = filteredProducts.filter(p => p.price <= filters.selectedMaxPrice);
    if (filters.selectMaxNicotine != null)
        filteredProducts = filteredProducts.filter(p => p.nicotine_mg <= filters.selectMaxNicotine);


    renderProducts(filteredProducts)
}


let currentSort = null; 

function sortProducts(productsArray) {
    let sorted = [...productsArray];
    if (currentSort === "asc") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (currentSort === "desc") {
        sorted.sort((a, b) => b.price - a.price);
    } else {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
}

function initSortButtons() {
    const buttons = [
        { asc: "sort-asc", desc: "sort-desc" },
        { asc: "sort-asc-mobile", desc: "sort-desc-mobile" }
    ];

    buttons.forEach(btnGroup => {
        const sortAscBtn = document.getElementById(btnGroup.asc);
        const sortDescBtn = document.getElementById(btnGroup.desc);

        if (!sortAscBtn || !sortDescBtn) return;

        sortAscBtn.addEventListener("click", () => {
            if (currentSort === "asc") {
                currentSort = null; 
                removeActiveFromAllButtons();
            } else {
                currentSort = "asc";
                setActiveButton("asc");
            }
            applyFilters();
        });

        sortDescBtn.addEventListener("click", () => {
            if (currentSort === "desc") {
                currentSort = null;
                removeActiveFromAllButtons();
            } else {
                currentSort = "desc";
                setActiveButton("desc");
            }
            applyFilters();
        });
    });
}

function removeActiveFromAllButtons() {
    document.querySelectorAll(".sort-btn").forEach(btn => btn.classList.remove("active"));
}

function setActiveButton(type) {
    removeActiveFromAllButtons();
    if (type === "asc") {
        document.querySelectorAll("#sort-asc, #sort-asc-mobile").forEach(btn => btn.classList.add("active"));
    } else if (type === "desc") {
        document.querySelectorAll("#sort-desc, #sort-desc-mobile").forEach(btn => btn.classList.add("active"));
    }
}


async function renderProducts(filteredProducts = products) {
    const sortedProducts = sortProducts(filteredProducts);

    fetch("/templates/components/product-card.html")
        .then((response) => {
            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText);
            return response.text();
        })
        .then((data) => {
            const containerElement = document.getElementById("product-catalog-content");
            containerElement.innerHTML = "";
            sortedProducts.forEach((element) => {
                const newProduct = document.createElement("div");
                newProduct.classList.add("col-6", "col-md-3");
                newProduct.innerHTML = data;
                insertProductInfo(newProduct, element);
                containerElement.appendChild(newProduct);
                setTimeout(() => newProduct.classList.add("show"), 50);
            });
        });
}



// Função insertProductInfo permanece igual
async function insertProductInfo(newProduct, element) {
    const productImage = newProduct.querySelector("#product-image");
    const productBadge = newProduct.querySelector("#product-badge");
    const productBrand = newProduct.querySelector("#product-brand");
    const productName = newProduct.querySelector("#product-name-nicotine");
    const productPrice = newProduct.querySelector("#product-price");
    const productOldPrice = newProduct.querySelector("#product-old-promo-price");
    const productAddBtn = newProduct.querySelector("#product-add");
    const productDetailsBtn = newProduct.querySelector("#product-details");

    const basePath = `/data/img/${element.photoPath}`;
    const extensions = [".webp", ".jpg", ".jpeg", ".png"];
    let index = 0;

    function tryNext() {
        if (index < extensions.length) {
            productImage.src = `${basePath}${extensions[index++]}`;
        } else {
            productImage.src = "/assets/images/snus-prime-fallback.jpg";
        }
    }

    productImage.onerror = tryNext;
    tryNext();

    productBrand.textContent = element.brand;
    productName.textContent = `${element.name} | ${element.nicotine_mg} Mg`;
    productPrice.textContent = `${element.price}€`;

    if (newProducts.includes(element.photoPath)) {
        productBadge.textContent = "Novidade";
        productBadge.classList.add("novidade-inf");
    }

    if (element.promotion != 0) {
        productBadge.textContent = "Promoção";
        productBadge.classList.add("promotion-inf");
        productOldPrice.textContent = `${element.oldPrice}€`;
    }

    productAddBtn.setAttribute("data-id", element.name);
    productDetailsBtn.setAttribute("data-id", element.photoPath);
}

