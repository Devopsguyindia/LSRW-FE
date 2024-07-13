import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  AdminComponent
} from './admin.component';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import {
  SchoolComponent
} from './school/school.component';
import {
  StudentComponent
} from './student/student.component';
import {
  LoginComponent
} from './login/login.component';
import {
  BatchComponent
} from './batch/batch.component';
import {
  TeacherComponent
} from './teacher/teacher.component';
import {
  TloginComponent
} from './tlogin/tlogin.component';
import {
  BatchEnrollmentComponent
} from './batch-enrollment/batch-enrollment.component';
import {
  ProgressComponent
} from './progress/progress.component';
import {
  ProgressTopicComponent
} from './progress-topic/progress-topic.component';
import {
  BatchListComponent
} from './batch-list/batch-list.component';

const routes: Routes = [{
  path: 'school',
  component: AdminComponent,
  children: [{
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'registration',
      component: SchoolComponent
    },
    {
      path: 'student',
      component: StudentComponent
    },
    {
      path: 'teacher',
      component: TeacherComponent
    },
    {
      path: 'batch',
      component: BatchComponent
    },
    {
      path: 'teacher-login',
      component: TloginComponent
    },
    {
      path: 'batch-enrollment',
      component: BatchEnrollmentComponent
    },
    {
      path: 'batch-list',
      component: BatchListComponent
    },
    {
      path: 'progress/:id',
      component: ProgressComponent
    },
    {
      path: 'progress-topic/:id/:topic_id',
      component: ProgressTopicComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
