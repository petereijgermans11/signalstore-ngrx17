import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { Task } from '../models/task';
import { TaskService } from '../task.service';
import { TaskState } from './taskState';

export function withTasksMethods() {
  return signalStoreFeature(
    { state: type<TaskState>() },
    withMethods((store, taskService = inject(TaskService)) => ({
      loadAllTasks: rxMethod<void>(
        pipe(
          switchMap(() => {
            patchState(store, { loading: true });

            return taskService.getItems().pipe(
              tapResponse({
                next: (items) => patchState(store, { items }),
                error: console.error,
                finalize: () => patchState(store, { loading: false }),
              })
            );
          })
        )
      ),
      async loadAllTasksByPromise() {
        patchState(store, { loading: true });

        const items = await taskService.getItemsAsPromise();

        patchState(store, { items, loading: false });
      },
      addTask: rxMethod<string>(
        pipe(
          switchMap((value) => {
            patchState(store, { loading: true });

            return taskService.addItem(value).pipe(
              tapResponse({
                next: (item) =>
                  patchState(store, { items: [...store.items(), item] }),
                error: console.error,
                finalize: () => patchState(store, { loading: false }),
              })
            );
          })
        )
      ),
      moveToCompleted: rxMethod<Task>(
        pipe(
          switchMap((task) => {
            patchState(store, { loading: true });

            const toSend = { ...task, completed: !task.completed };

            return taskService.updateItem(toSend).pipe(
              tapResponse({
                next: (updatedTask) => {
                  const allItems = [...store.items()];
                  const index = allItems.findIndex((x) => x.id === task.id);

                  allItems[index] = updatedTask;

                  patchState(store, {
                    items: allItems,
                  });
                },
                error: console.error,
                finalize: () => patchState(store, { loading: false }),
              })
            );
          })
        )
      ),

      deleteTask: rxMethod<Task>(
        pipe(
          switchMap((task) => {
            patchState(store, { loading: true });

            return taskService.deleteItem(task).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    items: [...store.items().filter((x) => x.id !== task.id)],
                  });
                },
                error: console.error,
                finalize: () => patchState(store, { loading: false }),
              })
            );
          })
        )
      ),
    }))
  );
}
