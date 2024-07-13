import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { SLoginComponent } from './s-login/s-login.component';
import { MyCourseComponent } from './my-course/my-course.component';
import { CourseIndexComponent } from './course-index/course-index.component';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { PronunciationComponent } from './pronunciation/pronunciation.component';
import { ConversationComponent } from './conversation/conversation.component';
import { PracticeComponent } from './practice/practice.component';
import { GrammerComponent } from './grammer/grammer.component';
import { UnitComponent } from './unit/unit.component';
import { Unit1Component } from './unit1/unit1.component';


const routes: Routes = [{
  path: '', component: StudentComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'login', component: SLoginComponent },
      { path: 'mycourse/:id/:name', component: MyCourseComponent },
      { path: 'course', component: CourseIndexComponent,
      children: [
        { path: 'vocabulary/:id', component: VocabularyComponent },
        { path: 'pronunciation/:id', component: PronunciationComponent},
        { path: 'conversation/:id', component: ConversationComponent},
        { path: 'grammer/:id/:unit_id', component: GrammerComponent},
        { path: 'unit/:id', component: UnitComponent},
        { path: 'practiceUnit/:id', component: Unit1Component},
        { path: 'practice/:id/:unit_id', component: PracticeComponent},
      ] }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
