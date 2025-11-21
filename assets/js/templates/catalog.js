
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
    const ascSelector = '#sort-asc, #sort-asc-mobile';
    const descSelector = '#sort-desc, #sort-desc-mobile';

    // Helpers
    function removeActiveFromAllButtonsLocal() {
        document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    }

    function setActiveButtonLocal(type) {
        removeActiveFromAllButtonsLocal();
        if (type === 'asc') {
            document.querySelectorAll('#sort-asc, #sort-asc-mobile').forEach(btn => btn.classList.add('active'));
        } else if (type === 'desc') {
            document.querySelectorAll('#sort-desc, #sort-desc-mobile').forEach(btn => btn.classList.add('active'));
        }
    }

    // Se não houver botões no DOM (por ex. rota errada), sair sem erro
    const ascButtons = Array.from(document.querySelectorAll(ascSelector));
    const descButtons = Array.from(document.querySelectorAll(descSelector));
    if (ascButtons.length === 0 && descButtons.length === 0) {
        console.debug('[initSortButtons] nenhum botão de sort encontrado — nenhum listener ligado');
        return;
    }

    // Restaura estado
    const savedSort = localStorage.getItem('currentSort');
    if (savedSort === 'asc' || savedSort === 'desc') {
        currentSort = savedSort;
    } else {
        currentSort = null;
    }

    // Remove listeners previamente ligados (idempotência)
    function cloneAndReplace(el) {
        const clone = el.cloneNode(true);
        el.parentNode.replaceChild(clone, el);
        return clone;
    }

    // Liga listeners ASC
    ascButtons.forEach(btn => {
        const b = cloneAndReplace(btn);
        if (!b.classList.contains('sort-btn')) b.classList.add('sort-btn');
        b.addEventListener('click', () => {
            if (currentSort === 'asc') {
                currentSort = null;
                localStorage.removeItem('currentSort');
                removeActiveFromAllButtonsLocal();
            } else {
                currentSort = 'asc';
                localStorage.setItem('currentSort', 'asc');
                setActiveButtonLocal('asc');
            }
            console.debug('[sort] currentSort ->', currentSort);
            applyFilters();
        });
    });

    // Liga listeners DESC
    descButtons.forEach(btn => {
        const b = cloneAndReplace(btn);
        if (!b.classList.contains('sort-btn')) b.classList.add('sort-btn');
        b.addEventListener('click', () => {
            if (currentSort === 'desc') {
                currentSort = null;
                localStorage.removeItem('currentSort');
                removeActiveFromAllButtonsLocal();
            } else {
                currentSort = 'desc';
                localStorage.setItem('currentSort', 'desc');
                setActiveButtonLocal('desc');
            }
            console.debug('[sort] currentSort ->', currentSort);
            applyFilters();
        });
    });

    // Aplica estado guardado visualmente e executa ordenação no load da rota
    if (currentSort) {
        setActiveButtonLocal(currentSort);
        console.debug('[sort] restored from localStorage ->', currentSort);
        applyFilters();
    } else {
        removeActiveFromAllButtonsLocal();
    }
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
    const loader = document.getElementById("product-loader");
    const containerElement = document.getElementById("product-catalog-content");

    loader.style.display = "block";
    containerElement.style.opacity = "0";

    const sortedProducts = sortProducts(filteredProducts);

    const MIN_LOAD_TIME = 600;
    const startTime = performance.now();

    const tempContainer = document.createElement("div");

    try {
        const response = await fetch("/templates/components/product-card.html");
        if (!response.ok) throw new Error("Network response was not ok " + response.statusText);

        const templateHTML = await response.text();

        sortedProducts.forEach((element) => {
            const newProduct = document.createElement("div");
            newProduct.classList.add("col-6", "col-md-3");
            newProduct.innerHTML = templateHTML;

            insertProductInfo(newProduct, element);

            tempContainer.appendChild(newProduct);
        });

    } finally {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

        setTimeout(() => {
            containerElement.innerHTML = tempContainer.innerHTML;

            containerElement.style.transition = "opacity .3s";
            containerElement.style.opacity = "1";

            loader.style.display = "none";

            containerElement.querySelectorAll(".col-6, .col-md-3").forEach(el => {
                setTimeout(() => el.classList.add("show"), 50);
            });

        }, remaining);
    }
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

