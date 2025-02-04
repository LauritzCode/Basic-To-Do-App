import { clearContent, greetingMsg, reviveProjects  } from "./helpers"
import { Todo } from "./app/todo"
import { Project } from "./app/project"
import { loadProjects, saveProjects } from "./app/storage"
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns"      


let projects = [];
let defaultProject = new Project("Default");
let activeProject = defaultProject;

const loadedProjects = loadProjects();
if (loadedProjects.length > 0) {
    projects = reviveProjects(loadedProjects);
    activeProject = projects[0];

    saveProjects(projects); // ✅ Ensure storage is updated

    console.log("Loaded projects from storage:", projects);
} else {
    projects.push(defaultProject);
    activeProject = defaultProject;
    saveProjects(projects);
}





const renderSideNav = (nav) => {

    nav.innerHTML = "";

    projects.forEach(project => {
        const btn = document.createElement("button");
        btn.textContent = project.name; 

        btn.addEventListener("click", () => {

            activeProject = project;
            renderTaskList(document.querySelector(".tasks-list"));
            renderProjectHeader(document.querySelector(".project-header"))
        });
        nav.appendChild(btn);
    });

    const addProjectBtn = document.createElement("button");
    addProjectBtn.classList.add("add-project-btn");
    addProjectBtn.textContent = "+";
    addProjectBtn.addEventListener("click", () => openProjectModal(nav));
    nav.appendChild(addProjectBtn);
}


const renderTaskList = (container) => {
    const taskContainer = container.querySelector('.tasks-container');
    taskContainer.innerHTML = "";

    // Sort: Show incomplete tasks first
    const sortedTodos = activeProject.todos.slice().sort((a, b) => a.completed - b.completed);

    // Create sections
    const sections = {
        today: document.createElement("div"),
        tomorrow: document.createElement("div"),
        upcoming: document.createElement("div"),
        expired: document.createElement("div"),
        noDate: document.createElement("div") // Optional for tasks without a due date
    };

    sections.today.innerHTML = "<h3>Today</h3>";
    sections.tomorrow.innerHTML = "<h3>Tomorrow</h3>";
    sections.upcoming.innerHTML = "<h3>Upcoming</h3>";
    sections.expired.innerHTML = "<h3>Expired</h3>";
    sections.noDate.innerHTML = "<h3>No Due Date</h3>";

    Object.values(sections).forEach(section => {
        section.classList.add("section-wrap")
    })

    sortedTodos.forEach(todo => {
        const divCard = document.createElement("div");
        divCard.classList.add("task-card");

        //  Add CSS styling for completed tasks
        if (todo.completed) {
            divCard.classList.add("completed");
        }

        divCard.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${todo.completed ? "checked" : ""}>
            <span>${todo.title}</span>
        `;

        //  Handle due date categorization
        const dueDate = todo.dueDate ? parseISO(todo.dueDate) : null;

        if (!dueDate) {
            sections.noDate.appendChild(divCard); // Place tasks without a due date here
        } else if (isToday(dueDate)) {
            sections.today.appendChild(divCard);
        } else if (isTomorrow(dueDate)) {
            sections.tomorrow.appendChild(divCard);
        } else if (isPast(dueDate)) {
            sections.expired.appendChild(divCard);
        } else {
            sections.upcoming.appendChild(divCard);
        }

        //  Attach event listener for task completion
        const checkbox = divCard.querySelector(".complete-checkbox");

        checkbox.addEventListener("change", (e) => {
            e.stopPropagation(); // Prevents accidental clicks on the task itself
            todo.completed = e.target.checked;

            console.log("Task marked as complete:", todo);

            saveProjects(projects); //  Save to localStorage
            renderTaskList(container); // Re-render UI
            renderTaskDetail(todo, document.querySelector(".task-detail"));
        
        });

        // Attach event listener to open task details
        divCard.addEventListener("click", () => {
            const detailContainer = document.querySelector(".task-detail");
            renderTaskDetail(todo, detailContainer);
        });
    });

    // Append sections only if they have tasks
    if (sections.today.children.length > 1) taskContainer.appendChild(sections.today);
    if (sections.tomorrow.children.length > 1) taskContainer.appendChild(sections.tomorrow);
    if (sections.upcoming.children.length > 1) taskContainer.appendChild(sections.upcoming);
    if (sections.expired.children.length > 1) taskContainer.appendChild(sections.expired);
    if (sections.noDate.children.length > 1) taskContainer.appendChild(sections.noDate);
};



const renderToDoLists = (todoLists) => {
    const div = document.createElement("div");
    div.classList.add("tasks-container");
    todoLists.appendChild(div)
}

const openProjectModal = (container, callback) => {

    let existingModal = container.querySelector("#projectModal")
    if (existingModal) {
        existingModal.classList.remove("hidden");
        return
    }

    const form = document.createElement("form");

    form.innerHTML = `
    <div id="projectModal" class="project-modal">
    <label>
    <span>Project name:</span>
    <input class="project-name-form" type="text" placeholder="Personal..." required>
    </label>
    <button class="add-project-btn" type="submit">Add Project</button>
    <button class="cancel-project-btn">Cancel</button>
    </div>
    `
    const modalEl = form.querySelector("#projectModal");
    modalEl.classList.remove("hidden");

    container.appendChild(form);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

         //const projectModal = document.querySelector("#projectModal");
         // projectModal.classList.add("hidden");

        const projectTitle = form.querySelector(".project-name-form").value;

        const newProject = new Project(projectTitle)
        projects.push(newProject)
        saveProjects(projects);
        
        
        renderProjectHeader(document.querySelector(".project-header"));
        container.removeChild(form)
        renderTaskList(document.querySelector(".tasks-list"));
        renderSideNav(container);

        if (callback) callback(newProject);
        container.removeChild(form);
    });

    form.querySelector(".cancel-project-btn").addEventListener("click", () => {
        container.removeChild(form);
    })
}

const renderProjectHeader = (container) => {

    if (projects.length === 0) {
        container.innerHTML = `<h2>No Projects available</h2>`
        return;
    }

    container.innerHTML = `
    <h2>${activeProject.name}</h2>
    <button id="editProjectBtn">✎</button>
    `;

    container.querySelector("#editProjectBtn").addEventListener("click", () => {
        renderProjectEdit(container);
    })
}

const renderProjectEdit = (container) => {
    container.innerHTML = `
    <input type="text" id="editProjectName" value="${activeProject.name}">
    <button id="saveProjectBtn">Save</button>
    <button id="deleteProjectBtn">Delete</button>
    <button id="cancelProjectEditBtn">Cancel</button>
    `;

    container.querySelector("#saveProjectBtn").addEventListener("click", () => {
        activeProject.name = container.querySelector("#editProjectName").value;
        renderProjectHeader(container);
        renderSideNav(document.querySelector(".side-nav"));
        saveProjects(projects);
    });

    container.querySelector("#deleteProjectBtn").addEventListener("click", () => {
        projects = projects.filter(p => p !== activeProject)
        
        if (projects.length === 0) {
            activeProject = defaultProject || null;
        } else {
            activeProject = projects[0];
        }

        saveProjects(projects);
        activeProject = projects[0] || defaultProject;
        renderProjectHeader(container)
        renderSideNav(document.querySelector(".side-nav"));
        renderTaskList(document.querySelector(".tasks-list"));
        document.querySelector(".task-detail").innerHTML = `<p>Select a task to see its details</p>`;

    });

    container.querySelector("#cancelProjectEditBtn").addEventListener("click", () => {
        renderProjectHeader(container);
    });
}

const renderToDoForm = (container) => {

    const form = document.createElement("form");

    form.innerHTML = `
    <div id="formModal" class="form-modal hidden">
    <div class="form-wrap">
    <div class="modal-inputs">
    <h1>Add your first tasks</h1>
    <input class="modal-input" type="text" id="todoTitle" placeholder="Title..." required>
    <input type="text" class="modal-input" id="todoDescription" placeholder="Write description...">
    <div class="modal-date-priority"><input type="date" id="todoDueDate" required>
    <select id="toDoPriority">
    <option value="low">Low</option> 
    <option value="medium" selected>Medium</option>
    <option value="high">High</option>
    </select></div>
     </div>
     <div class="parallel-wrap">
        <h2>${greetingMsg()}</h2>
        <h3>Time to add your tasks.</h3>
    </div>
    </div>
     <div class="modal-buttons">
    <button class="add-todo-button" type="submit">Add Todo</button>
    <button class="cancelbtn" id="cancelbtn">back</button>
    </div>
      </div>
    `;

    container.appendChild(form);

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = container.querySelector("#todoTitle").value;
        const description = container.querySelector("#todoDescription").value;
        const dueDate = container.querySelector("#todoDueDate").value;
        const priority = container.querySelector("#toDoPriority").value;

        const newTodo = new Todo(title, description, dueDate, priority);
        activeProject.addTodo(newTodo);
        renderTaskList(container);
    
        saveProjects(projects);
    
        
        form.reset();
        container.querySelector("#formModal").classList.add("hidden");
        // container.removeChild(form);

    });

    container.querySelector("#cancelbtn").addEventListener("click", (e) => {
        e.preventDefault();
        form.reset();
        container.querySelector("#formModal").classList.add("hidden");

    })
};

const renderTaskDetail = (todo, container) => {

    if (!container) return;
    
    
    container.innerHTML = `
    <h1>Your task.</h1>
    <p><strong>Title:</strong> ${todo.title}</p>
    <p><strong>Description:</strong> ${todo.description}</p>
    <p><strong>Due Date:</strong> ${todo.dueDate ? format(new Date(todo.dueDate), "PPP") : "No due date"}</p>
    <p><strong>Priority:</strong> ${todo.priority}</p>
    <p><strong>Completed:</strong> ${todo.completed}</p>
    <div class="alteration-btns">
    <button id="editTaskBtn">Edit</button>
    <button id="deleteTaskBtn">Delete</button>
    </div>
    `
    container.querySelector("#editTaskBtn").addEventListener("click", () => {
        renderTaskEdit(todo, container);
    })

    container.querySelector("#deleteTaskBtn").addEventListener("click", () => {
        activeProject.todos = activeProject.todos.filter(t => t !== todo)
        saveProjects(projects);
        renderTaskList(document.querySelector(".tasks-list"));
        container.innerHTML = `
        <p>Select a task to see its details</p>
        ` 
    })
}

const renderTaskEdit = (todo, container) => {
    container.innerHTML = `
    <h1>Edit Task</h1>
    <label>
    Title: <input type="text" id="editTitle" value="${todo.title}">
    </label>
    <label>
    Description: <input type="text" id="editDescription" value="${todo.description}">
    </label>
    <label>
    Due Date: <input type="date" id="editDueDate" value="${todo.dueDate}">
    </label>
    <label>
    Priority:
    <select id="editPriority">
    <option value="low" ${todo.priority === "low" ? "selected" : ""}>Low</option>
    <option value="medium" ${todo.priority === "medium" ? "selected" : ""}>Medium</option>
    <option value="high" ${todo.priority === "high" ? "selected" : ""}>High</option>
    </select>
    </label>

    <label>
    Move to Project:
    <select id="moveProjectSelect">
    ${projects.map(proj => `<option value="${proj.name}" ${proj === activeProject ? "selected" : ""}>${proj.name}</option>`).join("")}
    <option value="add-new">➕ Add new project</option>
    </select>
    </label>

    <button id="saveTaskBtn">Save</button>
    <button id="cancelEditBtn">Cancel</button>
    `;

    container.querySelector("#saveTaskBtn").addEventListener("click", () => {
        const newTitle = container.querySelector("#editTitle").value;
        const newDescription = container.querySelector("#editDescription").value;
        const newDueDate = container.querySelector("#editDueDate").value;
        const newPriority = container.querySelector("#editPriority").value;
        const selectedProjectName = container.querySelector("#moveProjectSelect").value;

        if (selectedProjectName !== activeProject.name) {
            const targetProject = projects.find(proj => proj.name === selectedProjectName);

            if (targetProject) {
                activeProject.todos = activeProject.todos.filter(t => t !== todo);

                const movedTask = new Todo(newTitle, newDescription, newDueDate, newPriority);
                targetProject.addTodo(movedTask);
            //     activeProject = targetProject;

                saveProjects(projects);

                 // Re-render the entire task list so the updated title appears everywhere
                renderSideNav(document.querySelector(".side-nav"));
                renderTaskList(document.querySelector(".tasks-list"));
                document.querySelector(".task-detail").innerHTML = `<p>Select a task to see its details</p>`;
                renderProjectHeader(document.querySelector(".project-header"));

                return;
            }
        }

        todo.title = newTitle
        todo.description = newDescription;
        todo.dueDate = newDueDate;
        todo.priority = newPriority;

        saveProjects(projects);

        renderTaskList(document.querySelector(".tasks-list"));
        renderTaskDetail(todo, container);

    })

    const projectDropDown = container.querySelector("#moveProjectSelect");

projectDropDown.addEventListener("change", (e) => {
    if (e.target.value === "add-new") {
        openProjectModal(document.querySelector(".side-nav"), (newProject) => {
            if (newProject) {
               // projects.push(newProject); // Ensure it's in the list
                saveProjects(projects); // ✅ Save immediately

                projectDropDown.innerHTML = projects
                    .map(proj => `<option value="${proj.name}" ${proj.name === newProject.name ? "selected" : ""}>${proj.name}</option>`)
                    .join("") + `<option value="add-new">➕ Add new project</option>`;

                projectDropDown.value = newProject.name;
            }
        });
    }
});




    container.querySelector("#cancelEditBtn").addEventListener("click", () => {
        renderTaskDetail(todo, container);
    });
};

const renderDefaultSetup = (setup) => {
    const div = document.createElement("div");
    div.classList.add("addTaskBtnWrap")
    div.innerHTML = `
    <button id="addTaskBtn" class="addTaskBtn">Add Task</button>
    `
    setup.appendChild(div);


    setup.querySelector("#addTaskBtn").addEventListener("click", () => {
        if (projects.length === 0) {
            alert("You need to create a project before adding tasks.");
            openProjectModal(document.querySelector(".side-nav"));
            return;
        }

        const modal = document.querySelector("#formModal")
        modal.classList.remove("hidden");
    });
};

export const loadTicked = () => {
    if (document.querySelector(".ticked-content")) {
        return;
    }

    clearContent();

    const content = document.querySelector(".content");
    const div = document.createElement("div");
    div.classList.add("ticked-content");

    div.innerHTML = `
    <div class="side-nav"></div>
    <div class="tasks-wrapper">
        <div class="project-header"></div>
        <div class="tasks-view">
            <div class="tasks-list"></div>
            <div class="task-detail"></div>
    </div>
        </div>
    `;
    content.appendChild(div);

    const sidenav = div.querySelector(".side-nav");
    const sideTasks = div.querySelector(".tasks-view");
    const taskDiv = div.querySelector(".tasks-list");
    const projectHeader = div.querySelector(".project-header");

    renderProjectHeader(projectHeader);
    renderSideNav(sidenav);
    renderToDoForm(sideTasks);
    renderToDoLists(taskDiv);
    renderDefaultSetup(taskDiv);
    renderTaskList(taskDiv); 

    const detailContainer = div.querySelector(".task-detail");
    detailContainer.innerHTML = `<p>Select a task to see its details</p>`;
};
