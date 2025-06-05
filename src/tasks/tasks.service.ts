import { Injectable } from '@nestjs/common';
import type Task from './dto/task';
import { generateUUID } from '../utils/uuid-generator';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  constructor() {
    this.tasks = [
      { id: generateUUID(), title: 'Task 1', isCompleted: false },
      { id: generateUUID(), title: 'Task 2', isCompleted: true },
    ];
  }

  createTask(title: string, isCompleted: boolean) {
    const id = generateUUID();
    const newTask = { id, title, isCompleted };
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks() {
    return this.tasks;
  }

  getTaskByTitle(title: string) {
    return this.tasks.find((task) => task.title === title);
  }

  updateTask(id: string, title: string, isCompleted: boolean) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.title = title;
      task.isCompleted = isCompleted;
      return task;
    }
    return null;
  }

  deleteTask(id: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      const deletedTask = this.tasks[taskIndex];
      this.tasks.splice(taskIndex, 1);
      return deletedTask;
    }
    return null;
  }
}
