const routes = {
  404: {
    template: "/templates/404.html",
    title: "404",
    description: "Page not Found",
  },
  "/": {
    template: "/templates/home.html",
    title: "home",
    description: "Home Page",
  },
  "/produtos": {
    template: "/templates/catalog.html",
    title: "products",
    description: "Products Page",
  },
  "/sobre": {
    template: "/templates/aboutUs.html",
    title: "aboutUs",
    description: "About Us Page",
  },
  "/contactos": {
    template: "/templates/contacts.html",
    title: "contacts",
    description: "Contacts Page",
  },
  "/carrinho": {
    template: "/templates/cart.html",
    title: "cart",
    description: "Cart Page",
  },
  "/detalhes": {
    template: "/templates/details.html",
    title: "details",
    description: "Details Page",
  },
  "/politica-privacidade": {
    template: "/templates/privacy-policy.html",
    title: "privacy-policy",
    description: "Privacy Policy Page",
  },
  "/parceiros": {
    template: "/templates/parceiros.html",
    title: "parceiros",
    description: "Parceiros",
  },
};

const route = (event) => {
  event = event || window.event;
  event.preventDefault();

  const targeUrl = new URL(event.target.href, window.location.origin);

  if (targeUrl.origin === window.location.origin) {
    window.history.pushState({}, "", targeUrl.pathname);
  } else window.open(targeUrl.href, "_blank");
};

const locationHandler = async () => {
  let location = window.location.pathname;
  if (location.length === 0) location = "/";

  if (location.startsWith("/detalhes/")) {
    await loadProducts();
    const productSlug = decodeURIComponent(location.split("/")[2]);
    const product = products.find((p) => slugify(p.photoPath) === productSlug);

    if (!product) {
      window.history.pushState({}, "", "/");
      return locationHandler();
    }

    const html = await fetch(routes["/detalhes"].template).then((res) =>
      res.text()
    );
    document.getElementById("content").innerHTML = html;

    await renderDetailsProducts(product);

    await changeActive("/detalhes");
    setTimeout(() => window.scrollTo({ top: 0 }), 0);
    return;
  }

  let route = routes[location] || routes["404"];
  if (route.title === "404") {
    window.history.pushState({}, "", "/");
    location = "/";
    route = routes[location];
  }

  const html = await fetch(route.template).then((response) => response.text());
  document.getElementById("content").innerHTML = html;

  // === Configuração do link do email nas rotas desejadas ===
  const emailLink = document.getElementById("email-link");
  if (
    emailLink &&
    (location === "/" ||
      location === "/parceiros" ||
      location === "/politica-privacidade")
  ) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      emailLink.href = "mailto:snusprimestore@gmail.com";
    } else {
      emailLink.href =
        "https://mail.google.com/mail/?view=cm&fs=1&to=snusprimestore@gmail.com";
      emailLink.target = "_blank";
    }
  }
  // ==========================================================

  await changeActive(location);
  setTimeout(() => window.scrollTo({ top: 0 }), 0);
};

async function changeActive(location) {
  console.log("location => ", location);
  document.getElementById("form-contacto").classList.remove("d-none");
  switch (location) {
    case "/produtos":
      await getFilterLimits();
      await initRanges();
      renderBrandFilters();
      renderPowerFilters();
      renderSizeFilters();
      await renderProducts();
      initSortButtons();
      break;
    case "/contactos":
      document.getElementById("form-contacto").classList.add("d-none");
      break;
    case "/":
      await renderProductsCarousel();
      break;
    case "/carrinho":
      await renderCart();
      initCheckoutValidation();
      document.getElementById("checkMao").addEventListener("click", () => {
        const checkMao = document.getElementById("checkMao");
        const totalElement = document.getElementById("cart-total");
        const subtotalElement = document.getElementById("cart-subtotal");
        const subtotaltitleElement = document.getElementById(
          "cart-subtotal-title"
        );
        const taxesElement = document.getElementById("cart-taxes");
        const taxestitleElement = document.getElementById("cart-taxes-title");

        // Calculate current subtotal
        const subtotal = cart.reduce(
          (sum, item) => sum + item.price * item.qt,
          0
        );

        if (checkMao.checked) {
          // "Em mão" selected → hide taxes, total = subtotal
          taxesElement.classList.add("d-none");
          taxestitleElement.classList.add("d-none");
          subtotalElement.classList.add("d-none");
          subtotaltitleElement.classList.add("d-none");

          totalElement.textContent = `${subtotal.toFixed(2)}€`;
        } else {
          // Not "Em mão" → show taxes if subtotal < 50
          if (subtotal >= 50) {
            taxesElement.classList.add("d-none");
            taxestitleElement.classList.add("d-none");
            subtotalElement.classList.add("d-none");
            subtotaltitleElement.classList.add("d-none");

            totalElement.textContent = `${subtotal.toFixed(2)}€`;
          } else {
            const totalWithTax = subtotal + 4;

            taxesElement.classList.remove("d-none");
            taxestitleElement.classList.remove("d-none");
            subtotalElement.classList.remove("d-none");
            subtotaltitleElement.classList.remove("d-none");

            taxesElement.textContent = `4.00€`;
            subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
            totalElement.textContent = `${totalWithTax.toFixed(2)}€`;
          }
        }
      });
      break;
    case "/detalhes":
      await renderOtherProducts();
      detailsQtSelected = 1;
      break;
    default:
  }
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

function goToRoute(route) {
  window.history.pushState({}, "", route);
  locationHandler();
}

function goToProduct(productName) {
  const slug = slugify(productName);
  window.history.pushState({}, "", `/detalhes/${slug}`);
  locationHandler();
}

document.getElementById("current-year").textContent = new Date().getFullYear();

window.onpopstate = locationHandler;
window.route = route;
locationHandler();
