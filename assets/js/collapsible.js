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

window.onload = function() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = nextInDOM(".collapsible-content", $(this))
        if (content.css("display") == "block") {
            content.css("display", "none");
        } else {
            content.css("display", "block");
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

    // Apertura da altra pagina
    var hash = window.location.hash.substr(1);
    const targ = document.getElementById(hash);
    if (targ && targ.click)
        targ.click();
}