import "./global.css";
import { loadHome } from "./home";
import { loadAbout } from "./about";
import { loadMenu } from "./menu";
import { homeBtn } from "./website";
import { aboutBtn } from "./website";
import { menuBtn } from "./website"


homeBtn.addEventListener("click", loadHome)
aboutBtn.addEventListener("click", loadAbout)
menuBtn.addEventListener("click", loadMenu)

window.onload = loadHome()

