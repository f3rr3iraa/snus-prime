const routes = {
    404: {
        template: "/templates/404.html",
        title: "404",
        description: "Page not Found"
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
}

const route = (event) => {
    event = event || window.event;
    event.preventDefault();

    const targeUrl = new URL(event.target.href, window.location.origin);

    if (targeUrl.origin === window.location.origin) {
        window.history.pushState({}, "", targeUrl.pathname);
    } else
        window.open(targeUrl.href, "_blanck");
};

const locationHandler = async () => {
    let location = window.location.pathname;
    if (location.length === 0) location = "/";

    if (location.startsWith("/detalhes/")) {
        await loadProducts();
        const productSlug = decodeURIComponent(location.split("/")[2]);
        const product = products.find(
            (p) => slugify(p.photoPath) === productSlug
        );

        if (!product) {
            window.history.pushState({}, "", "/");
            return locationHandler();
        }

        const html = await fetch(routes["/detalhes"].template).then((res) => res.text());
        document.getElementById("content").innerHTML = html;

        await renderDetailsProducts(product);

        await changeActive("/detalhes")
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
    document.getElementById('content').innerHTML = html;

    await changeActive(location);
    setTimeout(() => window.scrollTo({ top: 0 }), 0);
};

async function changeActive(location) {
    console.log("location => ", location);
    document.getElementById('form-contacto').classList.remove('d-none')
    switch (location) {
        case "/produtos":
            await getFilterLimits();
            await initRanges()
            renderBrandFilters();
            renderPowerFilters();
            renderSizeFilters();
            await renderProducts();
            initSortButtons();  
            break;
        case "/contactos":
            document.getElementById('form-contacto').classList.add('d-none')
            break;
        case "/":
            await renderProductsCarousel();
            break
        case "/carrinho":
            await renderCart();
            break
        case "/detalhes":
            await renderOtherProducts();
            break
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

document.getElementById('current-year').textContent = new Date().getFullYear();

window.onpopstate = locationHandler;
window.route = route;
locationHandler();