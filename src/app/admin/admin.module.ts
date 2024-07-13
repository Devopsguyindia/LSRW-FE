import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  Sidebar1Component
} from './sidebar1/sidebar1.component';
import {
  LayoutModule
} from '@angular/cdk/layout';
import {
  LoginComponent,
  CopyDirective
} from './login/login.component';
import {
  AdminComponent
} from './admin.component';
import {
  HeaderComponent
} from './header/header.component';
import {
  FooterComponent
} from './footer/footer.component';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import {
  AdminRoutingModule
} from './admin-routing.module';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import {
  NgxPaginationModule
} from 'ngx-pagination';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';
import {
  ProgressBarModule
} from 'angular-progress-bar';
import {
  SchoolComponent
} from './school/school.component';
import {
  StudentComponent
} from './student/student.component';
import {
  TeacherComponent
} from './teacher/teacher.component';
import {
  BatchComponent
} from './batch/batch.component';
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
  BatchListComponent
} from './batch-list/batch-list.component';
import { ProgressTopicComponent } from './progress-topic/progress-topic.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({
      warnOnNgModelWithFormControl: 'never'
    }),
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    NgxPaginationModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ProgressBarModule
  ],
  declarations: [
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    Sidebar1Component,
    LoginComponent,
    CopyDirective,
    SchoolComponent,
    StudentComponent,
    TeacherComponent,
    BatchComponent,
    TloginComponent,
    BatchEnrollmentComponent,
    ProgressComponent,
    BatchListComponent,
    ProgressTopicComponent
  ]
})
export class AdminModule {}