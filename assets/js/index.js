let products = []
let newProducts = []
let filters = new Filters()
let cart = []

function getRandomIndexes(array) {
  const indexes = [];
  const max = array.length - 1;

  while (indexes.length < 4) {
    const randomIndex = Math.floor(Math.random() * (max + 1));
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }

  return indexes;
}

function getRandom(array) {
  const index = [];
  const max = array.length - 1;

  while (index.length < 1) {
    const randomIndex = Math.floor(Math.random() * (max + 1));
    if (!index.includes(randomIndex)) {
      index.push(randomIndex);
    }
  }

  return index;
}

// fechar offcanvas mobile
document.addEventListener('DOMContentLoaded', () => {
  const offcanvas = document.getElementById('mobileMenu');
  const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvas);

  document.querySelectorAll('#mobileMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => offcanvasInstance.hide());
  });
});

async function loadProducts() {
  const response = await fetch('/data/products.csv');
  const csvText = await response.text();

  // Usa PapaParse
  const results = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const headerMap = {
    Marca: "brand",
    Nome: "name",
    Foto: "photoPath",
    Preco: "price",
    Forca: "power",
    Sabor: "flavor",
    Descrição: "description",
    Tamanho: "size",
    Nicotina_MG: "nicotine_mg",
    Promo: "promotion",
  };

  products = results.data.map(row => {
    const product = new Product();

    Object.entries(headerMap).forEach(([csvHeader, prop]) => {
      if (prop in product && row[csvHeader] !== undefined) {
        product[prop] = row[csvHeader].trim();
      }
    });

    product.price = parseFloat(product.price) || 0;
    product.promotion = parseFloat(product.promotion) || 0;

    if (product.promotion !== 0) {
      const discount = product.promotion / 100;
      product.oldPrice = product.price;
      product.price = +(product.price * (1 - discount)).toFixed(2);
    } else {
      product.oldPrice = product.price;
    }

    return product;
  });
}

function addToCart(photoName) {
  const product = products.find(p => photoName.includes(p.name));
  if (!product) return;

  cart = JSON.parse(localStorage.getItem('cart')) || cart;

  const existingItem = cart.find(item => item.name === product.name);

  if (existingItem) {
    existingItem.qt += 1;
  } else {
    cart.push({ ...product, qt: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}



async function init() {
  await loadProducts();
  newProducts = products.slice(-4).map(p => p.name);
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  console.log(products);
  locationHandler();
}

init();

