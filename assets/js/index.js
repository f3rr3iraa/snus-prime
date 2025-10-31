let products = []
let newProducts = []
let filters = new Filters()

async function loadProducts() {
    const response = await fetch('/data/products.csv');
    const data = await response.text();
    const rows = data.trim().split('\n');
    const headers = rows.shift().split(',').map(h => h.trim());

    const headerMap = {
        Marca: "brand",
        Nome: "name",
        Foto: "photoPath",
        Preco: "price",
        Forca: "power",
        Sabor: "flavor",
        Tipo: "type",
        Tamanho: "size",
        Nicotina_MG: "nicotine_mg",
        Promo: "promotion",
    };

    products = rows.map(row => {
        const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const product = new Product();

        headers.forEach((header, i) => {
            const prop = headerMap[header];
            if (prop && prop in product) {
                product[prop] = values[i];
            }
        });

        return product;
    });
}

async function init() {
    await loadProducts();
    newProducts = products.slice(-4).map(p => p.name);
}

init();

