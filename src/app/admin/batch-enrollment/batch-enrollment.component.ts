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
  BatchEnrollmentService
} from './batch-enrollment.service';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  BatchService
} from '../batch/batch.service';


@Component({
  selector: 'app-batch-enrollment',
  templateUrl: './batch-enrollment.component.html',
  styleUrls: ['./batch-enrollment.component.css']
})
export class BatchEnrollmentComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  user: any = {};
  users: any = [];
  users1: any = [];
  studentList: any = [];
  batchList: any = [];
  batch_id = undefined;
  selectStudents = false;
  endUser;
  searchuser1;
  p;
  
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private batchservice: BatchService, private batchservice1: BatchEnrollmentService, private studentservice: StudentService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService) {
    this.user.gender = 'male';
  }

  getStudents(id) {
    this.studentservice.getStudents(id).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.studentList = this.users1.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.users1.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  getBatchs(id) {
    this.batchservice.getBatchs(id).subscribe(data => {
      this.users = data;
      if (this.users.status === 1) {
        this.batchList = this.users.data;
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


  addSelectedStudents() {
    const addStudent = [];
    this.studentList.forEach(element => {
      if (element.checked) {
        addStudent.push(element);
      }
    });
    const obj = {
      'addStudent': addStudent,
      'batch_id': this.batch_id
    };
    if (addStudent.length > 0) {
      if (this.batch_id !== undefined) {
        this.batchservice1.saveBatchEnrollment(obj).subscribe(data => {
          this.users = data;
          if (this.users.status === 1) {
            swal({
              title: 'Success!',
              text: this.users.message,
              type: 'success',
              confirmButtonText: 'Ok'
            });
            this.unCheck();
          } else {
            swal({
              title: 'Oops!',
              text: this.users.message,
              type: 'warning',
              confirmButtonText: 'Ok'
            });
          }
        });
      } else {
        swal({
          title: 'Oops!',
          text: 'Please select batch',
          type: 'warning',
          confirmButtonText: 'Ok'
        });
      }
    } else {
      swal({
        title: 'Oops!',
        text: 'Please select at least one student',
        type: 'warning',
        confirmButtonText: 'Ok'
      });
    }
  }

  unCheck() {
    this.batch_id = undefined;
    this.studentList.forEach(element => {
      if (element.checked) {
        element.checked = false;
      }
    });
  }

  updateCheckedOptions(option, event) {
    this.studentList[this.studentList.indexOf(option)].checked = event.target.checked;
  }

  ngOnInit() {
    if (this.sessionstorage.get('user_data')) {
      this.getStudents(JSON.parse(this.sessionstorage.get('user_data')).school_id);
      this.getBatchs(JSON.parse(this.sessionstorage.get('user_data')).school_id);
      this.mainservice.loginFlag = true;
    } else {
      this.router.navigateByUrl('/school/teacher-login');
    }
  }
}
