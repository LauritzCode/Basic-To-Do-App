

// for the event listeners 



export const homeBtn = document.querySelector("#homeBtn")
export const menuBtn = document.querySelector("#menuBtn")
export const aboutBtn = document.querySelector("#aboutBtn")

export const clearContent = () => { 
    document.querySelector("#content").innerHTML = "" 
    homeBtn.classList.remove("active")
    menuBtn.classList.remove("active")
    aboutBtn.classList.remove("active")
}

