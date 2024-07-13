import { Component, OnInit } from '@angular/core';
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
  BatchService
} from './batch.service';
import {
  CookieService
} from 'ngx-cookie-service';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  userForm: FormGroup;
  submitted = false;
  user: any = {};
  users: any = [];
  users1: any = [];
  clientList: any = [];
  courses: any = [];
  editFlag = false;
  xlsxFile;
  endUser;
  searchuser1;
  p;
  minDate = new Date(Date.now());
  formData = new FormData();
   // tslint:disable-next-line:max-line-length
   constructor(private route: ActivatedRoute, private router: Router, private batchservice: BatchService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService) {
    this.minDate.setDate(this.minDate.getDate() - 1).toString();
   }


  get f() {
    return this.userForm.controls;
  }

  onSubmit(user) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
      user.user_id = JSON.parse(this.sessionstorage.get('user_data')).school_id;
    if (!this.editFlag) {
      this.batchservice.saveBatch(user).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.clear();
          this.getBatchs(JSON.parse(this.sessionstorage.get('user_data')).school_id);
        } else {
          swal({
            title: 'Oops!',
            text: this.users.message,
            type: 'warning',
            confirmButtonText: 'Ok'
          });
        }
      })
    } else {
      this.batchservice.editBatch(user).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.getBatchs(JSON.parse(this.sessionstorage.get('user_data')).school_id);
          this.clear();
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
  }

  clear() {
    this.userForm.reset();
    this.userForm = this.fb.group({
      batchName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      course: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    this.submitted = false;
    this.editFlag = false;
  }

  getBatchs(id) {
    this.batchservice.getBatchs(id).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.clientList = this.users1.data;
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

  getCourses() {
    this.batchservice.getCourses().subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.courses = this.users1.data;
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

  getBatchById(id) {
    this.batchservice.getBatchById(id).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.user = this.users1.data;
        this.editFlag = true;
        this.user.start_date = new Date(this.user.start_date);
        this.user.end_date = new Date(this.user.end_date);
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

  deleteBatch(id) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.batchservice.deleteBatchs(id).subscribe(data => {
          this.users = data;
          if (this.users.status === 1) {
            swal({
              title: 'Success!',
              text: this.users.message,
              type: 'success',
              confirmButtonText: 'Ok'
            });
            this.getBatchs(JSON.parse(this.sessionstorage.get('user_data')).school_id);
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

  searchBatch(search) {
    const obj = {
      search : search,
      user_id : JSON.parse(this.sessionstorage.get('user_data')).school_id
    };
    this.batchservice.searchBatch(obj).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.clientList = this.users1.data;
      } else {
        swal({
          title: 'Oops!',
          text: this.users1.message,
          type: 'warning',
          confirmButtonText: 'Ok'
        });
        this.getBatchs(JSON.parse(this.sessionstorage.get('user_data')).school_id);
      }
    });
  }


  ngOnInit() {

    this.userForm = this.fb.group({
      batchName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      course: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
    if (this.sessionstorage.get('user_data')) {
      this.getBatchs(JSON.parse(this.sessionstorage.get('user_data')).school_id);
      this.getCourses();
      this.mainservice.loginFlag = true;
    } else {
      this.router.navigateByUrl('/school/login');
    }
  }

}
