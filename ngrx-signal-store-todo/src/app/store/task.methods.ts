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

            return taskService.getTasks().pipe(
              tapResponse({
                next: (tasks) => patchState(store, { tasks }),
                error: console.error,
                finalize: () => patchState(store, { loading: false }),
              })
            );
          })
        )
      ),
      async loadAllTasksByPromise() {
        patchState(store, { loading: true });

        const tasks = await taskService.getTasksAsPromise();

        patchState(store, { tasks, loading: false });
      },
      addTask: rxMethod<string>(
        pipe(
          switchMap((value) => {
            patchState(store, { loading: true });

            return taskService.addTask(value).pipe(
              tapResponse({
                next: (task) =>
                  patchState(store, { tasks: [...store.tasks(), task] }),
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

            return taskService.updateTask(toSend).pipe(
              tapResponse({
                next: (updatedTask) => {
                  const allTasks = [...store.tasks()];
                  const index = allTasks.findIndex((x) => x.id === task.id);

                  allTasks[index] = updatedTask;

                  patchState(store, {
                      tasks: allTasks,
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

            return taskService.deleteTask(task).pipe(
              tapResponse({
                next: () => {
                  patchState(store, {
                    tasks: [...store.tasks().filter((x) => x.id !== task.id)],
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
