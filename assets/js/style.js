import { byLetter, findByFamily } from "./utils.js";

document.addEventListener("DOMContentLoaded", ev => {
    setupShakyText()
    markImageParagraphs()
    fixAccents()
});

function setupShakyText() {
    const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true 
        || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    if (isReduced) return;

    document.querySelectorAll('.incarnate-word').forEach(el => {
        const split = byLetter(el.innerText)
        split.forEach(letter => {
            if (letter.innerText.toLowerCase().trim() === 'o') {
                letter.classList.add("squash-letter")
            }
        })
        el.firstChild.replaceWith(...split)
        el.classList.add('letter-animation-quiver')
    });
}

function markImageParagraphs() {
    document.querySelectorAll('p').forEach(el => {
        if (isImageParagraph(el)) {
            el.classList.add('imgcontainer')
        }
    });
}

/** @param {HTMLElement} el */
function isImageParagraph(el) {
    return Array.from(el.childNodes).every(child =>
        child.nodeType === Node.TEXT_NODE && child.textContent.trim() === ''
        || child.nodeType === Node.ELEMENT_NODE && child.tagName === 'IMG'
    );
}

async function fixAccents() {
    const fontsToFix = [
        'BookSanity',
        'ScalySans',
        'Zatanna Misdirection',
    ];
    fontsToFix.forEach(font => findByFamily(font).forEach(el => {
        const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE )
        textNodes.forEach(text => text.textContent = replaceAccentWithApostrophe(text.textContent))
    }));
}

function replaceAccentWithApostrophe(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "'");
}