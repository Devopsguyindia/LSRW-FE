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
  CookieService
} from 'ngx-cookie-service';
import {
  BatchService
} from '../batch/batch.service';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styleUrls: ['./batch-list.component.css']
})
export class BatchListComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  user: any = {};
  users: any = [];
  users1: any = [];
  studentList: any = [];
  batchList: any = [];
  batch_id = undefined;
  batch_idl = 0;
  selectStudents = false;
  endUser;
  searchuser1;
  p;
  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private batchservice: BatchService, private studentservice: StudentService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService) {
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

  getBatchStudents(id) {
    this.batch_idl = id;
    const obj = {
      id: id,
      school_id: JSON.parse(this.sessionstorage.get('user_data')).school_id
    };
    this.batchservice.getBatchStudents(obj).subscribe(data => {
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

  deleteBatch(id) {
    const obj = {
      id: id
    };
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.batchservice.deleteStudentBatch(obj).subscribe(data => {
          this.users = data;
          if (this.users.status === 1) {
            swal({
              title: 'Success!',
              text: this.users.message,
              type: 'success',
              confirmButtonText: 'Ok'
            });
            this.getBatchStudents(this.batch_idl);
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
    });
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
