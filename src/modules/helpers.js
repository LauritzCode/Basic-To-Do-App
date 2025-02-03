import { Project } from "./app/project";
import { Todo } from "./app/todo";

export const clearContent = () => {
    document.querySelector(".content").innerHTML = "";
}

export const reviveProjects = (rawProjects) => {
    return rawProjects.map(projData => {
        const proj = new Project(projData.name);

        proj.todos = (projData.todos || []).map(todoData => {
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
