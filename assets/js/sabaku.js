function isMobile() {
    return /Android|iPhone/i.test(navigator.userAgent)
}

addEventListener("load", ev => {
    var items = document.getElementsByClassName("sab-item");
    
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function(ev) {
            if (
                ev.target.tagName.toLowerCase() !== 'a'
                && ev.target.parentElement.tagName.toLowerCase() !== 'a'
            ) {
                // if (isMobile()) {
                //     /** @type {Element} */
                //     let parent = ev.target.closest(".sab-item");
                //     console.log(parent.children[1])
                // } else {
                    this.classList.toggle("sab-hidden");
                // }
            }
        });
    }
})