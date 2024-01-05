
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';
import { Task } from './models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskList: Task[] = [
    { id: '1', value: 'Complete task A', completed: false },
    { id: '2', value: 'Read a book', completed: true },
    { id: '3', value: 'Learn Angular', completed: false },
  ];

  constructor() { }

  getTasks() : Observable<Task[]> {
    return of(this.taskList);
  }

    getTasksAsPromise() {
    return lastValueFrom(this.getTasks());
  }

  getTask(id: string): Observable<Task | undefined> {
    const task = this.taskList.find(t => t.id === id);
    return of(task);
  }

  addTask(value: string): Observable<Task> {
    const newTask: Task = {
      id: (this.taskList.length + 1).toString(), // Generating a simple incremental ID
      value,
      completed: false
    };

    this.taskList = [...this.taskList, newTask];

    return of(newTask);
  }

  updateTask(updatedTask: Task): Observable<Task> {
    const index = this.taskList.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.taskList[index] = updatedTask;
    }

    return of(updatedTask);
  }

  deleteTask(task: Task): Observable<Task> {
    this.taskList = this.taskList.filter(t => t.id !== task.id);
    return of(task);
  }
}
