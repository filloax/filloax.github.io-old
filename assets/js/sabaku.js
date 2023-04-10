function isMobile() {
    return /Android|iPhone/i.test(navigator.userAgent)
}

addEventListener("load", ev => {
    var items = document.getElementsByClassName("sab-item");
    
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function(ev) {
            /** @type {Element} */
            const el = this; // IntelliSense aid

            if (
                ev.target.tagName.toLowerCase() !== 'a'
                && ev.target.parentElement.tagName.toLowerCase() !== 'a'
            ) {
                el.classList.toggle("sab-hidden");

                if (isMobile()) {
                    el.classList.toggle("sab-exp-mobile");
                    if (el.classList.contains("sab-exp-mobile")) {
                        const descCell = el.children.item(1);
                        const attuneCell = el.children.item(2);
                        const priceCell = el.children.item(3);
                        attuneCell.style.display = "none";
                        priceCell.style.display = "none";
                        descCell.colSpan = "3"

                        const nameCell = el.children.item(0)

                        const priceDiv = document.createElement("div");
                        priceDiv.innerHTML = priceCell.innerHTML
                        const moneyIcon = document.createElement("i")
                        moneyIcon.classList.add("fa-solid", "fa-coins")
                        priceDiv.appendChild(moneyIcon)

                        const attuneDiv = document.createElement("div");
                        attuneDiv.innerHTML = `S: ${attuneCell.innerText}`

                        nameCell.appendChild(priceDiv);
                        nameCell.appendChild(attuneDiv);
                    } else {
                        el.children.item(2).style.removeProperty("display");
                        el.children.item(3).style.removeProperty("display");
                        el.children.item(1).colSpan = "1"

                        const nameCell = el.children.item(0)
                        while (nameCell.children.length > 1) {
                            nameCell.removeChild(nameCell.lastChild)
                        }
                    }
                }
            }
        });
    }
})