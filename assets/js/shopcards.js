var currentlyShowing = null

addEventListener("load", function() {
    this.document.body.addEventListener("click", function(ev) {
        if (ev.target.closest(".item-details")) return;

        if (currentlyShowing) {
            hideDetails(currentlyShowing)
            currentlyShowing = null
        }
    })

    const shopCards = this.document.getElementsByClassName("shop-card");
    
    for (let i = 0; i < shopCards.length; i++) {
        const el = shopCards[i];
        const corresponding = this.document.getElementById(`details-${el.id}`);

        el.addEventListener("click", function(ev) {
            showDetails(corresponding)
            ev.stopPropagation()
        });
    }

    const closeButtons = this.document.querySelectorAll(".item-details .close");
    
    for (let i = 0; i < closeButtons.length; i++) {
        const el = closeButtons[i];
        const parent = el.closest(".item-details")

        el.addEventListener("click", function(ev) {
            hideDetails(parent)
            ev.stopPropagation()
        });
    }
});


/**
 * 
 * @param {HTMLElement} element 
 */
function showDetails(element) {
    if (currentlyShowing) {
        hideDetails(currentlyShowing)
    }
    element.style.display = "block"
    loadLazyImages(element)
    currentlyShowing = element
}

/**
 * 
 * @param {HTMLElement} element 
 */
function hideDetails(element) {
    element.style.display = ""
}