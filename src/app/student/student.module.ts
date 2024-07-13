import {
  BrowserModule
} from '@angular/platform-browser';
import {
  NgModule
} from '@angular/core';
import {
  HttpModule
} from '@angular/http';
import {
  HttpClientModule
} from '@angular/common/http';
import {
  CommonModule
} from '@angular/common';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import { SLoginComponent } from './s-login/s-login.component';
import { MyCourseComponent } from './my-course/my-course.component';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { StudentRoutingModule } from './student-routing.module';
import { CourseIndexComponent } from './course-index/course-index.component';
import {
  StudentComponent
} from './student/student.component';
import {
  SHeaderComponent
} from './s-header/s-header.component';
import {
  SFooterComponent
} from './s-footer/s-footer.component';
import { ProgressBarModule } from 'angular-progress-bar';
import { PronunciationComponent } from './pronunciation/pronunciation.component';
import { ConversationComponent } from './conversation/conversation.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PracticeComponent } from './practice/practice.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { GrammerComponent } from './grammer/grammer.component';
import { DialogComponent } from './dialog/dialog.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { DndModule } from 'ngx-drag-drop';
import { MatListModule } from "@angular/material/list";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UnitComponent } from './unit/unit.component';
import { Unit1Component } from './unit1/unit1.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    StudentRoutingModule,
    ProgressBarModule,
    SlickCarouselModule,
    ChartsModule,
    NgxPaginationModule,
    DndModule,
    MatListModule,
    NgbModule
  ],
  declarations: [DashboardComponent, SLoginComponent, MyCourseComponent, VocabularyComponent, StudentComponent,
    SHeaderComponent,
    DialogComponent,
    SFooterComponent, CourseIndexComponent, PronunciationComponent, ConversationComponent, PracticeComponent, GrammerComponent, UnitComponent, Unit1Component],
  providers: [CookieService]
})
export class StudentModule {}
