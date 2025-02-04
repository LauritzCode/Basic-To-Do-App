import { reviveProjects } from "../helpers";
const STORAGE_KEY = "tickedProjects";

export const saveProjects = (projects) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const loadProjects = () => {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data || data === "undefined") {
        return [];
    }

    try {
        const parsedData = JSON.parse(data);
        return reviveProjects(parsedData);
    } catch (error) {
        return [];
    }
};

