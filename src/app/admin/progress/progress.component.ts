import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import swal from 'sweetalert2';
import {
  MainService
} from '../main.service';
import {
  StudentService
} from '../student/student.service';
import {
  ProgressService
} from './progress.service';
import {
  CookieService
} from 'ngx-cookie-service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  user: any = {};
  users: any = [];
  users1: any = [];
  studentList: any = [];
  progressList: any = [];
  batch_id = undefined;
  selectStudents = false;
  userId;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private progressservice: ProgressService, private studentservice: StudentService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService) {
  }

  getProgressByStudent(id) {
    const obj = {
      id: id
    };
    this.progressservice.getProgressByStudent(obj).subscribe(data => {
      this.users = data;
      if (this.users.status === 1) {
        this.progressList = this.users.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.users.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  ngOnInit() {
    if (this.sessionstorage.get('user_data')) {
      this.route.params.subscribe(params => {
        if (params.id) {
          this.getProgressByStudent(params.id);
          this.userId = params.id;
        } else {
          this.router.navigateByUrl('/school/teacher-login');
        }
      });
      this.mainservice.loginFlag = true;
    } else {
      this.router.navigateByUrl('/school/teacher-login');
    }
  }

}
