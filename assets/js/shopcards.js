var currentlyShowing = null

addEventListener("load", function() {
    const shopCards = this.document.getElementsByClassName("shop-card");
    
    for (let i = 0; i < shopCards.length; i++) {
        const el = shopCards[i];
        const corresponding = this.document.getElementById(`details-${el.id}`);

        el.addEventListener("click", function(ev) {
            showDetails(corresponding)
            ev.stopPropagation()
        });
    }

    this.document.body.addEventListener("click", function(ev) {
        if (ev.target.closest(".item-details")) return;

        if (currentlyShowing) {
            hideDetails(currentlyShowing)
            currentlyShowing = null
        }
    })
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