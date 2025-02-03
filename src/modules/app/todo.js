

export class Todo {
    constructor(title, description, dueDate, priority, notes = "", completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.completed = completed;
    }

    toggleComplete() {
        this.completed = !this.completed;
        console.log(`Todo ${this.title} marked as ${this.completed ? "completed" : "incomplete"}.`);
    }
}

