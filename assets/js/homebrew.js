const windowMediaQuery = window.matchMedia("(max-width: 800px)")

function onChange(ev) {
    const container = document.querySelector(".card-container");
    console.log("Media query changed:", windowMediaQuery.matches);
    if (!windowMediaQuery.matches) {
        container.style.height = `${container.clientHeight / 2 + 100}px`;
    } else {
        container.style.height = "";
    }
}

windowMediaQuery.addEventListener("change", onChange);
addEventListener("load", onChange);

addEventListener("load", function(ev) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let showone = this.document.getElementById("showone");
    showone.checked = urlParams.has("showone")
    showone.addEventListener("change", ev => {
        updateShown()
    });

    this.document.querySelectorAll("table.index a").forEach(el => el.addEventListener("click", ev => {
        if (isShowingOne()) {
            ev.preventDefault();
            let currentlyShowing = el.href.split("#").slice(-1)[0];
            setCurrentCard(currentlyShowing);
            updateShown();
        }
    }));

    updateShown();
});

function isShowingOne() {
    return document.getElementById("showone").checked
}

function updateShown() {
    if (isShowingOne()) {
        let currentlyShowing = getCurrentCard();
        if (currentlyShowing === "" || !currentlyShowing) {
            setCurrentCard(document.querySelector(".card").querySelector("h3").id);
            currentlyShowing = getCurrentCard();
        }

        document.querySelectorAll(".card").forEach(el => {
            el.style.display = "none";
        });
        const current = document.querySelector(`#${currentlyShowing}`).closest(".card");
        if (current) {
            current.style.display = "initial";
        }
    } else {
        document.querySelectorAll(".card").forEach(el => {
            el.style.display = "initial";
        });
    }
}

function getCurrentCard() {
    return window.location.hash.substring(1);
}

function setCurrentCard(id) {
    window.location.hash = id;
}