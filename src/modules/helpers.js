import { Project } from "./app/project";
import { Todo } from "./app/todo";

export const clearContent = () => {
    document.querySelector(".content").innerHTML = "";
}

export const reviveProjects = (rawProjects) => {
    console.log("♻️ reviveProjects() called"); // ✅ Debugging
    return rawProjects.map(projData => {
        const proj = new Project(projData.name);

        proj.todos = (projData.todos || []).map(todoData => {
            console.log("Restoring todo:", todoData.title, "Completed:", todoData.completed); // ✅ Debugging
            return new Todo(
                todoData.title,
                todoData.description,
                todoData.dueDate,
                todoData.priority,
                todoData.completed 
            );
        });
        return proj;
    });
};


export const greetingMsg = () => {
    const hour = new Date().getHours()

    if (hour >= 4 && hour < 10) {
        return "Good Morning."
    } else if (hour >= 10 && hour < 17) {
        return "Good Afternoon."
    } else if (hour >= 17 && hour < 22) {
        return "Good Evening."
    } else {
        return "Good Night."
    }
}