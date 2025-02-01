 // import "./styles/features.css"
// import logoImg from "../assets/logo-img.png"

import { clearContent } from "./helpers"
import contentLogo from "../../assets/icons/logo-img.png"
import { loadTicked } from "./app/ticked"



export const loadFeatures = () => {

    console.log("function loaded so far #1")

    if (document.querySelector(".features-content")) {
        return 
    }

    clearContent();

    console.log("function loaded so far. #2")

    const content = document.querySelector(".content")
    const div = document.createElement("div");

    div.classList.add("features-content")

    console.log("function loaded so far. #3")

    div.innerHTML = `
    <div class="features-content">
    <img class="logo-h1" src="${contentLogo}" alt="Logo">
    <h1>Ticked</h1>
    <p><i>Ticked</i> is the award-winning personal task manager that helps you plan your day, manage your projects, and make real progress toward your goals.</p>
    <button id="startTicked" class="startBtn">Kickstart your productivity now</button>
    </div>
</div>
    `
    content.appendChild(div)

    const startBtn = document.querySelector("#startTicked")

    startBtn.addEventListener("click", loadTicked)
    
}