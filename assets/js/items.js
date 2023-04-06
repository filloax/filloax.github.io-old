const windowMediaQuery = window.matchMedia("(max-width: 800px)")

var currentlyShowing = "";

function onChange(ev) {
    const container = document.querySelector(".itemcard-container");
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
    this.document.getElementById("showone").addEventListener("change", ev => {
        updateShown()
    });

    this.document.querySelectorAll("table.index a").forEach(el => el.addEventListener("click", ev => {
        currentlyShowing = el.href.split("#").slice(-1)[0]
        updateShown()

        if (isShowingOne()) {
            ev.preventDefault();
        }
    }));
});

function isShowingOne() {
    return document.getElementById("showone").checked
}

function updateShown() {
    if (isShowingOne()) {
        document.querySelectorAll(".itemcard").forEach(el => {
            el.style.display = "none";
        });
        if (currentlyShowing !== "") {
            const current = document.querySelector(`#${currentlyShowing}`).closest(".itemcard");
            if (current) {
                current.style.display = "initial";
            }
        }
    } else {
        document.querySelectorAll(".itemcard").forEach(el => {
            el.style.display = "initial";
        });
    }
}