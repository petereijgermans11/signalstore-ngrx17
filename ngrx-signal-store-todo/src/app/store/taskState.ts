import { signalStore, withHooks, withState } from '@ngrx/signals';
import { Task } from '../models/task';
import { withTasksMethods } from './task.methods';
import { withTasksSelectors } from './task.selectors';

export interface TaskState {
  tasks: Task[];
  loading: boolean;
}

export const initialState: TaskState = {
  tasks: [],
  loading: false,
};

export const TaskStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withTasksSelectors(),
  withTasksMethods(),
  withHooks({
    onInit({ loadAllTasksByPromise: loadAllTasksByPromise }) {
      console.log('on init');
      loadAllTasksByPromise();
    },
    onDestroy() {
      console.log('on destroy');
    },
  })
);
