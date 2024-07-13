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
  TeacherService
} from './teacher.service';
import {
  CookieService
} from 'ngx-cookie-service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  templateUrl = this.mainservice.templateUrl + 'api/uploads/';
  userForm: FormGroup;
  submitted = false;
  user: any = {};
  users: any = [];
  users1: any = [];
  clientList: any = [];
  editFlag = false;
  xlsxFile;
  formData = new FormData();
  endUser;
  searchuser1;
  p;
   // tslint:disable-next-line:max-line-length
   constructor(private route: ActivatedRoute, private router: Router, private teacherservice: TeacherService, private fb: FormBuilder, public sessionstorage: CookieService, public mainservice: MainService) { 
    this.user.gender = 'male';
  }


  get f() {
    return this.userForm.controls;
  }

  onSubmit(user) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.invalid) {
      console.log(this.userForm);
      return;
    }
      user.school_id = JSON.parse(this.sessionstorage.get('user_data')).id;
    if (!this.editFlag) {
      this.teacherservice.saveTeacher(user).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.clear();
          this.getTeachers(JSON.parse(this.sessionstorage.get('user_data')).id);
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
      this.teacherservice.editTeacher(user).subscribe(data => {
        this.users = data;
        if (this.users.status === 1) {
          swal({
            title: 'Success!',
            text: this.users.message,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.getTeachers(JSON.parse(this.sessionstorage.get('user_data')).id);
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
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      gender: ['']
    });
    this.user.gender = 'male';
    this.editFlag = false;
    this.submitted = false;
  }

  getTeachers(id) {
    this.teacherservice.getTeachers(id).subscribe(data => {
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

  getTeacherById(id) {
    this.teacherservice.getTeacherById(id).subscribe(data => {
      this.users1 = data;
      if (this.users1.status === 1) {
        this.user = this.users1.data;
        this.editFlag = true;
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

  deleteTeacher(id) {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.teacherservice.deleteTeachers(id).subscribe(data => {
          this.users = data;
          if (this.users.status === 1) {
            swal({
              title: 'Success!',
              text: this.users.message,
              type: 'success',
              confirmButtonText: 'Ok'
            });
            this.getTeachers(JSON.parse(this.sessionstorage.get('user_data')).id);
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

  searchTeacher(search) {
    const obj = {
      search : search,
      school_id : JSON.parse(this.sessionstorage.get('user_data')).id
    };
    this.teacherservice.searchTeacher(obj).subscribe(data => {
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
        this.getTeachers(JSON.parse(this.sessionstorage.get('user_data')).id);
      }
    });
  }

  ngOnInit() {

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z\s\w -]+$'),
        Validators.minLength(3), Validators.maxLength(50)
      ]],
      gender: ['']
    });
    if (this.sessionstorage.get('user_data')) {
      this.getTeachers(JSON.parse(this.sessionstorage.get('user_data')).id);
      this.mainservice.loginFlag = true;
    } else {
      this.router.navigateByUrl('/school/login');
    }
  }

}
