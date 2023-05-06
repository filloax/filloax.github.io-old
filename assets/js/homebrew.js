const windowMediaQuery = window.matchMedia("(max-width: 800px)")

function onChange() {
    const container = document.querySelector(".card-container");
    console.log("Media query changed:", windowMediaQuery.matches);
    if (!windowMediaQuery.matches && !isShowingOne()) {
        let maxHeight;

        document.querySelectorAll(".card").forEach(el => {
            if (!maxHeight || el.clientHeight > maxHeight) {
                maxHeight = el.clientHeight;
            }
        });

        container.style.height = `${container.clientHeight / 2 + maxHeight}px`;
    } else {
        container.style.height = "";
    }
}

windowMediaQuery.addEventListener("change", onChange);
addEventListener("load", onChange);

addEventListener("load", function(ev) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let showall = this.document.getElementById("showall");
    showall.checked = urlParams.has("showall")
    showall.addEventListener("change", ev => {
        updateShown()
    });

    this.document.querySelectorAll(".index table a").forEach(el => el.addEventListener("click", ev => {
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
    return !document.getElementById("showall").checked
}

function updateShown() {
    if (isShowingOne()) {
        document.querySelector("#homebrew-container").classList.add("showone")

        let currentlyShowing = getCurrentCard();
        if (currentlyShowing === "" || !currentlyShowing) {
            setCurrentCard(document.querySelector(".card").querySelector("h3").id);
            currentlyShowing = getCurrentCard();
        }

        document.querySelectorAll(".card").forEach(el => {
            el.classList.add("hidden")
        });
        const current = document.querySelector(`#${currentlyShowing}`).closest(".card");
        if (current) {
            current.classList.remove("hidden")
        }
    } else {
        document.querySelector("#homebrew-container").classList.remove("showone")

        document.querySelectorAll(".card").forEach(el => {
            el.classList.remove("hidden")
        });
    }    
    onChange()
}

function getCurrentCard() {
    return window.location.hash.substring(1);
}

function setCurrentCard(id) {
    window.location.hash = id;
}