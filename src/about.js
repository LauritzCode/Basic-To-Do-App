import "./styles/about.css"
import { clearContent } from "./website"
import mapLocation from "../assets/about-module/map-location.png"
import { aboutBtn } from "./website";

export const loadAbout = () => {
    if (document.querySelector(".about-content")) {
        return 
    }

    clearContent()
    aboutBtn.classList.add("about")
    const content = document.querySelector("#content")
    const div = document.createElement("div");
    div.classList.add("about-content");
    div.innerHTML = `
        <p>+45 55 65 55 43<br>Glentevej 5, 2600 Glostrup, Denmark</p>
        <img class="mapLocation" src="${mapLocation}">
    `
    content.appendChild(div);
}