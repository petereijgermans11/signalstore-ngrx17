// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { Todo } from './models/todo';
// import { lastValueFrom } from 'rxjs';

// const apiUrl = `https://sampletodobackend.azurewebsites.net/api/v1/`;

// @Injectable({
//   providedIn: 'root',
// })
// export class TodoService {
//   private readonly http = inject(HttpClient);

//   private url = `${apiUrl}todos`;

//   getItems() {
//     return this.http.get<Todo[]>(this.url);
//   }

//   getItemsAsPromise() {
//     return lastValueFrom(this.http.get<Todo[]>(this.url));
//   }

//   getItem(id: string) {
//     return this.http.get<Todo>(`${this.url}/${id}`);
//   }

//   addItem(value: string) {
//     return this.http.post<Todo>(this.url, { value });
//   }

//   updateItem(value: Todo) {
//     return this.http.put<Todo>(`${this.url}/${value.id}`, value);
//   }

//   deleteItem(value: Todo) {
//     return this.http.delete(`${this.url}/${value.id}`);
//   }
// }

import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, of } from 'rxjs';
import { Todo } from './models/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todoList: Todo[] = [
    { id: '1', value: 'Complete task A', done: false },
    { id: '2', value: 'Read a book', done: true },
    { id: '3', value: 'Learn Angular', done: false },
  ];

  constructor() { }

  getItems() : Observable<Todo[]> {
    return of(this.todoList);
  }

    getItemsAsPromise() {
    return lastValueFrom(this.getItems());
  }

  getItem(id: string): Observable<Todo | undefined> {
    const todo = this.todoList.find(t => t.id === id);
    return of(todo);
  }

  addItem(value: string): Observable<Todo> {
    const newTodo: Todo = {
      id: (this.todoList.length + 1).toString(), // Generating a simple incremental ID
      value,
      done: false
    };

    this.todoList = [...this.todoList, newTodo];

    return of(newTodo);
  }

  updateItem(updatedTodo: Todo): Observable<Todo> {
    const index = this.todoList.findIndex(todo => todo.id === updatedTodo.id);
    if (index !== -1) {
      this.todoList[index] = updatedTodo;
    }

    return of(updatedTodo);
  }

  deleteItem(todo: Todo): Observable<Todo> {
    this.todoList = this.todoList.filter(t => t.id !== todo.id);
    return of(todo);
  }
}
