export class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo)
        console.log(`Added todo "${todo.title}" to project "${this.name}".`);
    }

    removeTodo(todoTitle) {
        this.todo = this.todos.filter(todo => todo.title !== todoTitle);
        console.log(`Removed todo "${this.todoTitle}" from project "${this.name}.`)
    }
}

