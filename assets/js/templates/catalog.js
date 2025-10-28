function initRanges() {
    const rangePrice = document.getElementById('range-price');
    const rangePriceValue = document.getElementById('range-price-value');
    const rangeNicotine = document.getElementById('range-nicotine');
    const rangeNicotineValue = document.getElementById('range-nicotine-value');

    rangePriceValue.textContent = `${rangePrice.value}€`;
    rangeNicotineValue.textContent = `${rangeNicotine.value} Mg`;

    rangePrice.addEventListener('input', function () {
        rangePriceValue.textContent = `${this.value}€`;
    });
    rangeNicotine.addEventListener('input', function () {
        rangeNicotineValue.textContent = `${this.value} Mg`;
    });
}