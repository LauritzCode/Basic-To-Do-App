import "./styles/home.css"
import chefImg from "../assets/home-module/portrait-owner.webp"
import { clearContent } from "./website"
import { homeBtn } from "./website";


export const loadHome = () => {

    if (document.querySelector(".home-content")) {
        return 
    }

    clearContent();
    homeBtn.classList.add("active")
    const content = document.querySelector("#content")

    const div = document.createElement("div")
    div.classList.add("home-content")
    div.innerHTML = `
    <p>Best pizza in town<br>Made with passion since 1908.</p>
    <img class="chef-img" src="${chefImg}">
    <p>Order online or visit us!</p>
    `
    content.appendChild(div)
}

 