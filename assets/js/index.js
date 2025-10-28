let items = [];

async function loadProducts() {
    const response = await fetch('/data/products.csv');
    const data = await response.text();
    const rows = data.trim().split('\n');
    const headers = rows.shift().split(',').map(h => h.trim());
    
    items = rows.map(row => {
        const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
        }, {});
    });
}

loadProducts();
