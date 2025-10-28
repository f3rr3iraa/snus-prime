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
    filters.maxPrice = Math.max(...products.map(p => p.price))
    filters.maxNicotine = Math.max(...products.map(p => p.nicotine_mg))
    console.log(filters)
}