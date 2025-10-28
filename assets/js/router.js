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
        template: "/templates/car.html",
        title: "car",
        description: "Car Page",
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
    switch (location) {
        case "/produtos":
            initRanges()
            break;
        default:
    }
}

function goToRoute(route) {
    window.history.pushState({}, "", route);
    locationHandler();
}

window.onpopstate = locationHandler;
window.route = route;
locationHandler();