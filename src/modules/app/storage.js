import { reviveProjects } from "../helpers";
const STORAGE_KEY = "tickedProjects";

export const saveProjects = (projects) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const loadProjects = () => {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {
        console.log("Projects loaded from localstorage");
        return reviveProjects(JSON.parse(data));
    }

    console.log("no projects found in localStorage, starting fresh");
    return [];
}
