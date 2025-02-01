import { clearContent } from "./helpers"
import contentLogo from "../../assets/icons/logo-img.png"

export const loadAbout = () => {
    if (document.querySelector("about-content")) {
        return 
    }

    clearContent()

    const div = document.createElement("div")
    const content = document.querySelector(".content")

    div.classList.add("about-content")

    div.innerHTML = `
    <div class="about-content">
     <h2>Welcome to Ticked – Your Productivity, Simplified.</h2>
    <img class="about-logo" src="${contentLogo}" alt="Logo">
    <p>At <i>Ticked</i>, we believe that productivity should feel effortless. Whether you're managing projects, tracking habits, or just trying to stay on top of your daily life, our sleek and intuitive app helps you focus on what matters—without the clutter.
    <br><br>No distractions. No unnecessary features. Just a smart, minimalist tool designed to help you tick off your tasks with ease.</p>

    <p><i>Ticked</i> is the award-winning personal task manager that helps you plan your day, manage your projects, and make real progress toward your goals.</p>
    <img class="presentation-img" src="https://culturedcode.com/things/2024-01-20/images/meettheallnewthings2-io75.jpg">
    <div class="more-details">
    <div class="title-section"><img class="fancysection-img" src="https://culturedcode.com/things/2024-01-20/images/fancysection-icon-features-io70.png" alt="fancysection-icon"><h2>Simply Powerful<h2></div>
    <p>Ticked makes it easy. Within the hour, you'll have everything off your mind and neatly organized - from routine tasks to your biggest life goals - and you can start focusing on what matters today.</p>
    </div>
    </div>
    `
    
    content.appendChild(div)
}