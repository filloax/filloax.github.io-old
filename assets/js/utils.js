const span = (text, index) => {
    const node = document.createElement("span");

    node.textContent = text;
    node.style.setProperty("--index", index);

    return node;
};

export const byLetter = (text) => [...text].map(span);

export const byWord = (text) => text.split(" ").map(span);

export const findByFamily = (fontFamily) =>
    Array.from(document.querySelectorAll("*")).filter((element) => {
        const computedStyle = getComputedStyle(element);
        return computedStyle.fontFamily.includes(fontFamily);
    });