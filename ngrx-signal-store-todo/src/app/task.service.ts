
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';
import { Task } from './models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private todoList: Task[] = [
    { id: '1', value: 'Complete task A', completed: false },
    { id: '2', value: 'Read a book', completed: true },
    { id: '3', value: 'Learn Angular', completed: false },
  ];

  constructor() { }

  getItems() : Observable<Task[]> {
    return of(this.todoList);
  }

    getItemsAsPromise() {
    return lastValueFrom(this.getItems());
  }

  getItem(id: string): Observable<Task | undefined> {
    const todo = this.todoList.find(t => t.id === id);
    return of(todo);
  }

  addItem(value: string): Observable<Task> {
    const newTodo: Task = {
      id: (this.todoList.length + 1).toString(), // Generating a simple incremental ID
      value,
      completed: false
    };

    this.todoList = [...this.todoList, newTodo];

    return of(newTodo);
  }

  updateItem(updatedTodo: Task): Observable<Task> {
    const index = this.todoList.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      this.todoList[index] = updatedTodo;
    }

    return of(updatedTodo);
  }

  deleteItem(todo: Task): Observable<Task> {
    this.todoList = this.todoList.filter(t => t.id !== todo.id);
    return of(todo);
  }
}
