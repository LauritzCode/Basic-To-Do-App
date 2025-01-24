import { clearContent } from "./website"
import "./styles/menu.css"
import { menuBtn } from "./website"

export const loadMenu = () => {
    if (document.querySelector(".menu-content")) {
        return 
    }

    clearContent()
    menuBtn.classList.add("active")
    console.log("menu loaded")
    const content = document.querySelector("#content");
    const div = document.createElement("div");
    div.classList.add("menu-content");
    div.innerHTML = `<div class="menu-wrap">${generateMenu(menu)}</div>`

    content.appendChild(div);
}

function importAll(r) {
    const images = {};
    r.keys().forEach((key) => {
        images[key.replace('./', '')] = r(key);
    });
    return images;
}

// Dynamically import all images from the folder
const images = importAll(require.context('../assets/menu-module/menu-pictures', false, /\.(webp|png|jpe?g|svg)$/));



const menu = [
    {
        name: "Salat Pizza",
        contents: "Tomato sauce, Mozarella, Tomato, Cucumber, Lettuce, Basil, Chicken",
        picture: images["saladpizza.webp"]
    },
    {
        name: "Carne",
        contents: "Tomato sauce, Mozarella, Homemade sausage, Bacon, Garlic, Pepper, Chilli",
        picture: images["carne.webp"]
        
    },
    {
        name: "Salsiccia",
        contents: "Tomato sauce, Mozarella, Tomato, Homemade sausage, Garlic, Basil",
        picture: images["Salsiccia.webp"]
    },
    {
        name: "Gamberi",
        contents: "Tomato sauce, Mozarella, Shrimps, Feta cheese, Olives, Basil",
        picture: images["Gamberi.webp"]
    },
    {
        name: "Disgustoso",
        contents: "Tomato sauce, Bacon, Pineapple, Olives, Basil",
        picture: images["disgustio.webp"]
    },
    {
        name: "Crema",
        contents: "White sauce, Mozarella, Shrimps, Salmon, Pineapple, Olives, Basil",
        picture: images["crema.webp"]
    },

]


export const generateMenu = (menu) => {
    return menu.map(item => {
    return  `<div class="foodItem"><span class="foodName">${item.name}</span><br>
     ${item.picture ?
        `<img class="foodItemPic" src="${item.picture}" alt="${item.name} picture"><br>` : "" }
        <br><p>${item.contents}<p></div>`
}).join("");
}

