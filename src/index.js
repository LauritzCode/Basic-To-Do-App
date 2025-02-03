import "./global.css"
import "./styles/features.css"
import { loadFeatures } from "./modules/features"
import { loadAbout } from "./modules/about"
import { loadTicked } from "./modules/ticked"
import "./styles/about.css"
import "./styles/ticked.css" 

const featuresBtn = document.querySelector("#featuresBtn")
const aboutBtn = document.querySelector("#aboutBtn")
const tickedBtn = document.querySelector("#tickedBtn")

featuresBtn.addEventListener("click", loadFeatures)
aboutBtn.addEventListener("click", loadAbout)
tickedBtn.addEventListener("click", loadTicked)



window.onload = loadFeatures()