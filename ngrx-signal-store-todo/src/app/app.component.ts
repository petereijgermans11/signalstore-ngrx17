import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TaskStore } from './store/taskState';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TaskStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly store = inject(TaskStore);

  private readonly formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    taskValue: ['', Validators.required],
    done: [false],
  });

  addTask() {
    this.store.addTask(this.form.value.taskValue);
    this.form.reset();
  }

  title = 'ngrx-signal-store-todo';
}
