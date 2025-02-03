import { clearContent } from "./helpers"
import { Todo } from "./app/todo"
import { Project } from "./app/project"
import { saveProjects } from "./app/storage"

let projects = [];


let defaultProject = new Project("Default");
projects.push(defaultProject);
let activeProject = defaultProject;

const renderSideNav = (nav) => {

    nav.innerHTML = "";

    projects.forEach(project => {
        const btn = document.createElement("button");
        btn.textContent = project.name; 

        btn.addEventListener("click", () => {

            activeProject = project;
            renderTaskList(document.querySelector(".tasks-list"));
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

    // Create a sorted copy so that incomplete tasks come first.
    const sortedTodos = activeProject.todos.slice().sort((a, b) => a.completed - b.completed);

    sortedTodos.forEach(todo => {
        const divCard = document.createElement("div");
        divCard.classList.add("task-card");
        // Add a CSS class for completed tasks for visual styling (e.g., line-through).
        if (todo.completed) {
            divCard.classList.add("completed");
        }
        // Use a label containing a checkbox and the task title.
        divCard.innerHTML = `
                <input type="checkbox" class="complete-checkbox" ${todo.completed ? "checked" : ""}>
                <span>${todo.title}</span>
        `;
        taskContainer.appendChild(divCard);

        // Attach an event listener to the checkbox.
        const checkbox = divCard.querySelector(".complete-checkbox");
        checkbox.addEventListener("change", (e) => {
            e.stopPropagation(); // Prevent the click from triggering other events.
            // Toggle the task's completed property based on the checkbox.
            todo.completed = e.target.checked;
            saveProjects([defaultProject]);   // Save updated project state to localStorage.
            renderTaskList(container);          // Re-render to update styling and ordering.
        });

        // Attach a click listener for showing task details.
        divCard.addEventListener("click", () => {
            const detailContainer = document.querySelector(".task-detail");
            renderTaskDetail(todo, detailContainer);
        });
    });
};



const renderToDoLists = (todoLists) => {
    const div = document.createElement("div");
    div.classList.add("tasks-container");
    todoLists.appendChild(div)
}

const openProjectModal = (container) => {

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
        
        activeProject = newProject;

        container.removeChild(form)
        renderSideNav(container);
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
        <h2>Good Morning.</h2>
        <h3>Time to add your first tasks.</h3>
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
    
        saveProjects([defaultProject]);
    
        
        form.reset();
        container.querySelector("#formModal").classList.add("hidden");

    });

    container.querySelector("#cancelbtn").addEventListener("click", (e) => {
        e.preventDefault();
        form.reset();
        container.querySelector("#formModal").classList.add("hidden");

    })
};

const renderTaskDetail = (todo, container) => {
    
    
    container.innerHTML = `
    <h1>Your task.</h1>
    <p><strong>Title:</strong> ${todo.title}</p>
    <p><strong>Description:</strong> ${todo.description}</p>
    <p><strong>Due Date:</strong> ${todo.dueDate}</p>
    <p><strong>Priority:</strong> ${todo.priority}</p>
    <button id="editTaskBtn">Edit</button>
    `
    container.querySelector("#editTaskBtn").addEventListener("click", () => {
        renderTaskEdit(todo, container);
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
    <option value="low" ${todo.priority === "medium" ? "selected" : ""}>Medium</option>
    <option value="low" ${todo.priority === "high" ? "selected" : ""}>High</option>
    </select>
    </label>
    <button id="saveTaskBtn">Save</button>
    <button id="cancelEditBtn">Cancel</button>
    `;

    container.querySelector("#saveTaskBtn").addEventListener("click", () => {
        todo.title = container.querySelector("#editTitle").value;
        todo.description = container.querySelector("#editDescription").value;
        todo.dueDate = container.querySelector("#editDueDate").value;
        todo.priority = container.querySelector("#editPriority").value;

        saveProjects([activeProject]);

 // Re-render the entire task list so the updated title appears everywhere
        renderTaskList(document.querySelector(".tasks-list"));

    // Re-render the task details panel
        renderTaskDetail(todo, container);

    })

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
        const modal = document.querySelector("#formModal")
        modal.classList.remove("hidden");
    });
}

export const loadTicked = () => {
    if (document.querySelector(".ticked-content")) {
        return
    }

    clearContent();

    const content = document.querySelector(".content");
    const div = document.createElement("div");
    div.classList.add("ticked-content");

    div.innerHTML = `
    <div class="side-nav"></div>
    <div class="tasks-view">
        <div class="tasks-list"></div>
        <div class="task-detail"></div>
    </div>
    `;
    content.appendChild(div);

    const sidenav = div.querySelector(".side-nav");
    const sideTasks = div.querySelector(".tasks-view");
    const taskDiv = div.querySelector(".tasks-list");

    renderSideNav(sidenav)
    renderToDoForm(sideTasks)
    renderToDoLists(taskDiv)
    renderDefaultSetup(taskDiv)

    const detailContainer = div.querySelector(".task-detail");
    detailContainer.innerHTML = `<p>Select a task to see its details</p>`;
};

