import { clearContent } from "../helpers"


export const loadTicked = () => {
    if (document.querySelector(".ticked-content")) {
        return 
    }

    clearContent(); 

    const content = document.querySelector(".content");
    const div = document.createElement("div");

    div.innerHTML = `
    <p>Page loaded.</p>
    `

    content.appendChild(div);
}