import { byLetter } from "./utils.js";

document.addEventListener("DOMContentLoaded", ev => {
    setupShakyText()
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