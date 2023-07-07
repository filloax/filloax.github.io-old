function nextInDOM(_selector, _subject) {
    var next = getNext(_subject);
    while(next.length != 0) {
        var found = searchFor(_selector, next);
        if(found != null) return found;
        next = getNext(next);
    }
    return null;
}
function getNext(_subject) {
    if(_subject.next().length > 0) return _subject.next();
    return getNext(_subject.parent());
}
function searchFor(_selector, _subject) {
    if(_subject.is(_selector)) return _subject;
    else {
        var found = null;
        _subject.children().each(function() {
            found = searchFor(_selector, $(this));
            if(found != null) return false;
        });
        return found;
    }
}

addEventListener("load", function() {
    var i;
    var coll = document.getElementsByClassName("collapsible");

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            /** @type {JQuery} */
            let content = nextInDOM(".collapsible-content", $(this))
            while (content) {
                if (content.hasClass("hidden")) {
                    content.removeClass("hidden");
                    loadLazyImages(content.get(0));
                } else {
                    content.addClass("hidden");
                }
                content = content.next()
                if (!content.hasClass("collapsible-content")) {
                    break
                }
            }
        });
    }

    var expAll = document.getElementsByClassName("expand-all");

    for (let i = 0; i < expAll.length; i++) {
        const el = expAll[i]
        el.addEventListener("click", function() {
            for (let j = 0; j < coll.length; j++) {
                coll[j].click()
            }
        });
    }

    var indexlinks = document.getElementsByClassName("recap-index");
    for (let i = 0; i < indexlinks.length; i++) {
        const el = indexlinks[i]
        el.addEventListener("click", function(event) {
            const anchor = event.target.closest("a");
            if (!anchor) return;                      
            const targ = document.getElementById(anchor.getAttribute('href').replace(/^#/, ""))
            targ.click()
        });
    }

    var parentClickers = document.getElementsByClassName("click-parent");
    for (let i = 0; i < parentClickers.length; i++) {
        const el = parentClickers[i]
        el.addEventListener("click", function(event) {
            const parent = findMatchingPrevious(event.currentTarget, ".collapsible")
            if (!parent) return;
            parent.click()
        });
        console.log(el);
    }

    // Apertura da altra pagina
    var hash = window.location.hash.substring(1);
    if (hash !== "") {
        const targ = document.getElementById(hash);
        if (targ && targ.tagName === "BUTTON") {
            targ.click();
            console.log("Clicked", targ, "from", hash)
        } else if (targ && targ.nextElementSibling && targ.nextElementSibling.tagName === "BUTTON") {
            targ.nextElementSibling.click();
            console.log("Clicked", targ.nextElementSibling, "from", hash)
        }
    }

    loadLazyImages();
});

addEventListener("resize", function() {
    console.log("Resized");
    loadLazyImages();
})

// if element or its parent is hidden
function isHidden(element) {
    return $(element).is(":hidden")
}

/** @param {HTMLElement} fromNode */
function loadLazyImages(fromNode) {
    if (!fromNode) {
        fromNode = document;
    }
    /** @type {Array<HTMLElement>} */
    const lazyImages = [...fromNode.querySelectorAll(".lazy-img")];
    console.log("LazyImages:", lazyImages)
    lazyImages.forEach (e => {
        if (!isHidden(e)) {
            console.log("Loading img", e, e.dataset.src)
            e.src = e.dataset.src
            e.classList.remove("lazy-img")
        }
    });
}

/**
 * 
 * @param {HTMLElement} element 
 */
function findMatchingPrevious(element, selector) {
	// Get the next sibling element
	var sibling = element.previousElementSibling;

	// If there's no selector, return the first sibling
	if (!selector) return sibling;

	// If the sibling matches our selector, use it
	// If not, jump to the next sibling and continue the loop
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.previousElementSibling;
	}
}