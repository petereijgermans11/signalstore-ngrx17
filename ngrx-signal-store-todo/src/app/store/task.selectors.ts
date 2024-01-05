import {computed} from '@angular/core';
import {signalStoreFeature, type, withComputed} from '@ngrx/signals';
import {TaskState} from './taskState';

export function withTasksSelectors() {
    return signalStoreFeature(
        {state: type<TaskState>()},
        withComputed(({tasks}) => ({
            completedCount: computed(() => tasks().filter((x) => x.completed).length),
            notCompletedCount: computed(() => tasks().filter((x) => !x.completed).length),
            percentageCompleted: computed(() => {
                const completed = tasks().filter((x) => x.completed).length;
                const total = tasks().length;

                if (total === 0) {
                    return 0;
                }

                return (completed / total) * 100;
            }),
        })),
    );
}
